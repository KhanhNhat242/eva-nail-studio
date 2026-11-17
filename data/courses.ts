/**
 * Khóa học — nguồn: docs/REQUIREMENTS.md mục 6 (phiếu + poster khách gửi).
 */

export type Course = {
  id: string
  name: string
  level: string
  price: number
  originalPrice?: number
  summary: string
  highlights: string[]
  gift?: string
  featured?: boolean
  /** Ảnh mặt trước thẻ (TiltedCard) — ảnh mẫu nail trong kho, chỉ minh họa */
  cover: string
}

export const courseSlogan = 'Học đúng – Làm được – Tự tin mở tiệm'

export const courseIntro =
  'Lộ trình kèm cặp cá nhân từ 3 đến 5 tháng, thực hành trực tiếp trên mẫu thật, ra nghề làm được ngay tại salon.'

export const mainCourses: Course[] = [
  {
    id: 'co-ban-salon',
    name: 'Cơ bản Salon',
    level: 'Khởi đầu',
    price: 8_000_000,
    summary: 'Bước đầu vào nghề nail cho người mới, học thực tế theo giáo trình rõ ràng và dễ áp dụng.',
    highlights: ['Giáo trình rõ ràng, dễ hiểu', 'Thực hành trên mẫu thật', 'Học theo lộ trình cá nhân'],
    cover: '/images/nails/trang-guong-chrome.jpg',
  },
  {
    id: 'full-salon',
    name: 'Full Salon',
    level: 'Đi làm',
    price: 12_000_000,
    originalPrice: 12_900_000,
    summary: 'Trang bị kỹ năng làm việc trong môi trường salon chuyên nghiệp, sẵn sàng đi làm sau khóa học.',
    highlights: ['Kỹ năng sát thực tế salon', 'Lên mẫu thực tế từng bước', 'Tư vấn đồ nghề sau khóa'],
    cover: '/images/nails/ombre-xanh-bien.jpg',
  },
  {
    id: 'full-a-z',
    name: 'Full A–Z chuyên nghiệp',
    level: 'Mở tiệm',
    price: 16_000_000,
    originalPrice: 16_900_000,
    summary: 'Lộ trình trọn vẹn từ cơ bản đến nâng cao, kèm hỗ trợ set up mở tiệm chuẩn salon sau khóa.',
    highlights: ['Cơ bản – nâng cao – chuyên nghiệp', 'Kèm cốp đồ cơ bản (không gồm máy mài)', 'Định hướng việc làm sau học'],
    gift: 'Tặng bộ đầu mài WILSON cao cấp',
    cover: '/images/nails/hero-hoa-noi-hong.jpg',
    featured: true,
  },
]

export const extraCourse = {
  id: 'goi-duong-sinh',
  name: 'Gội dưỡng sinh 2 tuần',
  price: 6_000_000,
  summary: 'Massage, bấm huyệt dưỡng sinh và thực hành trên mẫu thật mỗi buổi, cấp chứng chỉ sau khi hoàn thành.',
} as const

/** Ca học — poster mới (REQUIREMENTS 6.1, chờ xác nhận). */
export const classShifts = ['09:30 – 13:00', '13:30 – 17:00', '17:30 – 20:30'] as const
