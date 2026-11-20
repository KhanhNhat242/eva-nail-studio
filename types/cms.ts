/**
 * Kiểu dữ liệu lưu trong MongoDB — khớp `docs/cms-seed/*.json` (xem README ở đó).
 * `_id` là chuỗi = `id` trong seed (không dùng ObjectId để cache / serialize dễ).
 * Section = collection chỉ có 1 document `_id: 'main'`; mảng id trong section quyết định item nào hiện và theo thứ tự nào.
 */

/** Giá (đồng). min = max: giá cố định · max = null: "từ min" · cả object null: "Liên hệ tư vấn". */
export type PriceRange = { min: number; max: number | null } | null

export const SECTION_ID = 'main'

/**
 * Xóa mềm: bấm "Xóa" trong CMS chỉ đặt `is_deleted: true` (bản ghi vẫn còn trong DB), mặc định `false`.
 * Áp dụng cho các collection danh sách nội dung + `course_student`. Mọi truy vấn đọc phải lọc bằng NOT_DELETED (lib/db/mongo.ts).
 */
export type SoftDelete = { is_deleted: boolean }

/** Kết quả trả về của mọi Server Action trong /admin (dùng được cả ở client). */
export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; errors?: Record<string, string> }

export type HeroPhotoDoc = { img: string; img_alt: string; img_position: string }
export const HERO_SLOTS = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7', 'hero8'] as const
export type HeroSlot = (typeof HERO_SLOTS)[number]
export type HeroGridDoc = { _id: string } & Record<HeroSlot, HeroPhotoDoc>

export type ServiceDoc = SoftDelete & {
  _id: string
  title: string
  description: string
  price: PriceRange
  /** Nếu price null: chữ hiển thị thay giá. Nếu có giá: tiền tố trước giá (vd. "Học phí từ"). */
  price_label: string | null
  img: string | null
  img_alt: string | null
  cta: { label: string; href: string }
  /** Chữ đè lên ảnh thẻ (thẻ khóa học) */
  overlay?: { kicker: string; heading: string } | null
}
export type ServiceSectionDoc = { _id: string; title: string; description: string; service: string[] }

export type ComboDoc = SoftDelete & { _id: string; title: string; description: string; price: number; img: string; img_alt: string }
export type ComboSectionDoc = { _id: string; eyebrow: string; title: string; title_highlight: string; combo: string[] }

export type PriceDoc = SoftDelete & {
  _id: string
  category: string
  category_name: string
  name: string
  price: PriceRange
  unit: string | null
  note: string | null
}
export type PriceListDoc = { _id: string; categories: { id: string; name: string }[]; price: string[] }

export type ModelDoc = SoftDelete & {
  _id: string
  code: string
  name: string
  category: string[]
  /** Giá "từ" */
  price: number
  price_confirmed: boolean
  img: string
  img_alt: string
  img_width: number
  img_height: number
}
export type ModelSectionDoc = { _id: string; title: string; categories: { id: string; label: string }[]; model: string[] }

export type CourseDoc = SoftDelete & {
  _id: string
  name: string
  price: number
  original_price: number | null
  description: string
  commit: string[]
  gift: string | null
  featured: boolean
  img: string | null
  img_placeholder: boolean
}
export type CourseSectionDoc = {
  _id: string
  eyebrow: string
  title: string
  description: string
  session: string[]
  session_confirmed: boolean
  course: string[]
}

export type AchievementDoc = SoftDelete & {
  _id: string
  name: string
  description: string
  course_id: string
  /** true = ảnh minh họa, CHƯA phải bài học viên — giao diện luôn ghi "Ảnh minh họa" */
  placeholder: boolean
  img: string
  img_alt: string
}
export type AchievementSectionDoc = { _id: string; eyebrow: string; title: string; description: string; achievement: string[] }

export type WhyusDoc = SoftDelete & { _id: string; title: string; description: string; img: string; tag: string; emphasis: boolean }
export type WhyusSectionDoc = { _id: string; eyebrow: string; whyus: string[] }

export const BOOKING_STATUSES = ['new', 'confirmed', 'done', 'cancelled'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]
export const bookingStatusLabel: Record<BookingStatus, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  done: 'Hoàn tất',
  cancelled: 'Đã huỷ',
}

export type BookingCustomerDoc = {
  _id: string
  name: string
  phone_number: string
  /** value của ô chọn trong form: id combo / id mục giá / "design:<id mẫu>" */
  service: string
  /** nhãn hiển thị tại thời điểm đặt (giữ nguyên dù item bị sửa/xóa sau đó) */
  service_label: string
  date: string
  time: string
  note: string | null
  status: BookingStatus
  created_at: Date
}

export type CourseStudentDoc = SoftDelete & {
  _id: string
  name: string
  phone_number: string
  /** id khóa học hoặc "tu-van" */
  course_name: string
  course_label: string
  session: string | null
  note: string | null
  status: BookingStatus
  created_at: Date
}

export type CollectionMap = {
  hero_grid: HeroGridDoc
  service: ServiceDoc
  service_section: ServiceSectionDoc
  combo: ComboDoc
  combo_section: ComboSectionDoc
  price: PriceDoc
  price_list: PriceListDoc
  model: ModelDoc
  model_section: ModelSectionDoc
  course: CourseDoc
  course_section: CourseSectionDoc
  achievement: AchievementDoc
  achievement_section: AchievementSectionDoc
  whyus: WhyusDoc
  whyus_section: WhyusSectionDoc
  booking_customer: BookingCustomerDoc
  course_student: CourseStudentDoc
}
export type CollectionName = keyof CollectionMap
