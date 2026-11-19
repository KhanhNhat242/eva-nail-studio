import type { BookingOptions } from '@/types/content'

/**
 * Tiện ích cho form đặt lịch — dùng chung client (hiển thị) và server (kiểm tra hợp lệ).
 * Danh sách lựa chọn đọc từ DB: `getBookingOptions()` trong lib/cms/queries.ts.
 */

export const consultOption = { value: 'tu-van', label: 'Chưa chọn – cần Eva tư vấn' } as const

/** Khung giờ 9:30 → 19:30 (khách cuối 19:30), cách 30 phút. */
export const timeSlots: string[] = (() => {
  const out: string[] = []
  for (let m = 9 * 60 + 30; m <= 19 * 60 + 30; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
})()

/** Tra nhãn theo value: beauty (combo / mẫu / dịch vụ) và course (khóa + "tư vấn"). */
export function optionLabels(options: BookingOptions) {
  const beauty = new Map(options.beautyGroups.flatMap((g) => g.options).map((o) => [o.value, o.label]))
  const course = new Map([...options.courseOptions, consultOption].map((o) => [o.value, o.label]))
  return {
    beautyLabel: (value: string) => beauty.get(value),
    courseLabel: (value: string) => course.get(value),
  }
}
