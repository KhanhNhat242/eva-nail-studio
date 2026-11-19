import 'server-only'
import { scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>

/** Kiểm tra mật khẩu với ADMIN_PASSWORD_HASH dạng "scrypt:<salt hex>:<hash hex>" (scripts/hash-password.mts). */
export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  const [algo, saltHex, hashHex] = (stored ?? '').trim().split(':')
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
