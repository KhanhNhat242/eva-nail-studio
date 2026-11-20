import type { Metadata } from 'next'
import { Suspense } from 'react'
import { verifyAdmin } from '@/lib/auth/dal'
import { getBookings, getDeletedBookings, type BookingCustomerRow } from '@/lib/cms/admin-queries'
import { BookingTable } from '@/components/admin/BookingTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { PanelFallback } from '@/components/admin/PanelFallback'
import { deleteBooking, restoreBooking, setStatus } from '@/app/admin/actions/dat-lich'

export const metadata: Metadata = { title: 'Lịch đặt' }

export default function BookingsPage() {
  return (
    <>
      <PageHeader title="Lịch đặt" description="Khách gửi từ form “Đặt lịch làm đẹp”. Nhắn Zalo xác nhận rồi chuyển trạng thái “Đã xác nhận”." />
      <Suspense fallback={<PanelFallback />}>
        <BookingsTable />
      </Suspense>
    </>
  )
}

async function BookingsTable() {
  await verifyAdmin()
  const [bookings, deleted] = await Promise.all([getBookings(), getDeletedBookings()])
  return (
    <BookingTable
      actions={{ setStatus, remove: deleteBooking, restore: restoreBooking }}
      rows={bookings.map(toRow)}
      deletedRows={deleted.map((b) => ({ ...toRow(b), purge_at: b.purge_at }))}
      choiceTitle="Dịch vụ / mẫu"
      whenTitle="Ngày giờ hẹn"
    />
  )
}

function toRow(b: BookingCustomerRow) {
  return {
    id: b.id,
    name: b.name,
    phone_number: b.phone_number,
    choice: b.service_label,
    when: `${b.date.split('-').reverse().join('/')} · ${b.time}`,
    note: b.note,
    status: b.status,
    created_at: b.created_at,
  }
}
