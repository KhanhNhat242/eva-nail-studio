'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteEntityItem, restoreEntityItem, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Hot combo — collection `combo` + `combo_section` (trang /admin/combo). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('combo', id, input)
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('combo', id)
}

/** Khôi phục mục đã xóa mềm (về danh sách ở trạng thái ẩn). */
export async function restoreItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreEntityItem('combo', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('combo', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('combo', input)
}
