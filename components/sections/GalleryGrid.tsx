'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { designFilters, nailDesigns, type NailDesign } from '@/data/nail-designs'
import { formatVnd, nb } from '@/lib/format'
import { selectForBooking } from '@/lib/booking-bus'
import { buttonClass } from '@/components/ui/ButtonLink'
import { ChevronIcon, CloseIcon, ExpandIcon } from '@/components/ui/Icons'
import BounceCards from '@/components/ui/BounceCards'

type FilterId = (typeof designFilters)[number]['id']

const tagLabel = Object.fromEntries(designFilters.map((f) => [f.id, f.label])) as Record<FilterId, string>

function bookDesign(d: NailDesign) {
  selectForBooking({ mode: 'beauty', value: `design:${d.id}` })
}

/** Theo dõi độ rộng phần tử (ResizeObserver) để tính kích thước BounceCards theo màn hình. */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/**
 * Bố cục BounceCards co giãn: thẻ to nhất 230px, nhỏ nhất 128px; khoảng xoè và lực đẩy khi hover
 * được giới hạn để các thẻ (kể cả khi bị đẩy) không tràn khỏi khung.
 */
function bounceLayout(width: number, count: number) {
  const cardSize = Math.round(Math.min(230, Math.max(128, width * 0.36)))
  const gaps = Math.max(1, count - 1)
  const spread = Math.max(24, Math.min(cardSize * (count <= 2 ? 0.62 : 0.5), (width - cardSize * 1.15) / gaps))
  const room = width / 2 - cardSize / 2 - (gaps / 2) * spread
  const pushDistance = Math.max(16, Math.min(cardSize * 0.7, room))
  return { cardSize, spread, pushDistance, height: Math.round(cardSize * 1.45) }
}

/** Tab theo nhóm: chồng thẻ BounceCards + danh sách mẫu (giữ chức năng "Đặt mẫu này"). */
function TagStack({ filter, items, onOpen }: { filter: FilterId; items: NailDesign[]; onOpen: (i: number) => void }) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const layout = bounceLayout(width || 360, items.length)

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} className="flex w-full max-w-[900px] justify-center">
        {width > 0 ? (
          <BounceCards
            key={filter}
            images={items.map((d) => ({ src: d.image, alt: `Phóng to ảnh mẫu ${d.name}` }))}
            containerWidth="100%"
            containerHeight={layout.height}
            cardSize={layout.cardSize}
            spread={layout.spread}
            rotation={10}
            arc={0}
            pushDistance={layout.pushDistance}
            hoverScale={1.06}
            bounciness={0.6}
            animationDelay={0.15}
            animationStagger={0.06}
            borderWidth={5}
            radius={16}
            shadow
            enableHover
            onCardClick={onOpen}
            imageSizes={`${layout.cardSize}px`}
          />
        ) : (
          <div style={{ height: layout.height }} aria-hidden />
        )}
      </div>
    </div>
  )
}

