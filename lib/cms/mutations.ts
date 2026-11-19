import 'server-only'
import { updateTag } from 'next/cache'
import { col } from '@/lib/db/mongo'
import { getOptionSources } from '@/lib/cms/admin-queries'
import { entityByCollection, slugify, validateFields, type ContentCollection, type EntityDef } from '@/lib/cms/schema'
import { BOOKING_STATUSES, SECTION_ID, type ActionResult, type BookingStatus, type CollectionName } from '@/types/cms'

/**
 * Thao tác ghi MongoDB dùng chung cho các Server Action trong `app/admin/actions/*`.
 * File này KHÔNG phải Server Action (không gọi thẳng được từ client) — action gọi tới đây
 * phải `await verifyAdmin()` trước.
 */

export type OptionSources = Awaited<ReturnType<typeof getOptionSources>>
export type Doc = Record<string, unknown>

/** Ràng buộc nghiệp vụ riêng của từng loại khi lưu item: sửa `data` tại chỗ, trả về lỗi nếu không hợp lệ. */
export type ItemRule = (data: Doc, ctx: { existing: Doc | null; sources: OptionSources }) => ActionResult | void
/** Ràng buộc riêng khi lưu phần tiêu đề section (chạy sau validate, trước khi ghi). */
export type SectionRule = (value: Doc) => Promise<ActionResult | void>

export const fail = (error: string, errors?: Record<string, string>): ActionResult => ({ ok: false, error, errors })

export function invalidate(...names: CollectionName[]) {
  for (const n of names) updateTag(n)
}

function getDef(collection: ContentCollection): EntityDef {
  const def = entityByCollection(collection)
  if (!def) throw new Error('Collection không hợp lệ')
  return def
}

function allowedOptions(src: OptionSources) {
  return {
    priceCategories: src.priceCategories.map((o) => o.value),
    modelCategories: src.modelCategories.map((o) => o.value),
    courses: src.courses.map((o) => o.value),
  }
}

// ---------------- Nội dung (item + section) ----------------

/** Thêm (id = null) hoặc sửa một item. Item mới được thêm vào đầu danh sách hiển thị. */
export async function saveEntityItem(collection: ContentCollection, id: string | null, input: Doc, rule?: ItemRule): Promise<ActionResult> {
  const def = getDef(collection)
  const sources = await getOptionSources()
  const v = validateFields(def.fields, input, allowedOptions(sources))
  if (!v.ok) return fail('Kiểm tra lại các ô được đánh dấu.', v.errors)
  const data = v.value

  const items = await col(def.collection)
  const existing = id ? ((await items.findOne({ _id: id } as never)) as Doc | null) : null
  if (id && !existing) return fail('Không tìm thấy mục này (có thể đã bị xóa).')

  const ruleError = rule?.(data, { existing, sources })
  if (ruleError) return ruleError

  if (existing) {
    await items.updateOne({ _id: id } as never, { $set: data } as never)
    invalidate(def.collection)
    return { ok: true, id: id! }
  }

  const base = slugify(String(data[def.titleField] ?? '')) || def.collection
  let newId = base
  for (let n = 2; await items.findOne({ _id: newId } as never); n++) newId = `${base}-${n}`
  await items.insertOne({ _id: newId, ...data } as never)
  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $push: { [def.sectionKey]: { $each: [newId], $position: 0 } } } as never)
  invalidate(def.collection, def.section)
  return { ok: true, id: newId }
}

export async function deleteEntityItem(collection: ContentCollection, id: string): Promise<ActionResult> {
  const def = getDef(collection)
  await (await col(def.collection)).deleteOne({ _id: id } as never)
  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $pull: { [def.sectionKey]: id } } as never)
  invalidate(def.collection, def.section)
  return { ok: true }
}

/** Đặt lại danh sách item đang hiển thị (thứ tự + ẩn/hiện). */
export async function setEntityVisibleOrder(collection: ContentCollection, ids: string[]): Promise<ActionResult> {
  const def = getDef(collection)
  const clean = [...new Set(ids.filter((x): x is string => typeof x === 'string'))]
  const count = await (await col(def.collection)).countDocuments({ _id: { $in: clean } } as never)
  if (count !== clean.length) return fail('Danh sách có mục không tồn tại, tải lại trang rồi thử lại.')
  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $set: { [def.sectionKey]: clean } } as never)
  invalidate(def.section)
  return { ok: true }
}

export async function saveEntitySection(collection: ContentCollection, input: Doc, rule?: SectionRule): Promise<ActionResult> {
  const def = getDef(collection)
  const v = validateFields(def.sectionFields, input)
  if (!v.ok) return fail('Kiểm tra lại các ô được đánh dấu.', v.errors)

  const ruleError = await rule?.(v.value)
  if (ruleError) return ruleError

  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $set: v.value } as never, { upsert: true })
  invalidate(def.section)
  return { ok: true }
}

/** Danh mục (bảng giá / nhóm mẫu) đang được item dùng thì không được xóa khỏi section. */
export async function checkCategoriesInUse(collection: 'price' | 'model', categories: { id: string }[]): Promise<ActionResult | void> {
  const ids = categories.map((c) => c.id)
  const inUse = (await (await col(collection)).distinct('category' as never)) as unknown as (string | string[])[]
  const missing = [...new Set(inUse.flat())].filter((u) => !ids.includes(u))
  if (missing.length) {
    return fail(`Còn mục đang dùng danh mục: ${missing.join(', ')}. Chuyển các mục đó sang danh mục khác trước.`, { categories: 'Danh mục đang được dùng.' })
  }
}

// ---------------- Lịch đặt / học viên ----------------

export type BookingCollection = 'booking_customer' | 'course_student'

export async function setRecordStatus(collection: BookingCollection, id: string, status: string): Promise<ActionResult> {
  if (!(BOOKING_STATUSES as readonly string[]).includes(status)) return fail('Dữ liệu không hợp lệ.')
  const r = await (await col(collection)).updateOne({ _id: id }, { $set: { status: status as BookingStatus } })
  return r.matchedCount ? { ok: true } : fail('Không tìm thấy bản ghi.')
}

export async function deleteRecord(collection: BookingCollection, id: string): Promise<ActionResult> {
  await (await col(collection)).deleteOne({ _id: id })
  return { ok: true }
}
