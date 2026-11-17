import { business } from '@/data/business'

export const telHref = `tel:${business.phoneRaw}`
export const zaloHref = `https://zalo.me/${business.phoneRaw}`
export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(business.mapEmbedQuery)}&output=embed`

/** SĐT di động Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx (đầu số 3,5,7,8,9). */
export const VN_PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export function normalizePhone(input: string): string {
  return input.replace(/[\s.\-()]/g, '')
}
