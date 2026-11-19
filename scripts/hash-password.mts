/**
 * Tạo giá trị ADMIN_PASSWORD_HASH cho file .env:
 *   node scripts/hash-password.mts "mat-khau-moi"
 * Định dạng: scrypt:<salt hex>:<hash hex> — lib/auth/password.ts kiểm tra đúng định dạng này.
 * (Không dùng ký tự "$": Next.js diễn giải "$TEN" trong file .env thành biến môi trường.)
 */
import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]
if (!password || password.length < 8) {
  console.error('Dùng: node scripts/hash-password.mts "<mật khẩu ít nhất 8 ký tự>"')
  process.exit(1)
}
const salt = randomBytes(16)
const hash = scryptSync(password, salt, 64)
console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`)
