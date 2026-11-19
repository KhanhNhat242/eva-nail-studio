'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyPassword } from '@/lib/auth/password'
import { SESSION_COOKIE, SESSION_MAX_AGE, createToken } from '@/lib/auth/token'

/** Đăng nhập / đăng xuất admin — action duy nhất không gọi verifyAdmin(). */

/** Giới hạn đơn giản trong bộ nhớ: 5 lần sai / 15 phút / IP (một instance trên VPS). */
const failures = new Map<string, { count: number; until: number }>()
const WINDOW = 15 * 60 * 1000

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const f = failures.get(ip)
  if (f && f.until > now && f.count >= 5) return { error: 'Sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' }

  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const okUser = !!process.env.ADMIN_USERNAME && username === process.env.ADMIN_USERNAME
  const okPass = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)
  if (!okUser || !okPass) {
    const cur = f && f.until > now ? f : { count: 0, until: now + WINDOW }
    failures.set(ip, { count: cur.count + 1, until: cur.until })
    return { error: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' }
  }
  failures.delete(ip)
  ;(await cookies()).set(SESSION_COOKIE, createToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_INSECURE !== '1',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  redirect('/admin')
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/admin/dang-nhap')
}
