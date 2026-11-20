import Link from 'next/link'
import { Suspense } from 'react'
import { verifyAdmin } from '@/lib/auth/dal'
import { getDashboard } from '@/lib/cms/admin-queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { PanelFallback } from '@/components/admin/PanelFallback'

function Stat({ href, value, label, hint }: { href: string; value: number | string; label: string; hint?: string }) {
  return (
    <Link href={href} className="press flex flex-col rounded-card border border-line bg-white p-6 transition-colors duration-200 hover:border-ink">
      <span className="font-serif text-[44px] leading-none text-ink">{value}</span>
      <span className="mt-3 text-[14px] font-medium text-ink">{label}</span>
      {hint ? <span className="mt-1 text-[13px] text-ink-soft">{hint}</span> : null}
    </Link>
  )
}

export default function AdminHome() {
  return (
    <Suspense fallback={<PanelFallback />}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  const { username } = await verifyAdmin()
  const d = await getDashboard()
  return (
    <>
      <PageHeader title="Tổng quan" description={`Xin chào ${username}. Lịch mới và các mục còn chờ khách xác nhận.`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat href="/admin/dat-lich" value={d.newBookings} label="Lịch đặt mới" hint="Chưa xác nhận" />
        <Stat href="/admin/hoc-vien" value={d.newStudents} label="Đăng ký học mới" hint="Chưa liên hệ" />
        <Stat href="/admin/mau-nail" value={d.unconfirmedPrices} label="Mẫu nail giá ước lượng" hint="Cần khách xác nhận giá" />
        <Stat href="/admin/thanh-qua" value={d.placeholderWorks} label="Thành quả dùng ảnh minh họa" hint="Cần ảnh thật của học viên" />
      </div>
      {!d.sessionConfirmed ? (
        <p className="mt-6 rounded-control border border-line bg-cream-deep px-4 py-3 text-[14px] text-ink">
          Ca học đang dùng theo poster mới, chưa được khách xác nhận.{' '}
          <Link href="/admin/khoa-hoc" className="text-accent-deep underline underline-offset-4">
            Sửa ở mục Khóa học
          </Link>
        </p>
      ) : null}
    </>
  )
}
