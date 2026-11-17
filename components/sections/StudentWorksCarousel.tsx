'use client'

import { studentWorks } from '@/data/student-works'
import { nb } from '@/lib/format'
import { selectForBooking } from '@/lib/booking-bus'
import { CalendarIcon } from '@/components/ui/Icons'
import ProfileCard from '@/components/ui/ProfileCard'

/**
 * Thành quả học viên bằng ProfileCard (React Bits) — thẻ nghiêng 3D + glare theo chuột (theo mẫu người dùng gửi).
 * Ô ảnh: ảnh + tên khóa + tên bài thực hành. Hàng dưới: trạng thái ("Ảnh minh họa" — luôn đủ chỗ hiển thị), nút "Đăng ký" (điền sẵn khóa).
 * ⚠ Ảnh hiện là ẢNH MINH HỌA (chưa có ảnh học viên thật) — trạng thái luôn ghi rõ, xem data/student-works.ts.
 */
export function StudentWorksCarousel() {
  return (
    <ul
      aria-label="Thành quả học viên"
      className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0"
    >
      {studentWorks.map((w, i) => (
        <li
          key={w.id}
          data-reveal="up"
          style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
          className="w-[300px] shrink-0 snap-center sm:w-[320px] lg:w-auto"
        >
          <ProfileCard
            className="w-full!"
            avatarUrl={w.image}
            avatarAlt={w.alt}
            name={nb(w.course)}
            title={nb(w.caption)}
            status={w.placeholder ? 'Ảnh minh họa' : 'Bài học viên'}
            statusColor="#b89b72"
            contactText="Đăng ký"
            contactIcon={<CalendarIcon className="size-4" />}
            onContactClick={() => selectForBooking({ mode: 'course', value: w.courseId })}
            theme="light"
            holo={0.8}
            glare={0.5}
            tiltStrength={12}
            parallax={8}
            radius={16}
            enableTilt
            intro
            showUserInfo
            imageSizes="(min-width: 1024px) 280px, 320px"
          />
        </li>
      ))}
    </ul>
  )
}
