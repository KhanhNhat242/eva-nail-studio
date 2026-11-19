import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Token phiên admin: base64url(payload JSON) + "." + base64url(HMAC-SHA256).
 * Không phụ thuộc next/headers → dùng được cả trong proxy.ts lẫn Server Action.
 */
export const SESSION_COOKIE = 'eva_admin'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 ngày (giây)

type Payload = { u: string; exp: number }

function secret(): string {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET chưa đặt hoặc ngắn hơn 32 ký tự (xem .env.example)')
  return s
}

const sign = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url')

export function createToken(username: string): string {
  const payload: Payload = { u: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${data}.${sign(data)}`
}

/** Trả về tên đăng nhập nếu token hợp lệ, còn hạn và đúng tài khoản admin hiện tại; ngược lại null. */
export function verifyToken(token: string | undefined): string | null {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = Buffer.from(sign(data))
  const actual = Buffer.from(sig)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const p = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as Partial<Payload>
    if (typeof p.u !== 'string' || typeof p.exp !== 'number') return null
    if (p.exp < Date.now() / 1000) return null
    if (p.u !== process.env.ADMIN_USERNAME) return null
    return p.u
  } catch {
    return null
  }
}
