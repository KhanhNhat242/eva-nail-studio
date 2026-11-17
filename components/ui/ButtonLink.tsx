import type { ComponentProps, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'ghost' | 'light'

/** Minimalist Monochrome (làm ấm): bo 10px, không đổ bóng, đổi trạng thái 250ms, nhấn scale .98 */
const base =
  'press group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-sans font-medium tracking-[0.02em] disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  solid: 'bg-ink text-cream hover:bg-[#2b2724]',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-cream',
  ghost: 'min-h-11 text-ink underline decoration-accent underline-offset-[6px] hover:decoration-ink',
  light: 'bg-cream text-ink hover:bg-white',
}

/**
 * Kích thước nút — KHÔNG ghép thêm class h-/px-/text- từ bên ngoài (Tailwind không đảm bảo
 * thứ tự ghi đè). Cần cỡ khác thì thêm size mới ở đây. Mọi size cao ≥ 44px (Accessible & Ethical).
 */
const sizes = {
  md: 'h-12 px-6 text-[14px] md:text-[15px]',
  mdTight: 'h-12 px-3 text-[14px]',
  lg: 'h-[52px] px-7 text-[15px]',
  sm: 'h-11 px-5 text-[13px]',
  smTight: 'h-11 px-3 text-[13px]',
  /** Hero: 2 nút chia đôi màn hình nhỏ, nở dần theo breakpoint */
  hero: 'h-12 flex-1 px-2 text-[13px] min-[380px]:text-[13.5px] sm:flex-none sm:px-7 sm:text-[14px] md:h-14 md:px-8 md:text-[15px]',
} as const

export function buttonClass(variant: Variant = 'solid', size: keyof typeof sizes = 'md') {
  return `${base} ${variants[variant]} ${variant === 'ghost' ? 'h-auto px-0 text-[14px]' : sizes[size]}`
}

export function ButtonLink({
  variant = 'solid',
  size = 'md',
  className = '',
  children,
  ...props
}: ComponentProps<'a'> & { variant?: Variant; size?: keyof typeof sizes; children: ReactNode }) {
  return (
    <a className={`${buttonClass(variant, size)} ${className}`} {...props}>
      {children}
    </a>
  )
}

export function ArrowIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${className} transition-transform duration-200 group-hover:translate-x-0.5`} aria-hidden>
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
