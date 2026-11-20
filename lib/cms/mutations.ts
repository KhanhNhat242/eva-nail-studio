import 'server-only'
import { updateTag } from 'next/cache'
import { NOT_DELETED, col } from '@/lib/db/mongo'
import { getOptionSources } from '@/lib/cms/admin-queries'
import { entityByCollection, slugify, validateFields, type ContentCollection, type EntityDef } from '@/lib/cms/schema'
import { BOOKING_STATUSES, PURGE_AFTER_DAYS, SECTION_ID, type ActionResult, type BookingStatus, type CollectionName } from '@/types/cms'

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

/** Số mục đang hiển thị của section (chỉ đếm id còn tồn tại, chưa xóa mềm). */
async function countVisible(def: EntityDef): Promise<number> {
  const sec = (await (await col(def.section)).findOne({ _id: SECTION_ID } as never)) as Doc | null
  const ids = (sec?.[def.sectionKey] as string[] | undefined) ?? []
  if (!ids.length) return 0
  return (await col(def.collection)).countDocuments({ _id: { $in: ids }, ...NOT_DELETED } as never)
}

/** Thêm (id = null) hoặc sửa một item. Item mới được thêm vào đầu danh sách hiển thị (hoặc để ẩn nếu section đã đủ maxVisible). */
export async function saveEntityItem(collection: ContentCollection, id: string | null, input: Doc, rule?: ItemRule): Promise<ActionResult> {
  const def = getDef(collection)
  const sources = await getOptionSources()
  const v = validateFields(def.fields, input, allowedOptions(sources))
  if (!v.ok) return fail('Kiểm tra lại các ô được đánh dấu.', v.errors)
  const data = v.value

  const items = await col(def.collection)
  const existing = id ? ((await items.findOne({ _id: id, ...NOT_DELETED } as never)) as Doc | null) : null
  if (id && !existing) return fail('Không tìm thấy mục này (có thể đã bị xóa).')

  const ruleError = rule?.(data, { existing, sources })
  if (ruleError) return ruleError

  if (existing) {
    await items.updateOne({ _id: id } as never, { $set: data } as never)
    invalidate(def.collection)
    return { ok: true, id: id! }
  }

  // Kiểm tra trùng _id trên MỌI bản ghi (kể cả đã xóa mềm — chúng vẫn giữ _id trong DB)
  const base = slugify(String(data[def.titleField] ?? '')) || def.collection
  let newId = base
  for (let n = 2; await items.findOne({ _id: newId } as never); n++) newId = `${base}-${n}`
  await items.insertOne({ _id: newId, ...data, is_deleted: false } as never)
  // Section đã đủ số mục hiển thị tối đa → mục mới để ẩn (admin tắt 1 mục khác rồi bật mục này)
  if (def.maxVisible !== undefined && (await countVisible(def)) >= def.maxVisible) {
    invalidate(def.collection)
    return { ok: true, id: newId }
  }
  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $push: { [def.sectionKey]: { $each: [newId], $position: 0 } } } as never)
  invalidate(def.collection, def.section)
  return { ok: true, id: newId }
}

/** Xóa mềm: đặt is_deleted = true (bản ghi vẫn còn trong DB) và gỡ khỏi danh sách hiển thị của section. */
export async function deleteEntityItem(collection: ContentCollection, id: string): Promise<ActionResult> {
  const def = getDef(collection)
  const r = await (await col(def.collection)).updateOne({ _id: id, ...NOT_DELETED } as never, { $set: { is_deleted: true, deleted_at: new Date() } } as never)
  if (!r.matchedCount) return fail('Không tìm thấy mục này (có thể đã bị xóa).')
  await (await col(def.section)).updateOne({ _id: SECTION_ID } as never, { $pull: { [def.sectionKey]: id } } as never)
  invalidate(def.collection, def.section)
  return { ok: true }
}

/** Khôi phục item đã xóa mềm: về danh sách ở trạng thái ẩn (không tự hiện lại trên trang chủ), bỏ hẹn xóa vĩnh viễn. */
export async function restoreEntityItem(collection: ContentCollection, id: string): Promise<ActionResult> {
  const def = getDef(collection)
  const r = await (await col(def.collection)).updateOne({ _id: id, is_deleted: true } as never, { $set: { is_deleted: false }, $unset: { deleted_at: '' } } as never)
  if (!r.matchedCount) return fail('Không tìm thấy mục này (có thể đã bị xóa vĩnh viễn).')
  invalidate(def.collection)
  return { ok: true }
}

