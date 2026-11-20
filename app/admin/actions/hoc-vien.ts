'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { restoreRecord, setRecordStatus, softDeleteRecord } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Đăng ký học — collection `course_student` (trang /admin/hoc-vien). */

export async function setStatus(id: string, status: string): Promise<ActionResult> {
  await verifyAdmin()
  return setRecordStatus('course_student', id, status)
}

/** Xóa mềm (is_deleted = true). */
export async function deleteStudent(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return softDeleteRecord('course_student', id)
}

/** Khôi phục học viên đã xóa mềm. */
export async function restoreDeletedStudent(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreRecord('course_student', id)
}
