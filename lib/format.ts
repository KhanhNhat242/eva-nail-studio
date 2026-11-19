import type { PriceRange } from '@/types/cms'

const vnd = new Intl.NumberFormat('vi-VN')

/** 129000 -> "129.000đ" */
export function formatVnd(value: number): string {
  return `${vnd.format(value)}đ`
}

/** Giá cố định / khoảng giá / "từ …" / null -> chuỗi hiển thị thống nhất. */
export function formatPrice(price: PriceRange, fallback = 'Liên hệ tư vấn'): string {
  if (price === null) return fallback
  if (price.max === null) return `Từ ${formatVnd(price.min)}`
  if (price.max === price.min) return formatVnd(price.min)
  return `${formatVnd(price.min)} – ${formatVnd(price.max)}`
}

/**
 * Chống "rớt 1 chữ" xuống dòng cuối: nối từ cuối với từ liền trước bằng
 * khoảng trắng không ngắt (U+00A0). Áp dụng cho mọi đoạn text hiển thị.
 */
export function nb(text: string): string {
  // Không ngắt dòng ngay tại dấu gạch nối giữa 2 ký tự (A–Z, 5–7…): chèn word-joiner U+2060
  const joined = text
    .replace(/(\S)([–-])(?=\S)/g, '$1⁠$2⁠')
    // "A – B": dấu gạch luôn dính với chữ đứng trước, không rớt xuống đầu dòng
    .replace(/ ([–—]) /g, ' $1 ')
  const i = joined.trimEnd().lastIndexOf(' ')
  if (i <= 0) return joined
  return `${joined.slice(0, i)} ${joined.slice(i + 1)}`
}