/** Đặt lại danh sách item đang hiển thị (thứ tự + ẩn/hiện). */
export async function setEntityVisibleOrder(collection: ContentCollection, ids: string[]): Promise<ActionResult> {
  const def = getDef(collection)
  const clean = [...new Set(ids.filter((x): x is string => typeof x === 'string'))]
  if (def.maxVisible !== undefined && clean.length > def.maxVisible) {
    return fail(`${def.label} chỉ hiển thị tối đa ${def.maxVisible} mục. Tắt Hiển thị 1 mục khác trước.`)
  }
  const count = await (await col(def.collection)).countDocuments({ _id: { $in: clean }, ...NOT_DELETED } as never)
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

  const sections = await col(def.section)
  const prev = (await sections.findOne({ _id: SECTION_ID } as never)) as Doc | null
  trackDeletedPairs(def, prev, v.value)
  await sections.updateOne({ _id: SECTION_ID } as never, { $set: v.value } as never, { upsert: true })
  invalidate(def.section)
  return { ok: true }
}

type Pair = { id: string } & Record<string, unknown>

/**
 * Trường kiểu 'pairs' (danh mục bảng giá / nhóm mẫu): danh mục bị bỏ khỏi danh sách khi Lưu được giữ lại ở
 * `deleted_<tên trường>` kèm `deleted_at` để khôi phục (giữ nguyên id → item đang gắn danh mục không bị lệch).
 * Danh mục được thêm lại (cùng id) thì gỡ khỏi danh sách đã xóa; quá PURGE_AFTER_DAYS ngày thì bỏ hẳn
 * (mảng trong document không dùng được TTL index nên dọn mỗi lần lưu; trang admin cũng lọc khi hiển thị).
 */
function trackDeletedPairs(def: EntityDef, prev: Doc | null, next: Doc) {
  const now = new Date()
  const cutoff = now.getTime() - PURGE_AFTER_DAYS * 86_400_000
  for (const f of def.sectionFields) {
    if (f.type !== 'pairs') continue
    const nextIds = new Set(((next[f.name] as Pair[] | undefined) ?? []).map((p) => p.id))
    const kept = ((prev?.[`deleted_${f.name}`] as (Pair & { deleted_at: Date | string })[] | undefined) ?? []).filter(
      (d) => !nextIds.has(d.id) && new Date(d.deleted_at).getTime() > cutoff,
    )
    const removed = ((prev?.[f.name] as Pair[] | undefined) ?? [])
      .filter((p) => !nextIds.has(p.id) && !kept.some((d) => d.id === p.id))
      .map((p) => ({ ...p, deleted_at: now }))
    next[`deleted_${f.name}`] = [...removed, ...kept]
  }
}

/** Danh mục (bảng giá / nhóm mẫu) đang được item (chưa xóa mềm) dùng thì không được xóa khỏi section. */
export async function checkCategoriesInUse(collection: 'price' | 'model', categories: { id: string }[]): Promise<ActionResult | void> {
  const ids = categories.map((c) => c.id)
  const inUse = (await (await col(collection)).distinct('category' as never, NOT_DELETED as never)) as unknown as (string | string[])[]
  const missing = [...new Set(inUse.flat())].filter((u) => !ids.includes(u))
  if (missing.length) {
    return fail(`Còn mục đang dùng danh mục: ${missing.join(', ')}. Chuyển các mục đó sang danh mục khác trước.`, { categories: 'Danh mục đang được dùng.' })
  }
}

// ---------------- Lịch đặt / học viên ----------------

export type BookingCollection = 'booking_customer' | 'course_student'

export async function setRecordStatus(collection: BookingCollection, id: string, status: string): Promise<ActionResult> {
  if (!(BOOKING_STATUSES as readonly string[]).includes(status)) return fail('Dữ liệu không hợp lệ.')
  const r = await (await col(collection)).updateOne({ _id: id, ...NOT_DELETED } as never, { $set: { status: status as BookingStatus } })
  return r.matchedCount ? { ok: true } : fail('Không tìm thấy bản ghi.')
}

/** Xóa mềm lịch đặt / học viên đăng ký: is_deleted = true + deleted_at (TTL tự xóa vĩnh viễn sau PURGE_AFTER_DAYS ngày). */
export async function softDeleteRecord(collection: BookingCollection, id: string): Promise<ActionResult> {
  const r = await (await col(collection)).updateOne({ _id: id, ...NOT_DELETED } as never, { $set: { is_deleted: true, deleted_at: new Date() } } as never)
  return r.matchedCount ? { ok: true } : fail('Không tìm thấy bản ghi.')
}

/** Khôi phục lịch đặt / học viên đã xóa mềm. */
export async function restoreRecord(collection: BookingCollection, id: string): Promise<ActionResult> {
  const r = await (await col(collection)).updateOne({ _id: id, is_deleted: true } as never, { $set: { is_deleted: false }, $unset: { deleted_at: '' } } as never)
  return r.matchedCount ? { ok: true } : fail('Không tìm thấy bản ghi (có thể đã bị xóa vĩnh viễn).')
}
