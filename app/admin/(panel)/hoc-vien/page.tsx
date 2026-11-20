import type { Metadata } from 'next'
import { Suspense } from 'react'
import { verifyAdmin } from '@/lib/auth/dal'
import { getDeletedStudents, getStudents, type CourseStudentRow } from '@/lib/cms/admin-queries'
import { BookingTable } from '@/components/admin/BookingTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { PanelFallback } from '@/components/admin/PanelFallback'
import { deleteStudent, setStatus } from '@/app/admin/actions/hoc-vien'

export const metadata: Metadata = { title: 'Đăng ký học' }

export default function StudentsPage() {
  return (
    <>
      <PageHeader title="Đăng ký học" description="Học viên gửi từ form “Đăng ký khóa học”. Liên hệ tư vấn rồi cập nhật trạng thái." />
      <Suspense fallback={<PanelFallback />}>
        <StudentsTable />
      </Suspense>
    </>
  )
}

async function StudentsTable() {
  await verifyAdmin()
  const [students, deleted] = await Promise.all([getStudents(), getDeletedStudents()])
  return (
    <BookingTable
      actions={{ setStatus, remove: deleteStudent }}
      rows={students.map(toRow)}
      deletedRows={deleted.map(toRow)}
      choiceTitle="Khóa học"
      whenTitle="Ca học"
    />
  )
}

function toRow(s: CourseStudentRow) {
  return {
    id: s.id,
    name: s.name,
    phone_number: s.phone_number,
    choice: s.course_label,
    when: s.session ?? 'Linh hoạt / cần tư vấn',
    note: s.note,
    status: s.status,
    created_at: s.created_at,
  }
}
