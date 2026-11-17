/**
 * Dịch vụ & bảng giá — nguồn: docs/REQUIREMENTS.md mục 4 (ảnh menu khách gửi).
 * Đơn vị: đồng. Chuyên gel, KHÔNG làm bột.
 */

export type PriceValue = number | [number, number] | null

export type ServiceItem = {
  id: string
  name: string
  price: PriceValue
  unit?: string
  note?: string
}

export type ServiceCategory = {
  id: string
  name: string
  items: ServiceItem[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nail-care',
    name: 'Nail Care – Chăm sóc móng',
    items: [
      { id: 'cat-da', name: 'Cắt da tay / chân', price: 30_000 },
      { id: 'cung-mong', name: 'Cứng móng – cứng móng tạo cầu', price: [30_000, 70_000], note: 'Làm đầy móng, fix móng yếu, dễ gãy' },
      { id: 'pha-son-gel', name: 'Phá sơn gel', price: 30_000 },
      { id: 'pha-mong-up', name: 'Phá móng úp / gel cứng', price: 50_000 },
      { id: 'phu-gel-nuoi', name: 'Phủ gel nuôi móng', price: 100_000 },
      { id: 'dap-gel-noi', name: 'Đắp gel nối móng / Dual Form', price: [250_000, 300_000] },
      { id: 'refill-dap-gel', name: 'Refill móng đắp gel', price: [150_000, 200_000], note: 'Làm đầy chân móng gel mới lại' },
      { id: 'up-mong-gel', name: 'Úp móng gel', price: 130_000, note: 'Úp móng bằng base gel cách chân' },
      { id: 'refill-up', name: 'Refill móng úp', price: [80_000, 100_000], note: 'Làm đầy chân móng úp mới lại' },
      { id: 'biab', name: 'Builder Gel – BIAB', price: [180_000, 220_000], note: 'Phủ gel builder nuôi móng, có màu sẵn' },
    ],
  },
  {
    id: 'son',
    name: 'Sơn',
    items: [
      { id: 'son-gel', name: 'Sơn gel / thạch', price: 110_000 },
      { id: 'son-mat-meo', name: 'Sơn mắt mèo / nhũ / ngọc trai', price: 130_000 },
      { id: 'ombre', name: 'Ombre lòng đào / full móng', price: [70_000, 120_000] },
      { id: 'son-3-mau', name: 'Sơn từ 3 màu / dặm che nền móng', price: 30_000 },
    ],
  },
  {
    id: 'design',
    name: 'Design – Thiết kế móng',
    items: [
      { id: 'french', name: 'French', price: [99_000, 120_000], unit: 'set' },
      { id: 'trang-guong', name: 'Tráng gương', price: [99_000, 120_000], unit: 'set' },
      { id: 've-gel-noi', name: 'Vẽ gel nổi', price: [10_000, 50_000] },
      { id: 've-co-ban', name: 'Vẽ cơ bản', price: [5_000, 35_000] },
      { id: 've-hoat-hinh', name: 'Vẽ hoạt hình / hoạ tiết', price: [20_000, 200_000] },
      { id: 'an-nhu', name: 'Ẩn nhũ / xà cừ / hoa', price: [10_000, 30_000] },
      { id: 'marble', name: 'Loang marble vân đá', price: [15_000, 45_000] },
      { id: 'hoa-tiet-gam', name: 'Hoạ tiết gấm', price: [15_000, 25_000] },
      { id: 'charm', name: 'Charm / đính đá', price: [3_000, 50_000] },
      { id: 'thu-noi', name: 'Thú nổi / hoa nổi', price: [20_000, 80_000] },
      { id: 'sticker', name: 'Sticker', price: [3_000, 30_000] },
      { id: 'phu-mat-meo', name: 'Phủ mắt mèo', price: 90_000, note: 'Thêm 1 lớp mắt mèo trên nền' },
    ],
  },
  {
    id: 'goi-dau',
    name: 'Gội đầu thư giãn',
    items: [
      { id: 'goi-30', name: 'Gội đầu thư giãn 30 phút', price: 69_000 },
      { id: 'goi-45', name: 'Gội đầu thư giãn 45 phút', price: 99_000 },
    ],
  },
  {
    id: 'mi',
    name: 'Nối mi – Uốn mi',
    items: [
      // Chưa có bảng giá — REQUIREMENTS mục 4.6
      { id: 'noi-mi', name: 'Nối mi', price: null },
      { id: 'uon-mi', name: 'Uốn mi', price: null },
    ],
  },
]

