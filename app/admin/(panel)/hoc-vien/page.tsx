import type { Metadata } from 'next'
import { verifyAdmin } from '@/lib/auth/dal'
import { getStudents } from '@/lib/cms/admin-queries'
import { BookingTable } from '@/components/admin/BookingTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { deleteStudent, setStatus } from '@/app/admin/actions/hoc-vien'

export const metadata: Metadata = { title: 'Đăng ký học' }

export default async function StudentsPage() {
  await verifyAdmin()
  const rows = (await getStudents()).map((s) => ({
    id: s.id,
    name: s.name,
    phone_number: s.phone_number,
    choice: s.course_label,
    when: s.session ?? 'Linh hoạt / cần tư vấn',
    note: s.note,
    status: s.status,
    created_at: s.created_at,
  }))
  return (
    <>
      <PageHeader title="Đăng ký học" description="Học viên gửi từ form “Đăng ký khóa học”. Liên hệ tư vấn rồi cập nhật trạng thái." />
      <BookingTable actions={{ setStatus, remove: deleteStudent }} rows={rows} choiceTitle="Khóa học" whenTitle="Ca học" />
    </>
  )
}
