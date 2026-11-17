/**
 * Thư viện mẫu nail — REQUIREMENTS mục 5.
 * Thứ tự mảng = thứ tự hiển thị "Vừa ra lò" (mẫu mới nhất đặt đầu mảng).
 * Thêm mẫu mới: thêm 1 object vào ĐẦU mảng + 1 ảnh trong public/images/nails/.
 *
 * ⚠ Giá từng mẫu chưa được khách xác nhận: "Giá từ…" ước lượng theo bảng giá
 * (combo + design trong data/services.ts) → priceConfirmed: false.
 */

export const designFilters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'mat-meo', label: 'Mắt mèo' },
  { id: 'ombre', label: 'Ombre' },
  { id: 'dinh-da', label: 'Đính đá' },
  { id: 've-noi-3d', label: 'Vẽ nổi 3D' },
] as const

export type DesignTag = Exclude<(typeof designFilters)[number]['id'], 'all'>

export type NailDesign = {
  id: string
  code: string
  name: string
  tags: DesignTag[]
  priceFrom: number
  priceConfirmed: boolean
  image: string
  alt: string
  width: number
  height: number
}

export const nailDesigns: NailDesign[] = [
  {
    id: 'mat-meo-do-ruou-van-bac',
    code: 'EVA-01',
    name: 'Mắt mèo đỏ rượu vân bạc',
    tags: ['mat-meo'],
    priceFrom: 149_000,
    priceConfirmed: false,
    image: '/images/nails/mat-meo-do-ruou-van-bac.jpg',
    alt: 'Bộ móng mắt mèo đỏ rượu phối vân chrome bạc bóng',
    width: 1080,
    height: 1440,
  },
  {
    id: 'hoa-noi-3d-hong-thach',
    code: 'EVA-02',
    name: 'Hoa nổi 3D hồng thạch',
    tags: ['ve-noi-3d', 'dinh-da'],
    priceFrom: 219_000,
    priceConfirmed: false,
    image: '/images/nails/hoa-noi-3d-hong-thach.jpg',
    alt: 'Móng dài sơn thạch hồng nude đính hoa nổi 3D và đá',
    width: 1080,
    height: 1440,
  },
  {
    id: 'vo-so-sao-bien',
    code: 'EVA-03',
    name: 'Vỏ sò sao biển nhiệt đới',
    tags: ['ve-noi-3d', 'ombre'],
    priceFrom: 249_000,
    priceConfirmed: false,
    image: '/images/nails/vo-so-sao-bien.jpg',
    alt: 'Móng chủ đề biển với sao biển, vỏ sò nổi 3D và hoa dâm bụt',
    width: 1284,
    height: 1249,
  },
  {
    id: 'lua-hong-den',
    code: 'EVA-04',
    name: 'Hoạ tiết lửa hồng đen',
    tags: ['ombre', 'dinh-da'],
    priceFrom: 229_000,
    priceConfirmed: false,
    image: '/images/nails/lua-hong-den-da-bao.jpg',
    alt: 'Móng nhọn hoạ tiết lửa hồng đen phối da báo và viền đá',
    width: 1284,
    height: 1284,
  },
  {
    id: 'dinh-da-da-bao',
    code: 'EVA-05',
    name: 'Đính đá phối da báo',
    tags: ['dinh-da'],
    priceFrom: 159_000,
    priceConfirmed: false,
    image: '/images/nails/dinh-da-da-bao.jpg',
    alt: 'Móng ngắn xanh denim đính đá lớn phối hoạ tiết da báo',
    width: 1080,
    height: 1080,
  },
  {
    id: 'mat-meo-lavender',
    code: 'EVA-06',
    name: 'Mắt mèo lavender đính đá',
    tags: ['mat-meo', 'dinh-da'],
    priceFrom: 159_000,
    priceConfirmed: false,
    image: '/images/nails/mat-meo-lavender-dinh-da.jpg',
    alt: 'Móng nhọn mắt mèo tím lavender sữa, đính đá viền chân móng',
    width: 1959,
    height: 1959,
  },
  {
    id: 'ombre-ngoc-trai-tim',
    code: 'EVA-07',
    name: 'Ombre ngọc trai tim đá',
    tags: ['ombre', 'dinh-da'],
    priceFrom: 179_000,
    priceConfirmed: false,
    image: '/images/nails/ombre-ngoc-trai-tim.jpg',
    alt: 'Móng ombre nude ánh ngọc trai, trái tim viền đá và nơ nhỏ',
    width: 1080,
    height: 1440,
  },
  {
    id: 'no-noi-mint-hong',
    code: 'EVA-08',
    name: 'Nơ nổi mint hồng ngọc trai',
    tags: ['ve-noi-3d', 'dinh-da'],
    priceFrom: 229_000,
    priceConfirmed: false,
    image: '/images/nails/no-noi-mint-hong.jpg',
    alt: 'Móng vuông hồng nhũ loang mint, nơ nổi trong suốt và ngọc trai',
    width: 1080,
    height: 1440,
  },
]

/** Ảnh dùng cho Hero (bố cục 3 ảnh bất đối xứng) — REQUIREMENTS mục 9. */
export const heroImages = {
  main: { src: '/images/nails/hero-hoa-noi-hong.jpg', alt: 'Bộ móng ombre hồng thạch đính hoa nổi 3D', width: 1189, height: 1585 },
  second: { src: '/images/nails/ombre-ngoc-trai-tim.jpg', alt: 'Móng ombre nude ánh ngọc trai trên nền len kem', width: 1080, height: 1440 },
  lash: { src: '/images/lashes/uon-mi-01.jpg', alt: 'Góc nghiêng hàng mi uốn cong vút tự nhiên', width: 1284, height: 1542 },
} as const
