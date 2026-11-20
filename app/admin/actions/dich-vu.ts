'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteEntityItem, restoreEntityItem, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Dịch vụ — collection `service` + `service_section` (trang /admin/dich-vu). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('service', id, input, (data) => {
    // Lớp chữ phủ trên ảnh: bỏ trống cả hai ô → không có lớp phủ
    const o = data.overlay as { kicker: string | null; heading: string | null }
    data.overlay = o.kicker || o.heading ? { kicker: o.kicker ?? '', heading: o.heading ?? '' } : null
  })
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('service', id)
}

/** Khôi phục mục đã xóa mềm (về danh sách ở trạng thái ẩn). */
export async function restoreItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreEntityItem('service', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('service', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('service', input)
}
