/**
 * Cầu nối giữa nút "Đặt mẫu này" / "Chọn lịch nhanh" / "Đăng ký học"
 * và form đặt lịch trên cùng trang (chỉ chạy phía client).
 */
export type BookingSelection =
  | { mode: 'beauty'; value: string }
  | { mode: 'course'; value: string }

export const BOOKING_EVENT = 'eva:booking-select'
export const BOOKING_ANCHOR = 'dat-lich'

export function selectForBooking(selection: BookingSelection) {
  window.dispatchEvent(new CustomEvent<BookingSelection>(BOOKING_EVENT, { detail: selection }))
  document.getElementById(BOOKING_ANCHOR)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
