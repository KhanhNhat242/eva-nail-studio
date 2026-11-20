import 'server-only'
import { randomBytes } from 'node:crypto'
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NOT_DELETED, col } from '@/lib/db/mongo'
import { entityByCollection, slugify, type ContentCollection } from '@/lib/cms/schema'
import { HERO_SLOTS, SECTION_ID } from '@/types/cms'

/**
 * Ảnh tải lên từ CMS.
 * - Lưu file ở `public/images/uploads/` (người dùng chọn 20/11/2026).
 * - Phục vụ qua route `/uploads/<tên file>` (app/uploads/[file]/route.ts), KHÔNG qua `/images/uploads/...`:
 *   `next start` chỉ quét thư mục public lúc khởi động, nên file thêm sau sẽ 404 cho tới khi restart.
 * Tên file: ASCII kebab-case + mã thời gian (duy nhất, không ghi đè; next/image cache theo URL nên không bị ảnh cũ).
 */

export const UPLOAD_DIR = join(process.cwd(), 'public', 'images', 'uploads')
export const UPLOAD_PREFIX = '/uploads/'
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const FILE_RE = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/

export const CONTENT_TYPES: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' }

/** Tên file hợp lệ (chặn path traversal) → đường dẫn tuyệt đối, hoặc null. */
export function uploadPath(file: string): string | null {
  return FILE_RE.test(file) ? join(UPLOAD_DIR, file) : null
}

/** "/uploads/abc.jpg" → "abc.jpg" nếu hợp lệ. */
export function fileFromUrl(url: string): string | null {
  if (!url.startsWith(UPLOAD_PREFIX)) return null
  const file = url.slice(UPLOAD_PREFIX.length)
  return FILE_RE.test(file) ? file : null
}

/** Nhận dạng định dạng ảnh theo vài byte đầu (không tin đuôi file / MIME do trình duyệt gửi). */
function sniff(b: Uint8Array): keyof typeof CONTENT_TYPES | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to))
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg'
  if (b[0] === 0x89 && ascii(1, 4) === 'PNG') return 'png'
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp'
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return 'avif'
  return null
}

export type SaveUploadResult = { ok: true; url: string } | { ok: false; error: string }

export async function saveUpload(file: File): Promise<SaveUploadResult> {
  if (file.size === 0) return { ok: false, error: 'File rỗng.' }
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: 'Ảnh quá lớn (tối đa 5MB).' }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const ext = sniff(bytes)
  if (!ext) return { ok: false, error: 'Chỉ nhận ảnh JPG, PNG, WebP hoặc AVIF.' }

  const base = slugify(file.name.replace(/\.[^.]*$/, '')).slice(0, 60) || 'anh'
  const name = `${base}-${Date.now().toString(36)}${randomBytes(2).toString('hex')}.${ext}`
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(join(UPLOAD_DIR, name), bytes, { flag: 'wx' })
  return { ok: true, url: `${UPLOAD_PREFIX}${name}` }
}

/** Ảnh đã tải lên, mới nhất trước. */
export async function listUploads(): Promise<string[]> {
  let names: string[]
  try {
    names = (await readdir(UPLOAD_DIR)).filter((n) => FILE_RE.test(n))
  } catch {
    return []
  }
  const withTime = await Promise.all(names.map(async (n) => ({ n, t: (await stat(join(UPLOAD_DIR, n))).mtimeMs })))
  return withTime.sort((a, b) => b.t - a.t).map(({ n }) => `${UPLOAD_PREFIX}${n}`)
}

export async function readUpload(file: string): Promise<Buffer | null> {
  const p = uploadPath(file)
  if (!p) return null
  try {
    return await readFile(p)
  } catch {
    return null
  }
}

const IMAGE_COLLECTIONS: ContentCollection[] = ['service', 'combo', 'model', 'course', 'achievement', 'whyus']

/**
 * Nơi đang dùng từng ảnh: Hero + item chưa xóa mềm (mọi trường ảnh trong schema đều tên `img`).
 * Trả về map url → danh sách nhãn ("Ảnh Hero", "Dịch vụ"…).
 */
export async function findUsages(urls: string[]): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>(urls.map((u) => [u, []]))
  if (!urls.length) return out
  const add = (url: unknown, label: string) => {
    const list = typeof url === 'string' ? out.get(url) : undefined
    if (list && !list.includes(label)) list.push(label)
  }
  const hero = await (await col('hero_grid')).findOne({ _id: SECTION_ID } as never)
  if (hero) for (const k of HERO_SLOTS) add(hero[k]?.img, 'Ảnh Hero')
  await Promise.all(
    IMAGE_COLLECTIONS.map(async (c) => {
      const docs = await (await col(c)).find({ img: { $in: urls }, ...NOT_DELETED } as never).toArray()
      for (const d of docs) add((d as { img?: unknown }).img, entityByCollection(c)?.label ?? c)
    }),
  )
  return out
}

export async function deleteUpload(url: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = fileFromUrl(url)
  const p = file && uploadPath(file)
  if (!p) return { ok: false, error: 'Chỉ xóa được ảnh đã tải lên từ CMS.' }
  const used = (await findUsages([url])).get(url) ?? []
  if (used.length) return { ok: false, error: `Ảnh đang được dùng ở: ${used.join(', ')}. Đổi sang ảnh khác trước khi xóa.` }
  try {
    await unlink(p)
  } catch {
    return { ok: false, error: 'Không tìm thấy file (có thể đã bị xóa).' }
  }
  return { ok: true }
}
