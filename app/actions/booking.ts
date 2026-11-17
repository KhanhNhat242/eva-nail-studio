'use server'

import { VN_PHONE_RE, normalizePhone } from '@/lib/links'
import { beautyLabel, courseLabel, timeSlots } from '@/lib/booking-options'
import type { BookingField, BookingState } from '@/lib/booking-state'

function todayInVietnam(): string {
  // YYYY-MM-DD theo giờ Việt Nam
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())
}

function str(fd: FormData, key: string) {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const mode = str(formData, 'mode') === 'course' ? 'course' : 'beauty'
  const name = str(formData, 'name')
  const phone = normalizePhone(str(formData, 'phone'))
  const choice = str(formData, 'choice')
  const note = str(formData, 'note').slice(0, 500)
  const errors: Partial<Record<BookingField, string>> = {}

  if (name.length < 2) errors.name = 'Vui lòng nhập họ tên của bạn.'
  if (!VN_PHONE_RE.test(phone)) errors.phone = 'Số điện thoại/Zalo chưa đúng, ví dụ 0789784718.'

  let choiceLabel: string | undefined
  let date = ''
  let time = ''

  if (mode === 'beauty') {
    choiceLabel = beautyLabel(choice)
    if (!choiceLabel) errors.choice = 'Vui lòng chọn dịch vụ hoặc mẫu nail.'
    date = str(formData, 'date')
    time = str(formData, 'time')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = 'Vui lòng chọn ngày hẹn.'
    else if (date < todayInVietnam()) errors.date = 'Ngày hẹn không được ở quá khứ.'
    if (!timeSlots.includes(time)) errors.time = 'Vui lòng chọn khung giờ từ 9:30 đến 19:30.'
  } else {
    choiceLabel = courseLabel(choice)
    if (!choiceLabel) errors.choice = 'Vui lòng chọn khóa học quan tâm.'
    time = str(formData, 'shift')
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Bạn kiểm tra lại giúp Eva các ô được đánh dấu nhé.', errors }
  }

  // TODO(integration): gửi dữ liệu về nơi tiệm nhận (Google Sheet / email / Zalo OA) — REQUIREMENTS mục 8.3, 13 #8.
  // Hiện tại demo chỉ xác thực và phản hồi, CHƯA lưu trữ hay gửi tin Zalo tự động.

  return {
    status: 'success',
    mode,
    summary: {
      name,
      phone,
      choice: choiceLabel ?? '',
      date: mode === 'beauty' ? date.split('-').reverse().join('/') : undefined,
      time: time || undefined,
      note: note || undefined,
    },
  }
}
