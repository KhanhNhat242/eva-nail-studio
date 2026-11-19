'use client'

import { startTransition, useActionState, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { submitBooking } from '@/app/actions/booking'
import { initialBookingState, type BookingField, type BookingState } from '@/lib/booking-state'
import { consultOption, optionLabels, timeSlots } from '@/lib/booking-options'
import { VN_PHONE_RE, normalizePhone } from '@/lib/links'
import { BOOKING_EVENT, type BookingSelection } from '@/lib/booking-bus'
import { business } from '@/data/business'
import { nb } from '@/lib/format'
import { telHref, zaloHref } from '@/lib/links'
import { buttonClass } from '@/components/ui/ButtonLink'
import { CheckIcon, PhoneIcon, ZaloIcon } from '@/components/ui/Icons'
import type { BookingOptions } from '@/types/content'


type Mode = 'beauty' | 'course'

const todayVN = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())

// Form dùng bố cục thường (không Exaggerated). Viền mảnh, bo 10px, focus rõ, lỗi viền đỏ.
const inputClass =
  'peer h-12 w-full rounded-control border border-line bg-white px-4 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft hover:border-accent focus:border-ink focus:shadow-[0_0_0_3px_rgba(184,155,114,0.35)] aria-[invalid=true]:border-[#b4533c]'

const fieldLabel: Record<BookingField, string> = {
  name: 'Họ tên',
  phone: 'SĐT / Zalo',
  choice: 'Dịch vụ / khóa học',
  date: 'Ngày hẹn',
  time: 'Khung giờ',
}

function Field({ label, htmlFor, error, children, className = '' }: { label: string; htmlFor: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[13px] text-[#b4533c]">
          {nb(error)}
        </p>
      ) : null}
    </div>
  )
}

function SelectChevron() {
  return (
    <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m5 8 5 5 5-5" />
    </svg>
  )
}

