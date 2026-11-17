import type { ReactNode } from 'react'
import { nb } from '@/lib/format'
import { Star } from './Star'

/** Khung chứa nội dung: tối đa 1240px, lề 20 → 40px. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>
}

type Tone = 'cream' | 'deep'

const toneClass: Record<Tone, string> = {
  cream: 'bg-cream',
  deep: 'bg-cream-deep',
}

/**
 * Section chuẩn: đệm dọc 56–64px (mobile) → 96px (desktop),
 * `spacious` dùng 112px cho khu vực ưu tiên (Khóa học).
 */
const toneVar: Record<Tone, string> = {
  cream: 'var(--color-cream)',
  deep: 'var(--color-cream-deep)',
}

export function Section({
  id,
  tone = 'cream',
  fadeFrom,
  spacious = false,
  className = '',
  children,
  labelledBy,
}: {
  id?: string
  tone?: Tone
  /** Tông của section phía trên: nền chuyển dần trong phần đệm trên, không có mép cắt cứng. */
  fadeFrom?: Tone
  spacious?: boolean
  className?: string
  children: ReactNode
  labelledBy?: string
}) {
  const style =
    fadeFrom && fadeFrom !== tone
      ? { backgroundImage: `linear-gradient(to bottom, ${toneVar[fadeFrom]} 0, ${toneVar[tone]} clamp(56px, 9vw, 112px))` }
      : undefined
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      style={style}
      className={`relative ${toneClass[tone]} ${spacious ? 'py-16 md:py-24 lg:py-28' : 'py-14 md:py-20 lg:py-24'} ${className}`}
    >
      {children}
    </section>
  )
}

/**
 * Nhãn phụ: 2–4 từ, 12–13px, sans in hoa, vàng đồng.
 * Chỉ dùng khi nó thêm thông tin mà tiêu đề không có — không đặt trên mọi section (ui-taste).
 */
export function Eyebrow({ children, className = '' }: { children: string; className?: string }) {
  return (
    <p className={`font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-accent-deep md:text-[13px] ${className}`}>{children}</p>
  )
}

/**
 * Cụm tiêu đề section — Exaggerated Minimalism (47): serif lớn, nén chữ, leading chặt, khoảng trắng rộng.
 * - `split` (mặc định): tiêu đề trái · mô tả + hành động phải (desktop) — tránh khuôn "căn giữa mọi section".
 * - `center`: chỉ cho khu cần so sánh đối xứng (bảng khóa học).
 * Chữ nghiêng màu nhấn chỉ dùng ở Hero, không lặp ở tiêu đề section.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  layout = 'split',
  className = '',
  action,
}: {
  id?: string
  eyebrow?: string
  title: ReactNode
  description?: string
  layout?: 'split' | 'center' | 'stack'
  className?: string
  action?: ReactNode
}) {
  const heading = (
    <h2
      id={id}
      className={`font-serif text-[34px] font-medium leading-[1.04] tracking-[-0.025em] text-ink md:text-[42px] lg:text-[48px] ${eyebrow ? 'mt-4' : ''}`}
    >
      {typeof title === 'string' ? nb(title) : title}
    </h2>
  )
  const desc = description ? <p className="text-[15px] leading-[1.75] text-ink-soft md:text-base">{nb(description)}</p> : null

  if (layout === 'split') {
    return (
      <div data-reveal="up" className={`mb-10 grid gap-5 border-b border-line pb-8 lg:mb-14 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16 lg:pb-10 ${className}`}>
        <div className="max-w-[640px]">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {heading}
        </div>
        {desc || action ? (
          <div className="flex max-w-[480px] flex-col items-start gap-5 lg:justify-self-end">
            {desc}
            {action}
          </div>
        ) : null}
      </div>
    )
  }

  const centered = layout === 'center'
  return (
    <div data-reveal="up" className={`mb-12 lg:mb-14 ${centered ? 'mx-auto max-w-[680px] text-center' : 'max-w-[640px]'} ${className}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading}
      {desc ? <div className={`mt-5 ${centered ? 'mx-auto max-w-[540px]' : ''}`}>{desc}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

/** Đường kẻ mảnh #EFE8DC + ngôi sao ✦ ở giữa — phân tách hai section cùng màu nền. */
export function StarDivider({ tone = 'cream' }: { tone?: Tone }) {
  return (
    <div aria-hidden className={`${toneClass[tone]}`}>
      <Container>
        <div className="flex items-center gap-5">
          <span data-reveal="grow-x" className="h-px flex-1 bg-line" />
          <Star className="size-3 text-accent" />
          <span data-reveal="grow-x" className="h-px flex-1 origin-right bg-line" style={{ transformOrigin: 'right center' }} />
        </div>
      </Container>
    </div>
  )
}
