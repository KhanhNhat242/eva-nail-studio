'use client'

import { useRef } from 'react'
import { business } from '@/data/business'
import { formatPrice, nb } from '@/lib/format'
import { ArrowIcon, buttonClass } from '@/components/ui/ButtonLink'
import { CloseIcon } from '@/components/ui/Icons'
import type { ServiceCategory } from '@/types/content'

/** Liên kết "Xem toàn bộ bảng giá" → popup bảng giá chi tiết (dữ liệu bảng giá từ CMS). */
export function PriceListDialog({ trigger = 'button', categories }: { trigger?: 'button' | 'link'; categories: ServiceCategory[] }) {
  const ref = useRef<HTMLDialogElement>(null)

  return (
    <>
      {trigger === 'link' ? (
        <button
          type="button"
          onClick={() => ref.current?.showModal()}
          className="press group inline-flex min-h-11 items-center gap-3 text-[13px] font-medium uppercase tracking-[0.16em] text-ink hover:text-accent-deep"
        >
          Xem toàn bộ bảng giá
          <span className="grid size-11 place-items-center rounded-control border border-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-cream">
            <ArrowIcon className="size-4 -rotate-45" />
          </span>
        </button>
      ) : (
        <button type="button" onClick={() => ref.current?.showModal()} className={buttonClass('solid')}>
          Xem toàn bộ bảng giá <ArrowIcon />
        </button>
      )}

      <dialog
        ref={ref}
        aria-labelledby="bang-gia-title"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
        className="m-auto max-h-[88svh] w-[min(760px,calc(100vw-24px))] overflow-hidden rounded-card bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/55 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[88svh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 md:px-9 md:py-6">
            <h2 id="bang-gia-title" className="font-serif text-[30px] font-medium leading-tight md:text-[36px]">
              Bảng giá dịch vụ
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Đóng bảng giá"
              className="press grid size-11 shrink-0 place-items-center rounded-control border border-line hover:bg-cream-deep"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-6 md:px-9 md:py-8">
            <div className="grid gap-10">
              {categories.map((cat) => (
                <section key={cat.id} aria-label={cat.name}>
                  <h3 className="font-serif text-[22px] font-medium">{nb(cat.name)}</h3>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {cat.items.map((item) => (
                      <li key={item.id} className="flex items-baseline justify-between gap-6 py-3.5">
                        <div>
                          <p className="text-[15px] text-ink">{nb(item.name)}</p>
                          {item.note ? <p className="mt-0.5 text-[13px] text-ink-soft">{nb(item.note)}</p> : null}
                        </div>
                        <p className="shrink-0 text-right text-[14px] font-medium text-ink">
                          {formatPrice(item.price)}
                          {item.unit ? <span className="text-ink-soft"> / {item.unit}</span> : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <p className="mt-8 text-[13px] leading-[1.7] text-ink-soft">
              {nb(`Đơn vị: đồng. Chuyên gel, không làm bột. ${business.warranty}.`)}
            </p>
          </div>

          <div className="border-t border-line px-6 py-4 md:px-9">
            <a href="#dat-lich" onClick={() => ref.current?.close()} className={`${buttonClass('solid')} w-full`}>
              Đặt lịch ngay
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}
