'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usps } from '@/data/usps'
import { nb } from '@/lib/format'
import { ChevronIcon } from '@/components/ui/Icons'

type Layout = { W: number; cardW: number; step: number }

const HEADER = () => (window.innerWidth >= 1024 ? 76 : 64)

/**
 * "Vì sao chọn Eva" — bố cục theo ảnh mẫu người dùng gửi (17/11/2026):
 * nền `why-us-banner` (tường + bàn ghế), hàng thẻ lơ lửng trên tường, tiêu đề góc dưới trái,
 * 2 nút tròn góc dưới phải (thẻ trước / sau).
 * Section ghim (sticky): cuộn xuống → hàng thẻ trượt ngang phải → trái. Ngừng cuộn → thẻ gần giữa nhất
 * được căn giữa và "tan" vào tường: khung thẻ biến mất, ảnh minh họa mờ dần ra mép và hòa vào màu tường,
 * tiêu đề + mô tả hiện lớn trên tường. Cuộn tiếp → trở lại dạng thẻ.
 */
export function WhyGallery() {
  const n = usps.length
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const layoutRef = useRef<Layout>({ W: 1200, cardW: 240, step: 274 })
  const [layout, setLayout] = useState<Layout | null>(null)
  const [active, setActive] = useState(0)
  const [settled, setSettled] = useState(false)

  const range = useCallback(() => {
    const el = sectionRef.current
    return el ? el.offsetHeight - (window.innerHeight - HEADER()) : 0
  }, [])

  /** Vị trí cuộn (window.scrollY) để thẻ i nằm giữa */
  const targetY = useCallback(
    (i: number) => {
      const el = sectionRef.current
      if (!el) return 0
      return el.getBoundingClientRect().top + window.scrollY - HEADER() + (i / (n - 1)) * range()
    },
    [n, range],
  )

  // Đo kích thước sân khấu → kích thước thẻ
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver(([entry]) => {
      const W = entry.contentRect.width
      const cardW = Math.round(W < 640 ? Math.min(250, W * 0.6) : Math.min(250, Math.max(200, W * 0.18)))
      const next = { W, cardW, step: cardW + Math.round(cardW * 0.14) }
      layoutRef.current = next
      setLayout(next)
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  // Cuộn → dịch hàng thẻ; dừng cuộn → căn giữa thẻ gần nhất + "tan" vào tường
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let idle: ReturnType<typeof setTimeout> | undefined
    let current = -1

    const apply = () => {
      raf = 0
      const { W, cardW, step } = layoutRef.current
      const r = range()
      const rect = el.getBoundingClientRect()
      const p = r > 0 ? Math.min(1, Math.max(0, (HEADER() - rect.top) / r)) : 0
      const pos = p * (n - 1)
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${(W / 2 - cardW / 2 - pos * step).toFixed(1)}px,0,0)`
      const next = Math.round(pos)
      if (next !== current) {
        current = next
        setActive(next)
      }
      return { rect, next }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
      setSettled(false)
      clearTimeout(idle)
      idle = setTimeout(() => {
        const { rect, next } = apply()
        const engaged = rect.top <= HEADER() + 1 && rect.bottom >= window.innerHeight - 1
        if (!engaged) return
        const y = targetY(next)
        if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
        else setSettled(true)
      }, 180)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [n, range, targetY, layout])

  const goTo = (i: number) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: targetY(Math.max(0, Math.min(n - 1, i))), behavior: reduce ? 'auto' : 'smooth' })
  }

  const cardW = layout?.cardW ?? 240
  const cardH = Math.round(cardW * 1.3)

  return (
    <section
      ref={sectionRef}
      id="vi-sao"
      aria-labelledby="vi-sao-title"
      className="relative bg-cream"
      // mỗi thẻ ~ 40svh quãng cuộn
      style={{ height: `calc(100svh + ${(n - 1) * 40}svh)` }}
    >
      <div ref={stageRef} className="sticky top-16 h-[calc(100svh-64px)] overflow-hidden lg:top-[76px] lg:h-[calc(100svh-76px)]">
        {/* Tường + bàn ghế */}
        <Image
          src="/images/why-us-banner.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_72%]"
        />

        {/* Hàng thẻ trên tường */}
        <ul
          ref={trackRef}
          aria-label="Lý do chọn Eva"
          className="absolute left-0 top-[7%] flex will-change-transform"
          style={{ gap: layout ? layout.step - cardW : 34 }}
        >
          {usps.map((u, i) => {
            const isActive = i === active
            const dissolved = isActive && settled
            return (
              <li key={u.id} className="relative shrink-0" style={{ width: cardW, height: cardH }} aria-current={isActive ? 'true' : undefined}>
                {/* Mặt thẻ (biến mất khi tan vào tường) */}
                <div
                  className="absolute inset-0 rounded-card bg-cream shadow-[0_24px_40px_-24px_rgba(20,20,20,0.45)] transition-[opacity,transform] duration-700 ease-[var(--ease-lux)] motion-reduce:transition-none"
                  style={{ opacity: dissolved ? 0 : 1, transform: dissolved ? 'scale(1.06)' : 'scale(1)' }}
                />

                {/* Ảnh trong thẻ */}
                <div
                  className="absolute inset-x-3 bottom-3 top-[40%] overflow-hidden rounded-media transition-opacity duration-700 motion-reduce:transition-none"
                  style={{ opacity: dissolved ? 0 : 1 }}
                >
                  <Image src={u.image} alt="" fill sizes={`${cardW}px`} loading="eager" className="object-cover" />
                </div>

                {/* Ảnh "tan" vào tường: mép mờ dần + hòa màu tường (multiply) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-[22%] bottom-[-34%] top-[54%] transition-[opacity,transform] duration-1000 ease-[var(--ease-lux)] [mask-image:radial-gradient(ellipse_at_center,#000_28%,transparent_68%)] motion-reduce:transition-none"
                  style={{ opacity: dissolved ? 0.95 : 0, transform: dissolved ? 'scale(1)' : 'scale(0.86)', mixBlendMode: 'multiply' }}
                >
                  <Image src={u.image} alt="" fill sizes={`${Math.round(cardW * 1.5)}px`} loading="eager" className="object-cover" />
                </div>

                {/* Chữ */}
                <div className="relative z-10 px-4 pt-6 text-center">
                  <h3
                    className="font-serif font-medium leading-[1.1] text-ink transition-[font-size] duration-700 ease-[var(--ease-lux)] motion-reduce:transition-none"
                    style={{ fontSize: dissolved ? Math.min(34, cardW * 0.14) : Math.min(22, cardW * 0.092) }}
                  >
                    {nb(u.title)}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">{u.tag}</p>
                  <p
                    className="mx-auto mt-3 max-w-[260px] text-[13.5px] leading-[1.55] text-ink transition-opacity duration-700 motion-reduce:transition-none"
                    style={{ opacity: dissolved ? 1 : 0 }}
                  >
                    {nb(u.description)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Tiêu đề góc dưới trái (như "Stories" trong mẫu) */}
        <div className="absolute bottom-[84px] left-5 max-w-[min(360px,calc(100%-140px))] rounded-card bg-cream px-5 py-4 shadow-[0_16px_32px_-22px_rgba(20,20,20,0.45)] sm:left-8 lg:bottom-8 lg:left-10">
          <h2 id="vi-sao-title" className="font-serif text-[22px] font-medium leading-[1.1] text-ink lg:text-[28px]">
            {nb('Vì sao chọn Eva')}
          </h2>
          <p className="mt-1 text-[12.5px] text-ink-soft" aria-live="polite">
            {nb(`${active + 1} / ${n} · ${usps[active].title}`)}
          </p>
        </div>

        {/* 2 nút tròn góc dưới phải: thẻ trước / sau */}
        <div className="absolute bottom-[84px] right-5 flex flex-col gap-3 sm:right-8 lg:bottom-8 lg:right-10">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Lý do trước"
            className="press grid size-12 place-items-center rounded-card bg-cream text-ink shadow-[0_12px_24px_-16px_rgba(20,20,20,0.5)] disabled:opacity-50 lg:size-14"
          >
            <ChevronIcon dir="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === n - 1}
            aria-label="Lý do tiếp theo"
            className="press grid size-12 place-items-center rounded-card bg-cream text-ink shadow-[0_12px_24px_-16px_rgba(20,20,20,0.5)] disabled:opacity-50 lg:size-14"
          >
            <ChevronIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