export type HotCombo = {
  id: string
  name: string
  price: number
  includes: string
  /** Ảnh minh họa (mẫu tương tự trong kho tư liệu của tiệm) — hiện khi hover thẻ combo */
  image: string
  imageAlt: string
}

export const hotCombos: HotCombo[] = [
  {
    id: 'combo-cat-da-son-thach',
    name: 'Cắt da – Sơn thạch',
    price: 129_000,
    includes: 'Cắt da sạch, dũa form chuẩn và sơn gel thạch bóng bền màu',
    image: '/images/combos/son-thach-ngan.jpg',
    imageAlt: 'Ảnh minh họa: móng ngắn sơn gel thạch hồng nude bóng',
  },
  {
    id: 'combo-cat-da-mat-meo',
    name: 'Cắt da – Sơn mắt mèo',
    price: 149_000,
    includes: 'Cắt da sạch, dũa form chuẩn và sơn mắt mèo không nền',
    image: '/images/combos/mat-meo-bac.jpg',
    imageAlt: 'Ảnh minh họa: móng sơn mắt mèo ánh bạc',
  },
  {
    id: 'combo-up-son-thach',
    name: 'Úp móng – Sơn thạch',
    price: 199_000,
    includes: 'Úp móng gel cách chân, dũa form tinh tế và sơn gel thạch',
    image: '/images/combos/up-son-thach.jpg',
    imageAlt: 'Ảnh minh họa: móng úp dài sơn thạch hồng nude ánh ngọc trai',
  },
  {
    id: 'combo-up-mat-meo',
    name: 'Úp móng – Sơn mắt mèo',
    price: 229_000,
    includes: 'Úp móng gel cách chân, dũa form tinh tế và sơn mắt mèo',
    image: '/images/combos/up-mat-meo.jpg',
    imageAlt: 'Ảnh minh họa: móng úp dài sơn mắt mèo tím lavender',
  },
]

export type FeaturedService = {
  id: string
  title: string
  description: string
  price: PriceValue
  priceLabel?: string
  image: string
  imageAlt: string
}

export const featuredServices: FeaturedService[] = [
  {
    id: 'nail',
    title: 'Chăm sóc & Thiết kế Nail',
    description: 'Chuyên gel, không làm bột. Từ cắt da, úp móng đến vẽ nổi, đính đá theo đúng gu của bạn.',
    price: [30_000, 300_000],
    image: '/images/nails/hero-hoa-noi-hong.jpg',
    imageAlt: 'Bộ móng gel hồng đính hoa nổi 3D tại Eva Nail Studio',
  },
  {
    id: 'goi',
    title: 'Gội đầu thư giãn',
    description: 'Gội sạch, massage da đầu nhẹ nhàng giúp bạn thả lỏng sau một ngày dài bận rộn.',
    price: [69_000, 99_000],
    image: '/images/services/goi-dau.jpg',
    imageAlt: 'Khách được gội đầu thư giãn, massage da đầu',
  },
  {
    id: 'mi',
    title: 'Nối mi – Uốn mi',
    description: 'Hàng mi cong tự nhiên, tôn đôi mắt sáng hơn mà vẫn nhẹ nhàng, phù hợp đi làm mỗi ngày.',
    price: null,
    priceLabel: 'Liên hệ tư vấn',
    image: '/images/lashes/uon-mi-01.jpg',
    imageAlt: 'Cận cảnh hàng mi uốn cong tự nhiên',
  },
]
