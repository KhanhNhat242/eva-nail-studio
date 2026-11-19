/**
 * Nạp dữ liệu khởi tạo từ docs/cms-seed/*.json vào MongoDB.
 *
 *   npm run db:seed                 # nạp nội dung (upsert theo _id — chạy lại an toàn, GHI ĐÈ nội dung đã sửa trong CMS)
 *   npm run db:seed -- --with-samples   # thêm bản ghi THỬ NGHIỆM đặt lịch / đăng ký học
 *   npm run db:seed -- --only-missing   # chỉ nạp collection còn trống (không đụng dữ liệu đã có)
 *
 * Đọc MONGODB_URI, MONGODB_DB từ biến môi trường (npm script tự nạp file .env qua --env-file-if-exists).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MongoClient, type AnyBulkWriteOperation, type Document } from 'mongodb'

const root = join(import.meta.dirname, '..')
const seedDir = join(root, 'docs', 'cms-seed')
const args = new Set(process.argv.slice(2))
const withSamples = args.has('--with-samples')
const onlyMissing = args.has('--only-missing')

const LISTS = ['service', 'combo', 'price', 'model', 'course', 'achievement', 'whyus'] as const
const SINGLETONS = [
  'hero_grid',
  'service_section',
  'combo_section',
  'price_list',
  'model_section',
  'course_section',
  'achievement_section',
  'whyus_section',
] as const
const SAMPLES = ['booking_customer', 'course_student'] as const

const read = (name: string): unknown => JSON.parse(readFileSync(join(seedDir, `${name}.json`), 'utf8'))

/** id → _id; giữ các trường còn lại. */
function toDoc(item: Record<string, unknown>): Document {
  const { id, ...rest } = item
  return { _id: String(id), ...rest }
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Thiếu MONGODB_URI. Tạo file .env theo .env.example.')
  process.exit(1)
}
const client = new MongoClient(uri)
await client.connect()
const db = client.db(process.env.MONGODB_DB || 'eva_nail_studio')

async function upsertAll(name: string, docs: Document[]) {
  const c = db.collection(name)
  if (onlyMissing && (await c.estimatedDocumentCount()) > 0) {
    console.log(`  bỏ qua ${name} (đã có dữ liệu)`)
    return
  }
  const ops: AnyBulkWriteOperation[] = docs.map((d) => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } }))
  const r = await c.bulkWrite(ops)
  console.log(`  ${name}: ${docs.length} bản ghi (thêm ${r.upsertedCount}, cập nhật ${r.modifiedCount})`)
}

try {
  console.log(`Nạp dữ liệu vào "${db.databaseName}"…`)
  for (const name of LISTS) {
    await upsertAll(name, (read(name) as Record<string, unknown>[]).map(toDoc))
  }
  for (const name of SINGLETONS) {
    await upsertAll(name, [{ _id: 'main', ...(read(name) as Document) }])
  }
  if (withSamples) {
    for (const name of SAMPLES) {
      const docs = (read(name) as Record<string, unknown>[]).map((item) => {
        const d = toDoc(item)
        const label = String(name === 'booking_customer' ? d.service : d.course_name)
        return {
          ...d,
          [name === 'booking_customer' ? 'service_label' : 'course_label']: `${label} (dữ liệu thử nghiệm)`,
          status: 'new',
          created_at: new Date(),
        }
      })
      await upsertAll(name, docs)
    }
  }
  // Chỉ mục cho trang quản trị (lọc theo trạng thái, sắp xếp theo thời gian)
  for (const name of SAMPLES) await db.collection(name).createIndex({ status: 1, created_at: -1 })
  console.log('Xong.')
} finally {
  await client.close()
}
