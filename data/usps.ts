/** 7 điểm mạnh — nguồn: docs/REQUIREMENTS.md mục 10. `image`: ảnh minh họa trong kho (public/images). */
export type Usp = {
  id: string
  title: string
  description: string
  emphasis?: boolean
  image: string
  /** Nhãn ngắn hiện dưới tiêu đề trên thẻ */
  tag: string
}

export const usps: Usp[] = [
  {
    id: 'bao-hanh',
    title: 'Bảo hành nail 5–7 ngày',
    description: 'Yên tâm làm đẹp với chính sách bảo hành nail tùy từng trường hợp.',
    emphasis: true,
    image: '/images/nails/ombre-ngoc-trai-tim.jpg',
    tag: 'An tâm',
  },
  {
    id: 'chuyen-gel',
    title: 'Chuyên gel, không làm bột',
    description: 'Chỉ làm gel nên bộ móng mỏng nhẹ, bóng đẹp và tự nhiên hơn.',
    emphasis: true,
    image: '/images/combos/son-thach-ngan.jpg',
    tag: 'Nail gel',
  },
  {
    id: 'mau-moi',
    title: 'Mẫu mới liên tục',
    description: 'Cập nhật mẫu thường xuyên, có khuyến mãi theo các dịp lễ trong năm.',
    image: '/images/nails/lua-hong-den-da-bao.jpg',
    tag: 'Vừa ra lò',
  },
  {
    id: 'da-dich-vu',
    title: 'Nail – Gội – Mi một nơi',
    description: 'Làm móng, gội đầu thư giãn và uốn mi trong cùng một buổi hẹn.',
    emphasis: true,
    image: '/images/lashes/uon-mi-02.jpg',
    tag: 'Trọn gói',
  },
  {
    id: 'dao-tao',
    title: 'Vừa làm vừa đào tạo',
    description: 'Đào tạo nghề nail và gội ngay tại tiệm đang phục vụ khách mỗi ngày.',
    image: '/images/combos/up-son-thach.jpg',
    tag: 'Học nghề',
  },
  {
    id: 'nhieu-khoa',
    title: 'Khóa học theo cấp độ',
    description: 'Nhiều mức học phí, chọn lộ trình vừa sức và đúng mục tiêu.',
    image: '/images/nails/dinh-da-da-bao.jpg',
    tag: 'Lộ trình',
  },
  {
    id: 'dat-lich',
    title: 'Đặt lịch qua Zalo',
    description: 'Nhắn Zalo, Facebook hoặc đặt ngay trên web, Eva xác nhận nhanh.',
    image: '/images/nails/mat-meo-lavender-dinh-da.jpg',
    tag: 'Tiện lợi',
  },
]
