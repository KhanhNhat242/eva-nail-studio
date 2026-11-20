'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { checkCategoriesInUse, deleteEntityItem, restoreEntityItem, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Mẫu nail — collection `model` + `model_section` (trang /admin/mau-nail). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('model', id, input)
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('model', id)
}

/** Khôi phục mục đã xóa mềm (về danh sách ở trạng thái ẩn). */
export async function restoreItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreEntityItem('model', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('model', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('model', input, (value) => checkCategoriesInUse('model', value.categories as { id: string }[]))
}
