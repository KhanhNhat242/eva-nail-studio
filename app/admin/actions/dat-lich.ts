'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { restoreRecord, setRecordStatus, softDeleteRecord } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Lịch đặt — collection `booking_customer` (trang /admin/dat-lich). */

export async function setStatus(id: string, status: string): Promise<ActionResult> {
  await verifyAdmin()
  return setRecordStatus('booking_customer', id, status)
}

/** Xóa mềm (is_deleted = true) — khôi phục được trong 30 ngày. */
export async function deleteBooking(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return softDeleteRecord('booking_customer', id)
}

/** Khôi phục lịch đặt đã xóa mềm. */
export async function restoreBooking(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreRecord('booking_customer', id)
}
