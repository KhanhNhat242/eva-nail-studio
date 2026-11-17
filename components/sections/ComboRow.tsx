'use client'

import Image from 'next/image'
import { useState } from 'react'
import { hotCombos } from '@/data/services'
import { formatVnd, nb } from '@/lib/format'
import { QuickBookButton } from './QuickBookButton'

/**
 * Hàng 4 combo — bố cục theo ảnh mẫu người dùng gửi (17/11/2026).
 * Desktop (lg+): 4 thẻ cùng 1 hàng. Mặc định: tên + mô tả (+ giá, nút chọn lịch).
 * Hover / focus 1 thẻ: thẻ đó nở rộng, chia 2 cột — ảnh minh họa trượt từ trái sang (cột phải),
 * nền phần chữ bên trái đổi sang `blush`; các thẻ khác thu hẹp.
 * Màn nhỏ (không có hover): vẫn 1 hàng, vuốt ngang, ảnh hiện sẵn phía trên.
 */
export function ComboRow() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div
      className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:h-[380px] lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0"
      onMouseLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null)
      }}
    >
      {hotCombos.map((c, i) => {
        const isActive = active === i
        return (
          <article
            key={c.id}
            data-active={isActive}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-line bg-cream transition-[flex-grow,border-color] duration-500 ease-[var(--ease-lux)] motion-reduce:transition-none sm:w-[46%] lg:w-auto lg:min-w-0 lg:shrink lg:grow lg:basis-0 lg:flex-row lg:data-[active=true]:grow-[2.2] lg:data-[active=true]:border-accent"
          >
            {/* Cột chữ (trái) — đổi nền khi active */}
            <div className="flex min-w-0 flex-1 flex-col p-6 transition-colors duration-500 motion-reduce:transition-none lg:p-7 lg:group-data-[active=true]:bg-blush">
              <h3 className="font-serif text-[25px] font-medium leading-[1.12] text-ink">{nb(c.name)}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">{nb(c.includes)}</p>
              <div className="mt-auto pt-6">
                <p className="font-serif text-[34px] leading-none text-ink">{formatVnd(c.price)}</p>
                <QuickBookButton value={c.id} label={`Chọn lịch ${c.name}`} />
              </div>
            </div>

            {/* Cột ảnh (phải) — desktop: rộng 0 → 46%, ảnh trượt từ trái sang; mobile: ảnh phía trên */}
            <div className="order-first p-2 pb-0 lg:order-none lg:w-0 lg:shrink-0 lg:overflow-hidden lg:p-0 lg:transition-[width] lg:duration-500 lg:ease-[var(--ease-lux)] lg:motion-reduce:transition-none lg:group-data-[active=true]:w-[46%]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-media lg:aspect-auto lg:h-full lg:w-full lg:rounded-none lg:py-2 lg:pr-2">
                <div className="relative size-full overflow-hidden rounded-media lg:-translate-x-[60%] lg:opacity-0 lg:transition-[translate,opacity] lg:duration-700 lg:ease-[var(--ease-lux)] lg:motion-reduce:transition-none lg:group-data-[active=true]:translate-x-0 lg:group-data-[active=true]:opacity-100">
                  <Image src={c.image} alt={c.imageAlt} fill sizes="(min-width: 1024px) 260px, 80vw" className="object-cover" />
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
