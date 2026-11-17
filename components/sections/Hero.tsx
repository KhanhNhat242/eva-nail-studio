import Image from 'next/image'
import { nb } from '@/lib/format'
import { ArrowIcon, buttonClass } from '@/components/ui/ButtonLink'
import { Star } from '@/components/ui/Star'
import FoldText, { type FoldTextProps } from '@/components/ui/FoldText'

/** Cấu hình FoldText theo người dùng gửi (17/11/2026) — trừ fontSize/fontWeight: kế thừa kiểu chữ hero */
const foldConfig: FoldTextProps = {
  foldStyle: 'paper',
  splitBy: 'char',
  hinge: 'top',
  trigger: 'scroll',
  foldAngle: 92,
  duration: 0.65,
  stagger: 0.045,
  staggerFrom: 'start',
  ease: 'power3.out',
  loopDelay: 1.4,
  hoverRefold: true,
  refoldRadius: 140,
  refoldAngle: 45,
  perspective: 700,
  creaseShading: 0.55,
}

/**
 * Ảnh lưới quanh mảng giấy — lấy ngẫu nhiên trong /public/images (người dùng yêu cầu), ưu tiên tông nude
 * + 1 ảnh đỏ rượu làm điểm nhấn như ảnh mẫu. Thứ tự: hàng trên trái → phải, rồi hàng dưới trái → phải.
 */
const collage = [
  { src: '/images/combos/son-thach-ngan.jpg', alt: 'Móng ngắn sơn gel thạch hồng nude', pos: '50% 55%' },
  { src: '/images/nails/ombre-ngoc-trai-tim.jpg', alt: 'Móng ombre nude ánh ngọc trai, trái tim đính đá', pos: '50% 50%' },
  { src: '/images/combos/up-son-thach.jpg', alt: 'Móng úp dài sơn thạch hồng nude', pos: '50% 40%' },
  { src: '/images/nails/mat-meo-do-ruou-van-bac.jpg', alt: 'Móng mắt mèo đỏ rượu phối vân bạc', pos: '50% 55%' },
  { src: '/images/nails/no-noi-mint-hong.jpg', alt: 'Móng hồng nhũ loang mint, nơ nổi và ngọc trai', pos: '50% 55%' },
  { src: '/images/nails/hero-hoa-noi-hong.jpg', alt: 'Móng ombre hồng thạch đính hoa nổi 3D', pos: '50% 62%' },
  { src: '/images/combos/mat-meo-bac.jpg', alt: 'Móng sơn mắt mèo ánh bạc', pos: '50% 50%' },
  { src: '/images/nails/ombre-xanh-bien.jpg', alt: 'Móng ombre xanh baby, vẽ cây dừa', pos: '50% 50%' },
] as const

/** Mép giấy xé (đa giác không đều) cho mảng chữ giữa và vệt màu loang phía sau */
const TORN =
  'polygon(3% 9%, 11% 4%, 20% 7%, 29% 2%, 38% 6%, 47% 1%, 56% 5%, 65% 2%, 74% 6%, 83% 3%, 92% 7%, 98% 13%, 96% 24%, 99% 35%, 95% 47%, 98% 58%, 96% 70%, 99% 81%, 94% 92%, 85% 97%, 76% 94%, 66% 98%, 56% 94%, 46% 99%, 36% 95%, 26% 98%, 16% 94%, 7% 97%, 2% 88%, 4% 77%, 1% 66%, 4% 54%, 1% 42%, 4% 31%, 1% 20%)'
const STAIN =
  'polygon(6% 2%, 22% 6%, 35% 0%, 52% 5%, 68% 1%, 84% 6%, 97% 2%, 100% 20%, 95% 38%, 100% 56%, 96% 75%, 100% 94%, 82% 99%, 63% 95%, 45% 100%, 27% 95%, 10% 99%, 0% 86%, 5% 66%, 0% 47%, 4% 28%, 0% 12%)'

function Photo({ i, className = '', priority = false }: { i: number; className?: string; priority?: boolean }) {
  const p = collage[i]
  return (
    <div className={`hero-unveil relative overflow-hidden rounded-media bg-cream-deep ${className}`} style={{ ['--d' as string]: `${80 + i * 70}ms` }}>
      <Image
        src={p.src}
        alt={p.alt}
        fill
        preload={priority}
        loading={priority ? undefined : "eager"}
        sizes="(min-width: 1024px) 26vw, 50vw"
        className="object-cover transition-transform duration-700 ease-[var(--ease-lux)] hover:scale-[1.04]"
        style={{ objectPosition: p.pos }}
      />
    </div>
  )
}

