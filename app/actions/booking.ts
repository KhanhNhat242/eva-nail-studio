'use server'

import { randomUUID } from 'node:crypto'
import { VN_PHONE_RE, normalizePhone } from '@/lib/links'
import { optionLabels, timeSlots } from '@/lib/booking-options'
import { getBookingOptions } from '@/lib/cms/queries'
import { col } from '@/lib/db/mongo'
import type { BookingField, BookingState } from '@/lib/booking-state'

function todayInVietnam(): string {
  // YYYY-MM-DD theo giờ Việt Nam
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())
}

function str(fd: FormData, key: string) {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

const SAVE_FAILED =
  'Eva chưa lưu được thông tin do lỗi hệ thống. Bạn nhắn Zalo hoặc gọi Eva để đặt lịch giúp mình nhé.'

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const mode = str(formData, 'mode') === 'course' ? 'course' : 'beauty'
  const name = str(formData, 'name').slice(0, 100)
  const phone = normalizePhone(str(formData, 'phone'))
  const choice = str(formData, 'choice')
  const note = str(formData, 'note').slice(0, 500)
  const errors: Partial<Record<BookingField, string>> = {}

  let options
  try {
    options = await getBookingOptions()
  } catch (e) {
    console.error('[booking] không đọc được danh sách lựa chọn', e)
    return { status: 'error', message: SAVE_FAILED }
  }
  const { beautyLabel, courseLabel } = optionLabels(options)

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
    // Ca học không bắt buộc; nếu có thì phải nằm trong danh sách ca đang mở
    if (time && !options.shifts.includes(time)) time = ''
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Bạn kiểm tra lại giúp Eva các ô được đánh dấu nhé.', errors }
  }

  // Lưu vào MongoDB (REQUIREMENTS mục 8.3). Admin xem tại /admin/dat-lich, /admin/hoc-vien.
  // TODO(integration): báo về email / Zalo OA, nhắc lịch tự động qua Zalo ZNS — chưa làm (mục 13 #8).
  try {
    const base = { _id: randomUUID(), name, phone_number: phone, note: note || null, status: 'new' as const, created_at: new Date() }
    if (mode === 'beauty') {
      await (await col('booking_customer')).insertOne({ ...base, service: choice, service_label: choiceLabel ?? choice, date, time })
    } else {
      await (await col('course_student')).insertOne({ ...base, course_name: choice, course_label: choiceLabel ?? choice, session: time || null, is_deleted: false })
    }
  } catch (e) {
    console.error('[booking] lưu thất bại', e)
    return { status: 'error', message: SAVE_FAILED }
  }

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
