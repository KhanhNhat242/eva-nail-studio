import 'server-only'
import { MongoClient, type Collection, type Db } from 'mongodb'
import type { CollectionMap, CollectionName } from '@/types/cms'

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
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect().catch((e: unknown) => {
      if (g.__evaMongoConn?.client === client) g.__evaMongoConn = undefined
      throw e
    })
    conn = { uri, client }
    g.__evaMongoConn = conn
  }
  return conn.client.then((c) => c.db(process.env.MONGODB_DB || 'eva_nail_studio'))
}

export async function col<K extends CollectionName>(name: K): Promise<Collection<CollectionMap[K]>> {
  return (await getDb()).collection<CollectionMap[K]>(name)
}

/** Bộ lọc bỏ bản ghi đã xóa mềm. Dùng `$ne: true` để bản ghi cũ chưa có trường is_deleted vẫn được tính là chưa xóa. */
export const NOT_DELETED = { is_deleted: { $ne: true } } as const
