'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { nb } from '@/lib/format'
import { ArrowIcon } from '@/components/ui/ButtonLink'
import type { Usp } from '@/types/content'

const HEADER = () => (window.innerWidth >= 1024 ? 76 : 64)

/**
 * Vị trí ảnh theo khoảng cách k = i − active (đơn vị % của khung carousel):
 * ảnh chính lớn bên trái, các ảnh sau xếp sang phải nhỏ & thấp dần (căn giữa theo chiều dọc),
 * ảnh đã qua trượt sang trái & mờ đi.
 */
function slot(k: number): CSSProperties {
  if (k < 0) return { left: '-24%', width: '50%', height: '100%', top: '0%', opacity: 0, zIndex: 10 }
  const table = [
    { left: 0, width: 50, height: 100 },
    { left: 51.5, width: 21, height: 80 },
    { left: 74, width: 14.5, height: 64 },
    { left: 89.5, width: 10.5, height: 50 },
  ]
  const s = table[Math.min(k, 3)]
  const hidden = k > 3
  return {
    left: `${hidden ? 104 : s.left}%`,
    width: `${s.width}%`,
    height: `${s.height}%`,
    top: `${(100 - s.height) / 2}%`,
    opacity: hidden ? 0 : 1,
    zIndex: 20 - k,
  }
}

/**
 * "Vì sao chọn Eva" — bố cục theo ảnh mẫu người dùng gửi (17/11/2026):
 * nền ink; trái: tiêu đề serif rất lớn + mô tả + nút bo tròn; phải: carousel ảnh xếp nhỏ dần + thanh tiến độ.
 * Section ghim (sticky): cuộn trong phạm vi section → chuyển sang ảnh tiếp theo, chữ bên trái đổi theo.
 */
export function WhyStory({ eyebrow, usps }: { eyebrow: string; usps: Usp[] }) {
  const n = usps.length
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.offsetHeight - (window.innerHeight - HEADER())
      const p = r > 0 ? Math.min(1, Math.max(0, (HEADER() - el.getBoundingClientRect().top) / r)) : 0
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

  /** Bấm ảnh phụ / thanh tiến độ → cuộn tới đoạn của mục đó */
  const goTo = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.offsetHeight - (window.innerHeight - HEADER())
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER() + ((i + 0.5) / n) * r, behavior: reduce ? 'auto' : 'smooth' })
  }

  const u = usps[active]
  if (!u) return null

  return (
    <section
      ref={sectionRef}
      id="vi-sao"
      aria-labelledby="vi-sao-title"
      className="relative bg-ink text-cream"
      // mỗi mục ~ 55svh quãng cuộn
      style={{ height: `calc(100svh + ${(n - 1) * 55}svh)` }}
    >
      <div className="sticky top-16 flex h-[calc(100svh-64px)] items-center overflow-hidden lg:top-[76px] lg:h-[calc(100svh-76px)]">
        <div className="mx-auto grid h-full w-full max-w-[1240px] grid-rows-[auto_1fr] gap-6 px-5 pb-[76px] pt-8 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:grid-rows-1 lg:items-center lg:gap-14 lg:px-10 lg:py-14">
          {/* Trái: chữ đổi theo mục đang hiện */}
          {/* Tiêu đề + mô tả + nút đi liền một khối, căn giữa theo chiều dọc (không đẩy về 2 đầu) */}
          <div className="flex flex-col lg:justify-center">
            <div>
              <h2 id="vi-sao-title" className="text-[12px] font-medium uppercase tracking-[0.22em] text-accent">
                {nb(eyebrow)} · {String(active + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
              </h2>
              <p
                key={`t-${u.id}`}
                className="lightbox-fade mt-4 font-serif text-[40px] font-medium leading-[0.98] tracking-[-0.02em] text-cream sm:text-[52px] lg:mt-6 lg:text-[clamp(56px,5.6vw,84px)]"
                aria-live="polite"
              >
                {nb(u.title)}
              </p>
            </div>

            <div className="mt-4 lg:mt-8">
              <p key={`d-${u.id}`} className="lightbox-fade max-w-[340px] text-[14px] leading-[1.65] text-cream/80 lg:text-[15px]">
                {nb(u.description)}
              </p>
              <a
                href="#dat-lich"
                className="press group mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-cream/50 px-6 text-[13px] font-medium text-cream hover:border-cream hover:bg-cream hover:text-ink lg:mt-7"
              >
                Đặt lịch tại Eva <ArrowIcon className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Phải: carousel ảnh + thanh tiến độ */}
          <div className="flex min-h-0 flex-col lg:justify-center">
            {/* Desktop: khung tỉ lệ 16:10 (ảnh chính ~4:5) thay vì cao cả màn hình */}
            <div className="relative min-h-[220px] flex-1 lg:aspect-[16/10] lg:max-h-[min(560px,calc(100svh-220px))] lg:flex-none">
              {usps.map((it, i) => {
                // Mục cuối: các mục đầu quay vòng vào hàng chờ để bên phải không bị trống
                const d = i - active
                const k = d < 0 && d + n <= 3 ? d + n : d
                return (
                  <button
                    key={it.id}
                    type="button"
                    tabIndex={k > 0 && k <= 3 ? 0 : -1}
                    aria-hidden={k !== 0 && !(k > 0 && k <= 3)}
                    aria-label={k === 0 ? it.title : `Xem: ${it.title}`}
                    onClick={() => (k !== 0 ? goTo(i) : undefined)}
                    className={`absolute overflow-hidden rounded-media bg-cream-deep transition-[left,top,width,height,opacity] duration-[800ms] ease-[var(--ease-lux)] motion-reduce:transition-none ${
                      k === 0 ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    style={slot(k)}
                  >
                    <Image src={it.image} alt="" fill sizes="(min-width: 1024px) 40vw, 60vw" loading="eager" className="object-cover" />
                    {/* ảnh phụ hơi tối để ảnh chính nổi bật */}
                    <span className="pointer-events-none absolute inset-0 bg-ink transition-opacity duration-700" style={{ opacity: k > 0 ? 0.28 : 0 }} />
                  </button>
                )
              })}
            </div>

            {/* Thanh tiến độ (bấm được) */}
            <div className="mt-5 flex h-11 items-center gap-1 lg:mt-7" role="group" aria-label="Chọn lý do">
              {usps.map((it, i) => (
                <button key={it.id} type="button" onClick={() => goTo(i)} aria-label={it.title} aria-current={i === active ? 'true' : undefined} className="group grid h-11 flex-1 place-items-center">
                  <span className={`block h-[2px] w-full transition-colors duration-500 ${i <= active ? 'bg-cream' : 'bg-cream/25 group-hover:bg-cream/50'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