export function GalleryGrid() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [active, setActive] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const items = useMemo(
    () => (filter === 'all' ? nailDesigns : nailDesigns.filter((d) => d.tags.includes(filter))),
    [filter],
  )

  const open = (i: number) => {
    setActive(i)
    dialogRef.current?.showModal()
  }
  const close = useCallback(() => dialogRef.current?.close(), [])
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [step])

  const current = active !== null ? items[active] : null

  return (
    <>
      {/* Thanh lọc nhanh */}
      {/* Micro-interactions + Accessible: chip 44px, aria-pressed, số lượng, thông báo kết quả */}
      <div role="group" aria-label="Lọc mẫu nail theo nhóm" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:px-0 lg:mb-10">
        {designFilters.map((f) => {
          const selected = filter === f.id
          const count = f.id === 'all' ? nailDesigns.length : nailDesigns.filter((d) => d.tags.includes(f.id)).length
          return (
            <button
              key={f.id}
              aria-pressed={selected}
              type="button"
              onClick={(e) => {
                setFilter(f.id)
                // Micro-interaction: chip vừa chọn cuộn vào giữa thanh lọc (mobile)
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              }}
              className={`press flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-control border px-5 text-[13px] font-medium tracking-[0.02em] ${selected ? 'border-ink bg-ink text-cream' : 'border-line bg-cream text-ink-soft hover:border-ink hover:text-ink'
                }`}
            >
              {f.label}
              <span className={`text-[11px] tabular-nums ${selected ? 'text-accent' : 'text-ink-soft'}`}>{count}</span>
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {`Đang hiển thị ${items.length} mẫu${filter === 'all' ? '' : ` nhóm ${tagLabel[filter]}`}`}
      </p>

      {/* Tab theo nhóm → BounceCards; tab "Tất cả" → lưới như cũ */}
      {filter !== 'all' ? <TagStack filter={filter} items={items} onOpen={open} /> : null}

      {/* Lưới mẫu (tab Tất cả) */}
      <ul hidden={filter !== 'all'} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
        {items.map((d, i) => (
          <li key={d.id} className="group flex flex-col" style={{ animation: 'lightbox-fade .5s ease-out both', animationDelay: `${i * 50}ms` }}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Phóng to ảnh mẫu ${d.name}`}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-media bg-cream-deep"
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                sizes="(min-width: 1240px) 280px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw"
                className="object-cover transition-transform duration-300 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
              <span className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-control bg-cream text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-lg:opacity-100">
                <ExpandIcon />
              </span>
              {filter === 'all' && i < 3 ? (
                <span className="absolute left-2.5 top-2.5 rounded-control bg-cream px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Mới
                </span>
              ) : null}
            </button>

            <div className="flex flex-1 flex-col pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-deep">{tagLabel[d.tags[0]]}</p>
              <h3 className="mt-1.5 flex-1 text-[15px] font-medium leading-snug text-ink md:text-[16px]">{nb(d.name)}</h3>
              <p className="mt-2 text-[14px] text-ink-soft">
                Giá từ <span className="font-medium text-ink">{formatVnd(d.priceFrom)}</span>
              </p>
              <button type="button" onClick={() => bookDesign(d)} className={`${buttonClass('outline', 'smTight')} mt-4 w-full`}>
                Đặt mẫu này
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-[13px] text-ink-soft">{nb('Giá tham khảo theo bảng giá, Eva báo giá chính xác khi tư vấn mẫu.')}</p>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        aria-label="Xem ảnh mẫu nail"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
        className="m-auto h-[100svh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-6" onClick={(e) => e.target === e.currentTarget && close()}>
            <div key={current.id} className="lightbox-fade relative h-[min(72svh,820px)] w-full max-w-[min(92vw,680px)]">
              <Image src={current.image} alt={current.alt} fill sizes="(min-width: 768px) 680px, 92vw" className="rounded-media object-contain" />
            </div>
            <div className="flex w-full max-w-[680px] flex-col items-center gap-4 text-center text-cream sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
                  {current.code} · {tagLabel[current.tags[0]]}
                </p>
                <p className="mt-1 font-serif text-[24px] leading-tight">{nb(current.name)}</p>
                <p className="mt-1 text-[14px] text-cream/75">Giá từ {formatVnd(current.priceFrom)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  close()
                  bookDesign(current)
                }}
                className={buttonClass('light')}
              >
                Đặt mẫu này
              </button>
            </div>
          </div>
        ) : null}

        <button type="button" onClick={close} aria-label="Đóng" className="absolute right-4 top-4 grid size-11 place-items-center press rounded-control bg-cream/10 text-cream hover:bg-cream/20">
          <CloseIcon />
        </button>
        {items.length > 1 ? (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Ảnh trước" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center press rounded-control bg-cream/10 text-cream hover:bg-cream/20 md:left-6">
              <ChevronIcon dir="left" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Ảnh tiếp theo" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center press rounded-control bg-cream/10 text-cream hover:bg-cream/20 md:right-6">
              <ChevronIcon />
            </button>
          </>
        ) : null}
      </dialog>
    </>
  )
}
