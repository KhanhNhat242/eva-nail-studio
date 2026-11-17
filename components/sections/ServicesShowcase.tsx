'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { featuredServices, type FeaturedService } from '@/data/services'
import { courseIntro, mainCourses } from '@/data/courses'
import { formatPrice, formatVnd, nb } from '@/lib/format'
import { ArrowIcon, buttonClass } from '@/components/ui/ButtonLink'

type ShowcaseItem = {
  id: string
  title: string
  description: string
  priceLabel: string
  cta: { label: string; href: string }
  image?: { src: string; alt: string }
  /** Thẻ nền đen (khóa học) thay cho ảnh */
  dark?: { kicker: string; heading: string }
}

const svc = Object.fromEntries(featuredServices.map((s) => [s.id, s])) as Record<string, FeaturedService>
const minCourse = Math.min(...mainCourses.map((c) => c.price))

const fromService = (s: FeaturedService): ShowcaseItem => ({
  id: s.id,
  title: s.title,
  description: s.description,
  priceLabel: formatPrice(s.price, s.priceLabel),
  cta: { label: 'Đặt lịch', href: '#dat-lich' },
  image: { src: s.image, alt: s.imageAlt },
})

/** Thứ tự thẻ: Nail → Khóa học (giữ đào tạo nổi bật, REQUIREMENTS mục 1) → Gội → Mi */
const items: ShowcaseItem[] = [
  fromService(svc.nail),
  {
    id: 'khoa-hoc',
    title: 'Đào tạo nghề nail & gội',
    description: courseIntro,
    priceLabel: `Học phí từ ${formatVnd(minCourse)}`,
    cta: { label: 'Xem khóa học', href: '#khoa-hoc' },
    dark: { kicker: 'Khóa học tại Eva', heading: 'Học nghề ngay tại salon đang vận hành' },
  },
  fromService(svc.goi),
  fromService(svc.mi),
]

/** Vị trí từng thẻ theo khoảng cách k = i − active (0 = thẻ chính, 1..3 = thẻ phụ phía sau, <0 = đã qua). */
function cardStyle(k: number) {
  if (k < 0) return { transform: 'translateY(34%) scale(1)', opacity: 0, zIndex: 40 } // trượt xuống + mờ dần
  if (k === 0) return { transform: 'translateY(0) scale(1)', opacity: 1, zIndex: 30 }
  const visible = k <= 3
  return { transform: `translateY(${-k * 11}%) scale(${1 - k * 0.09})`, opacity: visible ? 1 : 0, zIndex: 30 - k }
}

/**
 * Section Dịch vụ — người dùng yêu cầu (17/11/2026): 2 cột, trái là chồng thẻ cuộn dọc, phải là tiêu đề + mô tả.
 * Section được ghim (sticky); cuộn trong phạm vi section → thẻ chính trượt xuống & mờ dần,
 * thẻ phụ phóng to thành thẻ chính và trượt xuống; mô tả bên phải đổi theo thẻ đang hiện.
 */
export function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const n = items.length

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const headerH = window.innerWidth >= 1024 ? 76 : 64
      const rect = el.getBoundingClientRect()
      const range = el.offsetHeight - (window.innerHeight - headerH)
      const p = range > 0 ? Math.min(1, Math.max(0, (headerH - rect.top) / range)) : 0
      const next = Math.min(n - 1, Math.floor(p * n))
      setActive((cur) => (cur === next ? cur : next))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [n])

  /** Bấm chỉ báo → cuộn tới đúng đoạn của thẻ đó (giữ đồng bộ với hiệu ứng cuộn). */
  const goTo = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const headerH = window.innerWidth >= 1024 ? 76 : 64
    const range = el.offsetHeight - (window.innerHeight - headerH)
    const top = el.getBoundingClientRect().top + window.scrollY - headerH + ((i + 0.5) / n) * range
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const current = items[active]

  return (
    <section
      ref={sectionRef}
      id="dich-vu"
      aria-labelledby="dich-vu-title"
      className="relative bg-cream"
      // mỗi thẻ ~ 60svh quãng cuộn; phần ghim cao bằng màn hình trừ header
      style={{ height: `calc(100svh + ${(n - 1) * 60}svh)` }}
    >
      <div className="sticky top-16 flex h-[calc(100svh-64px)] items-center overflow-hidden lg:top-[76px] lg:h-[calc(100svh-76px)]">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-10">
          {/* Cột trái: chồng thẻ */}
          <div className="relative mx-auto w-full max-w-[260px] pt-[25%] sm:max-w-[420px] lg:max-w-[560px]" aria-hidden>
            <div className="relative aspect-[4/3] w-full">
              {items.map((it, i) => {
                const s = cardStyle(i - active)
                return (
                  <div
                    key={it.id}
                    className="absolute inset-0 origin-top overflow-hidden rounded-card shadow-[0_18px_40px_-26px_rgba(20,20,20,0.45)] transition-[transform,opacity] duration-700 ease-[var(--ease-lux)] will-change-transform motion-reduce:transition-none"
                    style={s}
                  >
                    {it.image ? (
                      <Image src={it.image.src} alt="" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
                    ) : it.dark ? (
                      <div className="flex h-full flex-col justify-end bg-ink p-7 text-cream lg:p-10">
                        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent">{it.dark.kicker}</p>
                        <p className="mt-3 max-w-[420px] font-serif text-[30px] font-medium leading-[1.05] tracking-[-0.02em] lg:text-[44px]">
                          {nb(it.dark.heading)}
                        </p>
                      </div>
                    ) : null}
                    {/* lớp tối nhẹ cho thẻ phụ phía sau để thẻ chính nổi bật */}
                    <span
                      className="pointer-events-none absolute inset-0 bg-ink transition-opacity duration-700 motion-reduce:transition-none"
                      style={{ opacity: i - active > 0 ? 0.18 : 0 }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cột phải: tiêu đề + mô tả + chi tiết thẻ đang hiện */}
          <div className="max-w-[520px]">
            <h2
              id="dich-vu-title"
              className="font-serif text-[30px] font-medium leading-[1.04] tracking-[-0.025em] text-ink sm:text-[38px] lg:text-[48px]"
            >
              {nb('Làm đẹp tại Eva, học nghề cùng Eva')}
            </h2>
            <p className="mt-3 hidden text-[14px] leading-[1.7] text-ink-soft sm:block lg:mt-5 lg:text-base">
              {nb('Nail gel, gội đầu thư giãn, nối mi – uốn mi, và các khóa đào tạo nghề nail, gội ngay tại tiệm ở Gò Vấp.')}
            </p>

            <div className="mt-5 border-t border-line pt-5 lg:mt-8 lg:pt-8" aria-live="polite">
              <div key={current.id} className="lightbox-fade">
                <h3 className="font-serif text-[24px] font-medium leading-[1.1] text-ink lg:text-[32px]">{nb(current.title)}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-ink-soft lg:mt-3 lg:text-[15px]">{nb(current.description)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-6">
                  <span className="text-[15px] font-medium text-ink">{nb(current.priceLabel)}</span>
                  <a href={current.cta.href} className={buttonClass('outline', 'sm')}>
                    {current.cta.label} <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Chỉ báo vị trí — bấm được (bàn phím / trình đọc màn hình) */}
            <div className="mt-5 flex items-center gap-2 lg:mt-10" role="group" aria-label="Chọn dịch vụ">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={it.title}
                  aria-current={i === active ? 'true' : undefined}
                  className="group grid h-11 place-items-center px-1"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-300 ${i === active ? 'w-10 bg-ink' : 'w-5 bg-accent/60 group-hover:bg-accent'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
