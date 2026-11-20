'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteEntityItem, restoreEntityItem, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Vì sao chọn Eva — collection `whyus` + `whyus_section` (trang /admin/vi-sao). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('whyus', id, input)
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('whyus', id)
}

/** Khôi phục mục đã xóa mềm (về danh sách ở trạng thái ẩn). */
export async function restoreItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreEntityItem('whyus', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('whyus', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('whyus', input)
}
