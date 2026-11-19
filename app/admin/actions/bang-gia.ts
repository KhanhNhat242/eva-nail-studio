'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { col } from '@/lib/db/mongo'
import { checkCategoriesInUse, deleteEntityItem, invalidate, saveEntityItem, saveEntitySection, setEntityVisibleOrder, type Doc } from '@/lib/cms/mutations'
import type { ActionResult } from '@/types/cms'

/** Bảng giá — collection `price` + `price_list` (trang /admin/bang-gia). */

export async function saveItem(id: string | null, input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntityItem('price', id, input, (data, { sources }) => {
    // Lưu kèm tên danh mục để trang công khai không phải tra lại
    data.category_name = sources.priceCategories.find((c) => c.value === data.category)?.label ?? ''
  })
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await verifyAdmin()
  return deleteEntityItem('price', id)
}

export async function setVisibleOrder(ids: string[]): Promise<ActionResult> {
  await verifyAdmin()
  return setEntityVisibleOrder('price', ids)
}

export async function saveSection(input: Doc): Promise<ActionResult> {
  await verifyAdmin()
  return saveEntitySection('price', input, async (value) => {
    const categories = value.categories as { id: string; name: string }[]
    const inUse = await checkCategoriesInUse('price', categories)
    if (inUse) return inUse
    // Đổi tên danh mục → cập nhật tên đã lưu kèm trong từng dòng giá
    const prices = await col('price')
    for (const c of categories) await prices.updateMany({ category: c.id }, { $set: { category_name: c.name } })
    invalidate('price')
  })
}
