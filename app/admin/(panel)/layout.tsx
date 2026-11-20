import { AdminNav } from '@/components/admin/AdminNav'

/**
 * Khung trang quản trị. Không kiểm tra đăng nhập ở layout (layout không render lại khi chuyển trang) —
 * mỗi trang tự gọi verifyAdmin() bên trong <Suspense> của chính trang đó; proxy.ts chặn sơ bộ.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-cream lg:flex-row">
      <AdminNav />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  )
}
