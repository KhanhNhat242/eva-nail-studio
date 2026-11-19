import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '@/lib/auth/token'

/**
 * Chặn sơ bộ /admin: chưa đăng nhập → chuyển về trang đăng nhập.
 * Không truy vấn DB ở đây. Trang và Server Action vẫn tự gọi verifyAdmin() (lib/auth/dal.ts).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/admin/dang-nhap') return NextResponse.next()
  if (!verifyToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.redirect(new URL('/admin/dang-nhap', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
