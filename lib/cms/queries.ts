import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { NOT_DELETED, col } from '@/lib/db/mongo'
import { formatPrice, formatVnd } from '@/lib/format'
import { HERO_SLOTS, SECTION_ID, type CollectionName, type ServiceDoc } from '@/types/cms'
import type {
  AchievementSectionContent,
  BookingOptions,
  ComboSectionContent,
  Course,
  CourseSectionContent,
  HeroPhoto,
  ModelSectionContent,
  NailDesign,
  ServiceCategory,
  ServiceSectionContent,
  WhyusSectionContent,
} from '@/types/content'

/**
 * Đọc nội dung website từ MongoDB — mỗi hàm được cache ('use cache') và gắn tag theo tên collection.
 * CMS lưu xong gọi `updateTag(<collection>)` → lần đọc sau lấy dữ liệu mới ngay.
 * Section quyết định item nào hiển thị và theo thứ tự nào (mảng id); item không có trong section = ẩn.
 */

async function section<K extends CollectionName>(name: K) {
  const doc = await (await col(name)).findOne({ _id: SECTION_ID } as never)
  if (!doc) throw new Error(`Chưa có dữ liệu "${name}" — chạy npm run db:seed`)
  return doc
}

/** Lấy các item theo đúng thứ tự id trong section, bỏ id không còn tồn tại hoặc đã xóa mềm. */
async function byIds<K extends CollectionName>(name: K, ids: string[]) {
  const docs = await (await col(name)).find({ _id: { $in: ids }, ...NOT_DELETED } as never).toArray()
  const map = new Map(docs.map((d) => [String(d._id), d]))
  return ids.flatMap((id) => {
    const d = map.get(id)
    return d ? [d] : []
  })
}

export async function getHeroGrid(): Promise<HeroPhoto[]> {
  'use cache'
  cacheLife('max')
  cacheTag('hero_grid')
  const doc = await section('hero_grid')
  return HERO_SLOTS.map((k) => ({ src: doc[k].img, alt: doc[k].img_alt, pos: doc[k].img_position || '50% 50%' }))
}

function servicePriceLabel(s: ServiceDoc): string {
  if (!s.price) return s.price_label || 'Liên hệ tư vấn'
  if (!s.price_label) return formatPrice(s.price)
  return `${s.price_label} ${s.price.max === null ? formatVnd(s.price.min) : formatPrice(s.price)}`
}

export async function getServiceSection(): Promise<ServiceSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('service_section', 'service')
  const sec = await section('service_section')
  const items = await byIds('service', sec.service)
  return {
    title: sec.title,
    description: sec.description,
    items: items.map((s) => ({
      id: s._id,
      title: s.title,
      description: s.description,
      priceLabel: servicePriceLabel(s),
      cta: s.cta,
      image: s.img ? { src: s.img, alt: s.img_alt ?? '' } : undefined,
      dark: s.overlay ? { kicker: s.overlay.kicker, heading: s.overlay.heading } : undefined,
    })),
  }
}

export async function getComboSection(): Promise<ComboSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('combo_section', 'combo')
  const sec = await section('combo_section')
  const combos = await byIds('combo', sec.combo)
  return {
    eyebrow: sec.eyebrow,
    title: sec.title,
    titleHighlight: sec.title_highlight,
    combos: combos.map((c) => ({ id: c._id, name: c.title, price: c.price, includes: c.description, image: c.img, imageAlt: c.img_alt })),
  }
}

export async function getPriceList(): Promise<ServiceCategory[]> {
  'use cache'
  cacheLife('max')
  cacheTag('price_list', 'price')
  const list = await section('price_list')
  const prices = await byIds('price', list.price)
  return list.categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: prices
        .filter((p) => p.category === cat.id)
        .map((p) => ({ id: p._id, name: p.name, price: p.price, unit: p.unit ?? undefined, note: p.note ?? undefined })),
    }))
    .filter((cat) => cat.items.length > 0)
}

