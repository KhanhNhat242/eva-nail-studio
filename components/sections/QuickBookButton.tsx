'use client'

import { selectForBooking } from '@/lib/booking-bus'
import { buttonClass } from '@/components/ui/ButtonLink'
import { CalendarIcon } from '@/components/ui/Icons'

/**
 * Nút "Chọn lịch nhanh" trên thẻ combo — điền sẵn combo vào form đặt lịch.
 * Trong hàng combo desktop, thẻ đang thu hẹp chỉ còn ~160px: ẩn icon (chỉ hiện khi thẻ mở rộng)
 * để chữ không bị bóp; mobile luôn hiện icon.
 */
export function QuickBookButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => selectForBooking({ mode: 'beauty', value })}
      className={`${buttonClass('outline', 'smTight')} mt-6 w-full`}
    >
      <CalendarIcon className="size-4 shrink-0 lg:hidden lg:group-data-[active=true]:block" /> Chọn lịch nhanh
    </button>
  )
}
