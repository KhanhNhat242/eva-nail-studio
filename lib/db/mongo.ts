import 'server-only'
import { MongoClient, type Collection, type Db } from 'mongodb'
import { PURGE_AFTER_DAYS, SOFT_DELETE_COLLECTIONS, type CollectionMap, type CollectionName } from '@/types/cms'

/**
 * Một MongoClient dùng chung cho cả tiến trình (giữ qua globalThis để hot reload khi dev không mở thêm kết nối).
 * Gắn với URI: đổi MONGODB_URI trong .env lúc đang chạy dev → đóng kết nối cũ, mở kết nối mới.
 * Kết nối lỗi → xoá promise để lần gọi sau thử lại.
 */
type Conn = { uri: string; client: Promise<MongoClient> }
const g = globalThis as typeof globalThis & { __evaMongoConn?: Conn }

export function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Thiếu biến môi trường MONGODB_URI (xem .env.example)')
  let conn = g.__evaMongoConn
  if (!conn || conn.uri !== uri) {
    conn?.client.then((c) => c.close()).catch(() => {})
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
      .connect()
      .then(async (c) => {
        // Lỗi tạo index không chặn website (chỉ ghi log); lần kết nối sau sẽ thử lại
        await ensureSoftDeleteTtl(c.db(process.env.MONGODB_DB || 'eva_nail_studio')).catch((e: unknown) => console.error('[mongo] tạo TTL index thất bại', e))
        return c
      })
      .catch((e: unknown) => {
        if (g.__evaMongoConn?.client === client) g.__evaMongoConn = undefined
        throw e
      })
    conn = { uri, client }
    g.__evaMongoConn = conn
  }
  return conn.client.then((c) => c.db(process.env.MONGODB_DB || 'eva_nail_studio'))
}

/**
 * Tự xóa cứng bản ghi đã xóa mềm sau PURGE_AFTER_DAYS ngày: TTL index trên `deleted_at`
 * (MongoDB tự dọn, ~1 phút/lần; bản ghi không có `deleted_at` — chưa xóa hoặc đã khôi phục — không bị đụng tới).
 * Bản ghi xóa mềm từ trước khi có `deleted_at` được gắn mốc "bây giờ" (giờ máy chủ DB, $$NOW) để bắt đầu đếm.
 * Chạy 1 lần mỗi kết nối; createIndex trùng định nghĩa là no-op.
 */
async function ensureSoftDeleteTtl(db: Db) {
  const expireAfterSeconds = PURGE_AFTER_DAYS * 24 * 60 * 60
  await Promise.all(
    SOFT_DELETE_COLLECTIONS.map(async (name) => {
      const c = db.collection(name)
      await c.updateMany({ is_deleted: true, deleted_at: { $exists: false } }, [{ $set: { deleted_at: '$$NOW' } }])
      await c.createIndex({ deleted_at: 1 }, { name: 'purge_soft_deleted', expireAfterSeconds })
    }),
  )
}

export async function col<K extends CollectionName>(name: K): Promise<Collection<CollectionMap[K]>> {
  return (await getDb()).collection<CollectionMap[K]>(name)
}

/** Bộ lọc bỏ bản ghi đã xóa mềm. Dùng `$ne: true` để bản ghi cũ chưa có trường is_deleted vẫn được tính là chưa xóa. */
export const NOT_DELETED = { is_deleted: { $ne: true } } as const