export async function getModelSection(): Promise<ModelSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('model_section', 'model')
  const sec = await section('model_section')
  const models = await byIds('model', sec.model)
  const designs: NailDesign[] = models.map((d) => ({
    id: d._id,
    code: d.code,
    name: d.name,
    tags: d.category,
    priceFrom: d.price,
    priceConfirmed: d.price_confirmed,
    image: d.img,
    alt: d.img_alt,
    width: d.img_width,
    height: d.img_height,
  }))
  return { title: sec.title, filters: [{ id: 'all', label: 'Tất cả' }, ...sec.categories], designs }
}

function toCourse(c: Awaited<ReturnType<typeof byIds<'course'>>>[number]): Course {
  return {
    id: c._id,
    name: c.name,
    price: c.price,
    originalPrice: c.original_price ?? undefined,
    summary: c.description,
    highlights: c.commit,
    gift: c.gift ?? undefined,
    featured: c.featured,
    cover: c.img,
  }
}

export async function getCourseSection(): Promise<CourseSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('course_section', 'course')
  const sec = await section('course_section')
  const courses = (await byIds('course', sec.course)).map(toCourse)
  return {
    eyebrow: sec.eyebrow,
    title: sec.title,
    description: sec.description,
    shifts: sec.session,
    courses,
    minPrice: courses.length ? Math.min(...courses.map((c) => c.price)) : null,
  }
}

export async function getAchievementSection(): Promise<AchievementSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('achievement_section', 'achievement', 'course')
  const sec = await section('achievement_section')
  const works = await byIds('achievement', sec.achievement)
  return {
    eyebrow: sec.eyebrow,
    title: sec.title,
    description: sec.description,
    works: works.map((w) => ({
      id: w._id,
      caption: w.name,
      course: w.description,
      courseId: w.course_id,
      placeholder: w.placeholder,
      image: w.img,
      alt: w.img_alt,
    })),
  }
}

export async function getWhyusSection(): Promise<WhyusSectionContent> {
  'use cache'
  cacheLife('max')
  cacheTag('whyus_section', 'whyus')
  const sec = await section('whyus_section')
  const items = await byIds('whyus', sec.whyus)
  return {
    eyebrow: sec.eyebrow,
    usps: items.map((u) => ({ id: u._id, title: u.title, description: u.description, emphasis: u.emphasis, image: u.img, tag: u.tag })),
  }
}

/**
 * Lựa chọn cho form đặt lịch / đăng ký học — dùng chung cho form (hiển thị) và Server Action (kiểm tra hợp lệ).
 * Khóa học: mọi khóa trong DB (khóa đang hiển thị trước), vì khóa phụ như gội dưỡng sinh không có thẻ riêng nhưng vẫn nhận đăng ký.
 */
export async function getBookingOptions(): Promise<BookingOptions> {
  'use cache'
  cacheLife('max')
  cacheTag('combo_section', 'combo', 'model_section', 'model', 'price_list', 'price', 'course_section', 'course')
  const [combo, models, priceList, courseSec, allCourses] = await Promise.all([
    getComboSection(),
    getModelSection(),
    getPriceList(),
    section('course_section'),
    (await col('course')).find(NOT_DELETED).toArray(),
  ])
  const rank = (id: string) => {
    const i = courseSec.course.indexOf(id)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  const courses = [...allCourses].sort((a, b) => rank(a._id) - rank(b._id))
  return {
    beautyGroups: [
      { label: 'Hot combo', options: combo.combos.map((c) => ({ value: c.id, label: `${c.name} – ${formatVnd(c.price)}` })) },
      {
        label: 'Mẫu nail “Vừa ra lò”',
        options: models.designs.map((d) => ({ value: `design:${d.id}`, label: `${d.code} · ${d.name} – từ ${formatVnd(d.priceFrom)}` })),
      },
      ...priceList.map((cat) => ({
        label: cat.name,
        options: cat.items.map((i) => ({ value: i.id, label: `${i.name} – ${formatPrice(i.price)}` })),
      })),
    ].filter((g) => g.options.length > 0),
    courseOptions: courses.map((c) => ({ value: c._id, label: `${c.name} – ${formatVnd(c.price)}` })),
    shifts: courseSec.session,
  }
}
