import Image from 'next/image'
import { business } from '@/data/business'

/** Logo chữ "Eva" + 2 ngôi sao. `inverted` dùng trên nền đen. */
export function Logo({ className = 'h-10 w-auto', inverted = false, preload = false }: { className?: string; inverted?: boolean; preload?: boolean }) {
  return (
    <Image
      src="/images/brand/logo-eva.png"
      alt={business.name}
      width={298}
      height={171}
      preload={preload}
      unoptimized
      className={`${className} ${inverted ? 'invert' : ''}`}
    />
  )
}
