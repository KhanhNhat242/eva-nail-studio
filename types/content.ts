/**
 * Dạng dữ liệu mà component website dùng (đã chuyển từ data/*.ts).
 * `lib/cms/queries.ts` đọc MongoDB rồi trả về các kiểu này — component không biết đến DB.
 */
import type { PriceRange } from './cms'

export type HeroPhoto = { src: string; alt: string; pos: string }

export type ShowcaseService = {
  id: string
  title: string
  description: string
  priceLabel: string
  cta: { label: string; href: string }
  image?: { src: string; alt: string }
  /** Chữ đè lên ảnh (thẻ khóa học) */
  dark?: { kicker: string; heading: string }
}
export type ServiceSectionContent = { title: string; description: string; items: ShowcaseService[] }

export type HotCombo = { id: string; name: string; price: number; includes: string; image: string; imageAlt: string }
export type ComboSectionContent = { eyebrow: string; title: string; titleHighlight: string; combos: HotCombo[] }

export type ServiceItem = { id: string; name: string; price: PriceRange; unit?: string; note?: string }
export type ServiceCategory = { id: string; name: string; items: ServiceItem[] }

export type DesignFilter = { id: string; label: string }
export type NailDesign = {
  id: string
  code: string
  name: string
  tags: string[]
  priceFrom: number
  priceConfirmed: boolean
  image: string
  alt: string
  width: number
  height: number
}
export type ModelSectionContent = { title: string; filters: DesignFilter[]; designs: NailDesign[] }

export type Course = {
  id: string
  name: string
  price: number
  originalPrice?: number
  summary: string
  highlights: string[]
  gift?: string
  featured?: boolean
  /** Ảnh mặt trước thẻ — có thể chưa có */
  cover: string | null
}
export type CourseSectionContent = {
  eyebrow: string
  title: string
  description: string
  shifts: string[]
  courses: Course[]
  /** Học phí thấp nhất trong các khóa đang hiển thị */
  minPrice: number | null
}

export type StudentWork = {
  id: string
  caption: string
  course: string
  courseId: string
  placeholder: boolean
  image: string
  alt: string
}
export type AchievementSectionContent = { eyebrow: string; title: string; description: string; works: StudentWork[] }

export type Usp = { id: string; title: string; description: string; emphasis?: boolean; image: string; tag: string }
export type WhyusSectionContent = { eyebrow: string; usps: Usp[] }

export type OptionGroup = { label: string; options: { value: string; label: string }[] }
export type BookingOptions = {
  beautyGroups: OptionGroup[]
  courseOptions: { value: string; label: string }[]
  shifts: string[]
}
