/**
 * Thông tin tiệm — nguồn: docs/REQUIREMENTS.md mục 0, 2, 3.
 * Mọi nơi hiển thị tên, SĐT, giờ, địa chỉ phải import từ đây.
 */
export const business = {
  name: 'Eva Nail Studio',
  tagline: 'Eva Nail n More – Nail Art & Hair Wash & Lashes',
  handle: 'eva.nailstudio',
  phoneDisplay: '0789.784.718',
  phoneRaw: '0789784718',
  phoneIntl: '+84789784718',
  hours: {
    open: '9:30',
    close: '20:30',
    lastCustomer: '19:30',
    display: '9:30 – 20:30',
    note: 'Nhận khách cuối lúc 19:30',
  },
  address: {
    street: '120/61/29 Đường số 59',
    ward: 'Phường An Hội Tây (P.14, Gò Vấp cũ)',
    // "TP. Hồ" — khoảng trắng không ngắt để "TP." không bị tách khỏi tên thành phố
    city: 'TP. Hồ Chí Minh',
    full: '120/61/29 Đường số 59, Phường An Hội Tây (P.14, Gò Vấp cũ), TP. Hồ Chí Minh',
  },
  warranty: 'Bảo hành nail 5–7 ngày tùy trường hợp',
  links: {
    facebook: 'https://www.facebook.com/profile.php?id=61563743506884',
    googleMaps: 'https://maps.app.goo.gl/Ha3oeu3Zmsmkiftc8',
    /** Chưa có URL — xem REQUIREMENTS mục 13 #6 */
    instagram: null as string | null,
    tiktok: null as string | null,
  },
  /** Iframe Google Maps theo địa chỉ (không cần API key). */
  mapEmbedQuery: '120/61/29 Đường số 59, Phường 14, Gò Vấp, Hồ Chí Minh',
} as const

export const navItems = [
  { label: 'Dịch vụ', href: '#dich-vu' },
  { label: 'Mẫu nail', href: '#mau-nail' },
  { label: 'Khóa học', href: '#khoa-hoc' },
  { label: 'Thành quả học viên', href: '#thanh-qua' },
  { label: 'Liên hệ', href: '#lien-he' },
] as const
