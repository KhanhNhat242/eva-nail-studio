import { CONTENT_TYPES, readUpload } from '@/lib/media'

/**
 * Phục vụ ảnh tải lên từ CMS (lưu ở public/images/uploads/). Xem lib/media.ts vì sao không dùng thẳng /images/uploads.
 * Tên file duy nhất (có mã thời gian) → cache lâu dài được.
 */
export async function GET(_req: Request, { params }: RouteContext<'/uploads/[file]'>) {
  const { file } = await params
  const data = await readUpload(file)
  if (!data) return new Response('Không tìm thấy ảnh', { status: 404 })
  const ext = file.slice(file.lastIndexOf('.') + 1)
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