/**
 * Hero — bố cục theo ảnh mẫu người dùng gửi (17/11/2026): lưới ảnh nail bao quanh, mảng giấy xé kem ở giữa
 * (vệt màu loang blush phía sau), chữ "EVA / Nail Studio", divider ✦, tagline, icon nhỏ, 2 CTA.
 * Desktop: 8 ảnh (4 trên · 4 dưới), cao đúng 1 màn hình, header đè lên (trong suốt).
 * Mobile: 2 ảnh trên · mảng chữ · 2 ảnh dưới — vừa 1 màn hình.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      // Desktop: cao bằng màn hình nhưng tối đa 960px — màn lớn (2K/4K) không bị kéo cao theo
      className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden bg-linen pt-16 lg:block lg:h-[min(100svh,960px)] lg:min-h-[680px] lg:pt-0"
    >
      {/* Lưới ảnh — desktop 4×2, chạy phía sau header; rộng tối đa 1720px, căn giữa trên màn rất rộng */}
      <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-[1720px] -translate-x-1/2 grid-cols-[1fr_1.15fr_1.15fr_1fr] grid-rows-2 gap-2 p-2 lg:grid">
        {collage.map((_, i) => (
          <Photo key={i} i={i} priority={i < 4} />
        ))}
      </div>

      {/* Nền header hòa vào Hero: linen ở mép trên mờ dần xuống ảnh (logo + menu luôn rõ) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-44 bg-gradient-to-b from-linen via-linen/75 to-transparent lg:block" />

      {/* Mobile: 2 ảnh trên */}
      <div className="grid h-[22svh] min-h-[130px] grid-cols-2 gap-1.5 px-1.5 pt-1.5 lg:hidden">
        <Photo i={0} priority />
        <Photo i={3} priority />
      </div>

      {/* Mảng giấy xé ở giữa */}
      <div className="relative z-10 -my-6 flex flex-1 items-center justify-center px-3 lg:absolute lg:inset-0 lg:my-0 lg:px-0 lg:pt-10">
        <div className="hero-rise relative w-full max-w-[560px] lg:w-[46%] lg:max-w-[640px]" style={{ ['--d' as string]: '200ms' }}>
          {/* vệt màu loang phía sau — lớp ngoài làm mờ, lớp trong cắt hình (blur trên cùng phần tử clip-path không mềm mép) */}
          <span aria-hidden className="absolute -inset-x-[6%] -inset-y-[8%] opacity-85" style={{ filter: 'blur(6px)' }}>
            <span className="absolute inset-0 bg-blush" style={{ clipPath: STAIN }} />
          </span>
          {/* giấy */}
          <div className="paper-grain relative bg-cream px-6 py-9 text-center shadow-[0_30px_60px_-36px_rgba(20,20,20,0.45)] sm:px-10 lg:px-14 lg:py-14" style={{ clipPath: TORN }}>
            <Star className="mx-auto size-5 text-accent-deep lg:size-6" />
            {/*
              FoldText (React Bits) — từng ký tự gập giấy từ mép trên rồi mở ra; rê chuột gần → gập nhẹ lại.
              Cấu hình theo người dùng gửi; cỡ chữ & độ đậm kế thừa kiểu chữ hero (Cormorant không có weight 800).
            */}
            <h1 id="hero-title" className="mt-3 lg:mt-4">
              <span className="block pl-[0.18em] font-serif text-[clamp(56px,16vw,80px)] font-medium uppercase leading-[0.9] tracking-[0.18em] text-ink lg:text-[clamp(80px,7.4vw,128px)]">
                <FoldText {...foldConfig} text="Eva" tracking="0.18em" leading="0.9" />
              </span>
              <span className="-mt-[0.1em] block font-serif text-[clamp(30px,8.6vw,42px)] font-normal italic leading-none text-accent-deep lg:text-[clamp(42px,3.8vw,62px)]">
                <FoldText {...foldConfig} text="Nail Studio" tracking="0" leading="1" />
              </span>
            </h1>

            <div className="mx-auto mt-4 flex max-w-[360px] items-center gap-3 lg:mt-6" aria-hidden>
              <span className="h-px flex-1 bg-accent-deep/40" />
              <Star className="size-2.5 text-accent-deep" />
              <span className="h-px flex-1 bg-accent-deep/40" />
            </div>

            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft sm:text-[12px] lg:mt-4 lg:text-[13px]">
              {nb('Nail art · Hair wash · Lashes')}
            </p>

            <div className="mx-auto mt-5 flex w-full max-w-[420px] gap-2.5 lg:mt-8">
              <a href="#dat-lich" className={buttonClass('solid', 'hero')}>
                Đặt lịch làm đẹp
              </a>
              <a href="#khoa-hoc" className={buttonClass('outline', 'hero')}>
                Xem khóa học
                <ArrowIcon className="hidden size-4 sm:block" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: 2 ảnh dưới */}
      <div className="grid h-[20svh] min-h-[120px] grid-cols-2 gap-1.5 px-1.5 pb-1.5 lg:hidden">
        <Photo i={5} />
        <Photo i={7} />
      </div>
    </section>
  )
}
