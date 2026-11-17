'use client'

import { selectForBooking } from '@/lib/booking-bus'
import { ArrowIcon, buttonClass } from '@/components/ui/ButtonLink'

/** Mở form đăng ký học (tab "Đăng ký khóa học") với khóa đã chọn. */
export function CourseRegisterButton({
  courseId,
  courseName,
  variant,
  compact = false,
}: {
  courseId: string
  courseName: string
  variant: 'solid' | 'light'
  compact?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={`Đăng ký khóa ${courseName}`}
      onClick={() => selectForBooking({ mode: 'course', value: courseId })}
      className={`${buttonClass(variant)} ${compact ? '' : 'mt-8 w-full'}`}
    >
      Đăng ký học <ArrowIcon />
    </button>
  )
}
