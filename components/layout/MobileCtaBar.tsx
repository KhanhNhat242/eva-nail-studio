import { CalendarIcon, PhoneIcon, ZaloIcon } from '@/components/ui/Icons'
import { telHref, zaloHref } from '@/lib/links'

/** Thanh 3 nút ghim đáy màn hình điện thoại: Gọi · Zalo · Đặt lịch. */
export function MobileCtaBar() {
  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-[560px] grid-cols-[1fr_1fr_1.35fr] items-center gap-2 px-3">
        <a href={telHref} className="press flex h-12 flex-col items-center justify-center gap-0.5 rounded-control text-ink active:bg-cream-deep">
          <PhoneIcon className="size-5" />
          <span className="text-[11px] font-medium tracking-wide">Gọi điện</span>
        </a>
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          className="press flex h-12 flex-col items-center justify-center gap-0.5 rounded-control text-ink active:bg-cream-deep"
        >
          <ZaloIcon className="size-5" />
          <span className="text-[11px] font-medium tracking-wide">Zalo</span>
        </a>
        <a href="#dat-lich" className="press flex h-12 items-center justify-center gap-2 rounded-control bg-ink text-cream">
          <CalendarIcon className="size-[18px]" />
          <span className="text-[13px] font-medium tracking-wide">Đặt lịch</span>
        </a>
      </div>
    </nav>
  )
}
