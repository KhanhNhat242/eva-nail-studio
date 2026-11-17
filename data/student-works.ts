/**
 * Thành quả học viên — REQUIREMENTS mục 7.
 * ⚠ Chưa có ảnh thật của học viên. Theo yêu cầu người dùng (17/11/2026), thẻ dùng ảnh mẫu nail
 * ngẫu nhiên trong /public/images làm ẢNH MINH HỌA — `placeholder: true` nghĩa là "chưa phải bài học viên",
 * giao diện luôn ghi rõ "Ảnh minh họa". Khi có ảnh thật: thay `image` + `alt`, đặt placeholder: false.
 */
export type StudentWork = {
  id: string
  caption: string
  course: string
  /** id khóa học để nút "Đăng ký" điền sẵn form (data/courses.ts) */
  courseId: string
  placeholder: boolean
  image: string
  alt: string
}

export const studentWorks: StudentWork[] = [
  {
    id: 'hv-01',
    caption: 'Bài thực hành sơn gel',
    course: 'Cơ bản Salon',
    courseId: 'co-ban-salon',
    placeholder: true,
    image: '/images/nails/mat-meo-do-ruou-van-bac.jpg',
    alt: 'Ảnh minh họa mẫu nail mắt mèo đỏ rượu (chưa phải bài của học viên)',
  },
  {
    id: 'hv-02',
    caption: 'Bài thực hành úp móng',
    course: 'Full Salon',
    courseId: 'full-salon',
    placeholder: true,
    image: '/images/nails/no-noi-mint-hong.jpg',
    alt: 'Ảnh minh họa mẫu nail nơ nổi mint hồng (chưa phải bài của học viên)',
  },
  {
    id: 'hv-03',
    caption: 'Bài thực hành vẽ nổi',
    course: 'Full A–Z chuyên nghiệp',
    courseId: 'full-a-z',
    placeholder: true,
    image: '/images/nails/vo-so-sao-bien.jpg',
    alt: 'Ảnh minh họa mẫu nail vỏ sò sao biển nổi 3D (chưa phải bài của học viên)',
  },
  {
    id: 'hv-04',
    caption: 'Bài thực hành gội dưỡng sinh',
    course: 'Gội dưỡng sinh 2 tuần',
    courseId: 'goi-duong-sinh',
    placeholder: true,
    image: '/images/services/goi-dau.jpg',
    alt: 'Ảnh minh họa gội đầu dưỡng sinh (chưa phải bài của học viên)',
  },
]
