import type { Metadata } from 'next'
import { verifyAdmin } from '@/lib/auth/dal'
import { getBookings } from '@/lib/cms/admin-queries'
import { BookingTable } from '@/components/admin/BookingTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { deleteBooking, setStatus } from '@/app/admin/actions/dat-lich'

export const metadata: Metadata = { title: 'Lịch đặt' }

export default async function BookingsPage() {
  await verifyAdmin()
  const rows = (await getBookings()).map((b) => ({
    id: b.id,
    name: b.name,
    phone_number: b.phone_number,
    choice: b.service_label,
    when: `${b.date.split('-').reverse().join('/')} · ${b.time}`,
    note: b.note,
    status: b.status,
    created_at: b.created_at,
  }))
  return (
    <>
      <PageHeader title="Lịch đặt" description="Khách gửi từ form “Đặt lịch làm đẹp”. Nhắn Zalo xác nhận rồi chuyển trạng thái “Đã xác nhận”." />
      <BookingTable actions={{ setStatus, remove: deleteBooking }} rows={rows} choiceTitle="Dịch vụ / mẫu" whenTitle="Ngày giờ hẹn" />
    </>
  )
}