export function BookingForm({ options }: { options: BookingOptions }) {
  const uid = useId()
  const { beautyLabel, courseLabel } = useMemo(() => optionLabels(options), [options])
  const labelsRef = useRef({ beautyLabel, courseLabel })
  const [state, formAction, pending] = useActionState(submitBooking, initialBookingState)
  const [mode, setMode] = useState<Mode>('beauty')
  const [beautyChoice, setBeautyChoice] = useState('')
  const [courseChoice, setCourseChoice] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [dismissed, setDismissed] = useState<BookingState | null>(null)
  // Micro-interactions: nháy ô vừa điền sẵn · thông báo nhỏ · kiểm tra SĐT khi rời ô
  const [flash, setFlash] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  /** null = chưa kiểm tra · '' = hợp lệ · chuỗi = thông báo lỗi */
  const [phoneHint, setPhoneHint] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef(state)

  useEffect(() => {
    labelsRef.current = { beautyLabel, courseLabel }
  }, [beautyLabel, courseLabel])

  useEffect(() => {
    stateRef.current = state
    // Accessible: gửi lỗi → chuyển focus tới hộp tóm tắt lỗi
    if (state.status === 'error') summaryRef.current?.focus()
  }, [state])

  // Gửi thủ công để form KHÔNG tự reset khi có lỗi (giữ nguyên dữ liệu khách đã nhập)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => formAction(fd))
  }

  // Nhận lựa chọn từ "Đặt mẫu này" / "Chọn lịch nhanh" / "Đăng ký học"
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const onSelect = (e: Event) => {
      const { mode: m, value } = (e as CustomEvent<BookingSelection>).detail
      // Đang ở màn hình xác nhận → mở form mới với lựa chọn vừa bấm
      if (stateRef.current.status === 'success') {
        setDismissed(stateRef.current)
        setFormKey((k) => k + 1)
      }
      setMode(m)
      if (m === 'beauty') setBeautyChoice(value)
      else setCourseChoice(value)
      setFlash((f) => f + 1)
      const label = (m === 'beauty' ? labelsRef.current.beautyLabel(value) : labelsRef.current.courseLabel(value))?.split(' – ')[0]
      setToast(label ? `Đã chọn: ${label}` : null)
      clearTimeout(timer)
      timer = setTimeout(() => setToast(null), 3500)
    }
    window.addEventListener(BOOKING_EVENT, onSelect)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(BOOKING_EVENT, onSelect)
    }
  }, [])

  const serverErrors: Partial<Record<BookingField, string>> = state.status === 'error' ? (state.errors ?? {}) : {}
  const errors: Partial<Record<BookingField, string>> = { ...serverErrors }
  if (phoneHint) errors.phone = phoneHint
  if (phoneHint === '') delete errors.phone
  const id = (f: string) => `${uid}-${f}`
  const err = (f: BookingField) => (errors[f] ? { 'aria-invalid': true, 'aria-describedby': `${id(f)}-error` } : {})

  if (state.status === 'success' && state !== dismissed) {
    const s = state.summary
    return (
      <div className="lightbox-fade flex h-full flex-col items-center justify-center py-6 text-center" role="status">
        <span className="grid size-16 place-items-center rounded-card bg-ink text-accent">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-6 font-serif text-[30px] font-medium leading-tight text-ink">
          {nb(state.mode === 'beauty' ? 'Eva đã nhận lịch hẹn của bạn' : 'Eva đã nhận đăng ký của bạn')}
        </h3>
        <dl className="mt-6 w-full max-w-[380px] divide-y divide-line rounded-media border border-line bg-white text-left text-[14px]">
          {[
            ['Họ tên', s.name],
            ['SĐT / Zalo', s.phone],
            [state.mode === 'beauty' ? 'Dịch vụ' : 'Khóa học', s.choice],
            ...(s.date ? [['Ngày hẹn', `${s.date}${s.time ? ` · ${s.time}` : ''}`]] : s.time ? [['Ca học', s.time]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-ink-soft">{k}</dt>
              <dd className="text-right font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-[400px] text-[14px] leading-[1.7] text-ink-soft">
          {nb('Để giữ chỗ chắc chắn, bạn nhắn Zalo cho Eva để xác nhận. Tiệm sẽ nhắn Zalo nhắc lịch trước giờ hẹn.')}
        </p>
        <div className="mt-6 flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
          <a href={zaloHref} target="_blank" rel="noopener noreferrer" className={`${buttonClass('solid')} flex-1`}>
            <ZaloIcon className="size-4" /> Nhắn Zalo xác nhận
          </a>
          <a href={telHref} className={`${buttonClass('outline')} flex-1`}>
            <PhoneIcon className="size-4" /> Gọi Eva
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            setDismissed(state)
            setFormKey((k) => k + 1)
            setPhoneHint(null)
          }}
          className="mt-3 min-h-11 px-2 text-[13px] text-ink-soft underline underline-offset-4 hover:text-ink">
          Đặt thêm lịch khác
        </button>
      </div>
    )
  }

  return (
    <form key={formKey} onSubmit={onSubmit} noValidate className="flex flex-col">
      <input type="hidden" name="mode" value={mode} />

      {/* Micro-interaction: xác nhận lựa chọn vừa điền sẵn */}
      {toast ? (
        <p role="status" className="toast-in mb-4 rounded-control bg-ink px-4 py-3 text-[13px] text-cream">

          <span>{nb(toast)}</span>
        </p>
      ) : null}

      {/* Accessible: tóm tắt lỗi nhận focus, mỗi mục link tới ô lỗi (lỗi chi tiết vẫn nằm dưới từng ô) */}
      {state.status === 'error' ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`${uid}-err-title`}
          className="mb-5 rounded-control border border-[#b4533c] bg-white px-4 py-3 text-[14px] text-[#b4533c] outline-none focus-visible:outline-[3px]"
        >
          <p id={`${uid}-err-title`} className="font-medium">
            {nb(state.message)}
          </p>
          {Object.keys(errors).length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap gap-x-4">
            {(Object.keys(errors) as BookingField[]).map((f) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                  {fieldLabel[f]}
                </a>
              </li>
            ))}
          </ul>
          ) : null}
        </div>
      ) : null}

      {/* Chuyển tab: làm đẹp / khóa học */}
      <div role="tablist" aria-label="Loại đăng ký" className="grid grid-cols-2 gap-1 rounded-control border border-line bg-cream-deep p-1">
        {(
          [
            ['beauty', 'Đặt lịch làm đẹp'],
            ['course', 'Đăng ký khóa học'],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`press h-11 whitespace-nowrap rounded-[8px] px-2 text-[13px] font-medium sm:text-[14px] ${
              mode === m ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Họ tên" htmlFor={id('name')} error={errors.name}>
          <input id={id('name')} name="name" autoComplete="name" placeholder="Nguyễn Thị Hoa" className={inputClass} {...err('name')} />
        </Field>
        <Field label="SĐT / Zalo" htmlFor={id('phone')} error={errors.phone}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0789 784 718"
            className={inputClass}
            // Micro-interaction: kiểm tra khi rời ô, xoá lỗi khi gõ lại
            onBlur={(e) => {
              const v = normalizePhone(e.currentTarget.value)
              if (!v) return setPhoneHint(null)
              setPhoneHint(VN_PHONE_RE.test(v) ? '' : 'Số điện thoại/Zalo chưa đúng, ví dụ 0789784718.')
            }}
            onInput={() => {
              if (phoneHint) setPhoneHint(null)
            }}
            {...err('phone')}
          />
        </Field>

        {mode === 'beauty' ? (
          <>
            <Field label="Dịch vụ hoặc mẫu nail" htmlFor={id('choice')} error={errors.choice} className="sm:col-span-2">
              <div key={flash} className={`relative rounded-control ${flash ? 'field-flash' : ''}`}>
                <select
                  id={id('choice')}
                  name="choice"
                  value={beautyChoice}
                  onChange={(e) => setBeautyChoice(e.target.value)}
                  className={`${inputClass} appearance-none pr-10`}
                  {...err('choice')}
                >
                  <option value="" disabled>
                    Chọn dịch vụ, combo hoặc mẫu đã thích
                  </option>
                  {options.beautyGroups.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>
            <Field label="Ngày hẹn" htmlFor={id('date')} error={errors.date}>
              <input id={id('date')} name="date" type="date"
                // Ngày nhỏ nhất = hôm nay, tính tại client khi mở lịch (tránh lệch khi render tĩnh)
                onFocus={(e) => {
                  e.currentTarget.min = todayVN()
                }}
                onPointerDown={(e) => {
                  e.currentTarget.min = todayVN()
                }}
                className={`${inputClass} [color-scheme:light]`} {...err('date')} />
            </Field>
            <Field label="Khung giờ" htmlFor={id('time')} error={errors.time}>
              <div className="relative">
                <select id={id('time')} name="time" defaultValue="" className={`${inputClass} appearance-none pr-10`} {...err('time')}>
                  <option value="" disabled>
                    9:30 – 19:30
                  </option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>
          </>
        ) : (
          <>
            <Field label="Khóa học quan tâm" htmlFor={id('choice')} error={errors.choice}>
              <div key={flash} className={`relative rounded-control ${flash ? 'field-flash' : ''}`}>
                <select
                  id={id('choice')}
                  name="choice"
                  value={courseChoice}
                  onChange={(e) => setCourseChoice(e.target.value)}
                  className={`${inputClass} appearance-none pr-10`}
                  {...err('choice')}
                >
                  <option value="" disabled>
                    Chọn khóa học
                  </option>
                  {[...options.courseOptions, consultOption].map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>
            <Field label="Ca học mong muốn" htmlFor={id('shift')}>
              <div className="relative">
                <select id={id('shift')} name="shift" defaultValue="" className={`${inputClass} appearance-none pr-10`}>
                  <option value="">Linh hoạt / cần tư vấn</option>
                  {options.shifts.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>
          </>
        )}

        <Field label="Ghi chú" htmlFor={id('note')} className="sm:col-span-2">
          <textarea
            id={id('note')}
            name="note"
            rows={3}
            maxLength={500}
            placeholder={mode === 'beauty' ? 'Độ dài móng, màu yêu thích, số người đi cùng…' : 'Bạn đã có kinh nghiệm chưa, mục tiêu đi làm hay mở tiệm…'}
            className={`${inputClass} h-auto resize-none py-3 leading-relaxed`}
          />
        </Field>
      </div>

      <button type="submit" disabled={pending} className={`${buttonClass('solid', 'lg')} mt-7 w-full disabled:cursor-wait disabled:opacity-70`}>
        {pending ? 'Đang gửi…' : mode === 'beauty' ? 'Gửi lịch hẹn' : 'Gửi đăng ký học'}
      </button>

      <p className="mt-4 flex items-start gap-2.5 text-[13px] leading-[1.65] text-ink-soft">
        <ZaloIcon className="mt-0.5 size-4 shrink-0 text-accent" />
        <span>
          {nb(
            mode === 'beauty'
              ? 'Sau khi đặt, tiệm sẽ nhắn Zalo xác nhận và nhắc lịch trước giờ hẹn cho bạn.'
              : `Eva sẽ liên hệ qua Zalo ${business.phoneDisplay} để tư vấn lộ trình phù hợp với bạn.`,
          )}
        </span>
      </p>
    </form>
  )
}
