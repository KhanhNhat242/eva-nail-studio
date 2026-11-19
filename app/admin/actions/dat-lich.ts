'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteRecord, setRecordStatus } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Lịch đặt — collection `booking_customer` (trang /admin/dat-lich). */

export async function setStatus(id: string, status: string): Promise<ActionResult> {
  await verifyAdmin()
  return setRecordStatus('booking_customer', id, status)
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteRecord('booking_customer', id)
}
