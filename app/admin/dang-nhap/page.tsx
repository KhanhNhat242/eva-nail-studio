import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Đăng nhập' }

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-cream-deep px-5 py-10">
      <div className="w-full max-w-[400px] rounded-card border border-line bg-cream p-8">
        <p className="font-serif text-[40px] font-medium leading-none text-ink">Eva</p>
        <h1 className="mt-2 text-[15px] text-ink-soft">Đăng nhập trang quản trị</h1>
        <LoginForm />
      </div>
    </main>
  )
}
