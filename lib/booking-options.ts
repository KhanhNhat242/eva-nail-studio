import { serviceCategories, hotCombos } from '@/data/services'
import { nailDesigns } from '@/data/nail-designs'
import { mainCourses, extraCourse } from '@/data/courses'
import { formatPrice, formatVnd } from '@/lib/format'

/** Danh sách lựa chọn cho form — dùng chung client (hiển thị) và server (kiểm tra hợp lệ). */
export type OptionGroup = { label: string; options: { value: string; label: string }[] }

export const beautyOptionGroups: OptionGroup[] = [
  {
    label: 'Hot combo',
    options: hotCombos.map((c) => ({ value: c.id, label: `${c.name} – ${formatVnd(c.price)}` })),
  },
  {
    label: 'Mẫu nail “Vừa ra lò”',
    options: nailDesigns.map((d) => ({ value: `design:${d.id}`, label: `${d.code} · ${d.name} – từ ${formatVnd(d.priceFrom)}` })),
  },
  ...serviceCategories.map((cat) => ({
    label: cat.name,
    options: cat.items.map((i) => ({ value: i.id, label: `${i.name} – ${formatPrice(i.price)}` })),
  })),
]

export const courseOptions = [...mainCourses, extraCourse].map((c) => ({
  value: c.id,
  label: `${c.name} – ${formatVnd(c.price)}`,
}))

export const consultOption = { value: 'tu-van', label: 'Chưa chọn – cần Eva tư vấn' }

/** Khung giờ 9:30 → 19:30 (khách cuối 19:30), cách 30 phút. */
export const timeSlots: string[] = (() => {
  const out: string[] = []
  for (let m = 9 * 60 + 30; m <= 19 * 60 + 30; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
})()

const allBeauty = new Map(beautyOptionGroups.flatMap((g) => g.options).map((o) => [o.value, o.label]))
const allCourses = new Map([...courseOptions, consultOption].map((o) => [o.value, o.label]))

export function beautyLabel(value: string) {
  return allBeauty.get(value)
}
export function courseLabel(value: string) {
  return allCourses.get(value)
}
