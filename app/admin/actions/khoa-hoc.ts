'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { deleteEntityItem, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Khóa học — collection `course` + `course_section` (trang /admin/khoa-hoc). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('course', id, input)
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('course', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('course', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('course', input)
}
