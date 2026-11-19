import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { SESSION_COOKIE, verifyToken } from './token'

/**
 * Kiểm tra phiên admin. GỌI ĐẦU TIÊN trong mọi trang và Server Action của /admin
 * (proxy.ts chỉ là lớp chặn sơ bộ — Server Action có thể bị gọi thẳng bằng POST).
 */
export const verifyAdmin = cache(async (): Promise<{ username: string }> => {
  // Chỉ chạy khi có request: verifyToken dùng Date.now() để kiểm tra hạn phiên — Cache Components
  // yêu cầu connection() trước các giá trị thay đổi theo thời gian (docs: 08-caching.md "Random values and timestamps").
  await connection()
  const username = verifyToken((await cookies()).get(SESSION_COOKIE)?.value)
  if (!username) redirect('/admin/dang-nhap')
  return { username }
})
