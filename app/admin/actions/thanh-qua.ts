'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteEntityItem, restoreEntityItem, fail, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Thành quả học viên — collection `achievement` + `achievement_section` (trang /admin/thanh-qua). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('achievement', id, input, (data, { existing }) => {
    // Không cho đánh dấu "bài học viên" khi ảnh vẫn là ảnh minh họa cũ (REQUIREMENTS mục 7)
    if (data.placeholder !== false) return
    const prev = existing as { placeholder?: boolean; img?: string } | null
    if (!prev || (prev.placeholder !== false && prev.img === data.img)) {
      return fail('Chỉ tắt "Ảnh minh họa" khi đã thay bằng ảnh bài thật của học viên.', { placeholder: 'Đổi sang ảnh thật của học viên trước.' })
    }
  })
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('achievement', id)
}

/** Khôi phục mục đã xóa mềm (về danh sách ở trạng thái ẩn). */
export async function restoreItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return restoreEntityItem('achievement', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('achievement', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('achievement', input)
}
