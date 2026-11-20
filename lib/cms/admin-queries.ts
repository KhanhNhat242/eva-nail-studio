import 'server-only'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { NOT_DELETED, col } from '@/lib/db/mongo'
import { listUploads } from '@/lib/media'
import { SECTION_ID, type BookingCustomerDoc, type CourseStudentDoc } from '@/types/cms'
import type { EntityDef, OptionSource } from './schema'

/**
 * Đọc dữ liệu cho trang quản trị — KHÔNG cache (admin luôn thấy bản mới nhất).
 * Chỉ gọi sau verifyAdmin().
 */

export type PlainDoc = Record<string, unknown> & { id: string }
export type Option = { value: string; label: string }

const plain = <T extends { _id: unknown }>(d: T): PlainDoc => {
  const { _id, ...rest } = d
  return JSON.parse(JSON.stringify({ id: String(_id), ...rest })) as PlainDoc
}

export async function getSectionDoc(name: EntityDef['section'] | 'hero_grid'): Promise<PlainDoc | null> {
  const d = await (await col(name)).findOne({ _id: SECTION_ID } as never)
  return d ? plain(d) : null
}

export async function getOptionSources(): Promise<Record<OptionSource, Option[]>> {
  const [priceList, modelSec, courses] = await Promise.all([
    getSectionDoc('price_list'),
    getSectionDoc('model_section'),
    (await col('course')).find(NOT_DELETED).toArray(),
  ])
  const pairs = (d: PlainDoc | null, key: 'name' | 'label') =>
    ((d?.categories as Record<string, string>[] | undefined) ?? []).map((c) => ({ value: c.id, label: c[key] }))
  return {
    priceCategories: pairs(priceList, 'name'),
    modelCategories: pairs(modelSec, 'label'),
    courses: courses.map((c) => ({ value: c._id, label: c.name })),
  }
}

/**
 * Item của 1 collection: đang hiển thị (theo thứ tự section) trước, item ẩn sau.
 * `deletedItems`: item đã xóa mềm (is_deleted: true) — chỉ để xem trong popup "Đã xóa".
 */
export async function getEntityData(def: EntityDef) {
  const [section, all, optionSources] = await Promise.all([
    getSectionDoc(def.section),
    (await col(def.collection)).find().toArray(),
    getOptionSources(),
  ])
  const isDeleted = (d: { is_deleted?: boolean }) => d.is_deleted === true
  const docs = all.filter((d) => !isDeleted(d))
  const deletedItems = all.filter(isDeleted).map(plain)
  const visibleIds = ((section?.[def.sectionKey] as string[] | undefined) ?? []).filter((id) => docs.some((d) => d._id === id))
  const rank = (id: string) => (visibleIds.includes(id) ? visibleIds.indexOf(id) : Number.MAX_SAFE_INTEGER)
  const items = docs.map(plain).sort((a, b) => rank(a.id) - rank(b.id))
  return { section, items, visibleIds, optionSources, deletedItems }
}

/** Thư viện ảnh cho ô chọn ảnh: ảnh tải lên từ CMS (mới nhất trước) + ảnh có sẵn trong public/images (thư mục ASCII, bỏ "tư liệu" gốc của khách và thư mục uploads — đã liệt kê qua /uploads/). */
export async function listImages(): Promise<string[]> {
  const base = join(process.cwd(), 'public', 'images')
  const out: string[] = []
  async function walk(dir: string, rel: string) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue
      const r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) {
        if (/^[a-z0-9-]+$/.test(e.name) && r !== 'uploads') await walk(join(dir, e.name), r)
      } else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name) && /^[A-Za-z0-9/_.-]+$/.test(r)) {
        out.push(`/images/${r}`)
      }
    }
  }
  await walk(base, '')
  return [...(await listUploads()), ...out.sort()]
}

type BookingRow<T> = Omit<T, '_id' | 'created_at'> & { id: string; created_at: string }
const row = <T extends { _id: string; created_at: Date }>(d: T) => {
  const { _id, created_at, ...rest } = d
  return { ...rest, id: _id, created_at: created_at instanceof Date ? created_at.toISOString() : String(created_at) }
}

export async function getBookings(): Promise<BookingRow<BookingCustomerDoc>[]> {
  const docs = await (await col('booking_customer')).find().sort({ created_at: -1 }).limit(1000).toArray()
  return docs.map(row)
}

export async function getStudents(): Promise<BookingRow<CourseStudentDoc>[]> {
  const docs = await (await col('course_student')).find(NOT_DELETED).sort({ created_at: -1 }).limit(1000).toArray()
  return docs.map(row)
}

/** Học viên đã xóa mềm — chỉ để xem trong popup "Đã xóa". */
export async function getDeletedStudents(): Promise<BookingRow<CourseStudentDoc>[]> {
  const docs = await (await col('course_student')).find({ is_deleted: true }).sort({ created_at: -1 }).limit(1000).toArray()
  return docs.map(row)
}

export type BookingCustomerRow = BookingRow<BookingCustomerDoc>
export type CourseStudentRow = BookingRow<CourseStudentDoc>

export async function getDashboard() {
  const [bookings, students, models, achievements, courseSec] = await Promise.all([
    col('booking_customer'),
    col('course_student'),
    col('model'),
    col('achievement'),
    getSectionDoc('course_section'),
  ])
  const [newBookings, newStudents, unconfirmedPrices, placeholderWorks] = await Promise.all([
    bookings.countDocuments({ status: 'new' }),
    students.countDocuments({ status: 'new', ...NOT_DELETED }),
    models.countDocuments({ price_confirmed: false, ...NOT_DELETED }),
    achievements.countDocuments({ placeholder: true, ...NOT_DELETED }),
  ])
  return { newBookings, newStudents, unconfirmedPrices, placeholderWorks, sessionConfirmed: courseSec?.session_confirmed === true }
}
