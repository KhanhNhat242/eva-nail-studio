type P = { className?: string }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function PhoneIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L14 12.5l4 1.5v3a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function ZaloIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 3.5c-5 0-9 3.4-9 7.7 0 2.4 1.3 4.6 3.3 6l-.6 3.3 3.5-1.9c.9.2 1.8.3 2.8.3 5 0 9-3.4 9-7.7s-4-7.7-9-7.7Z" />
      <path d="M8 9.5h3l-3 4h3M13.5 9.5v4M15.5 11.5a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 0 0-2.4 0Z" />
    </svg>
  )
}

export function CalendarIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function PinIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

export function ClockIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function ShieldIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 3 5 6v5.5c0 4.3 3 7.8 7 9.5 4-1.7 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function GiftIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5Zm0 0S13.5 4 16 4.5 17 8.5 12 8.5Z" />
    </svg>
  )
}

export function TagIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M3.5 11.5V4.5a1 1 0 0 1 1-1h7l8.5 8.5-8 8-8.5-8.5Z" />
      <circle cx="8" cy="8" r="1.4" />
    </svg>
  )
}

export function ImageIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4 17 5-4.5 3.5 3 3-2.5L20 17" />
    </svg>
  )
}

/** Lọ sơn gel — dịch vụ nail gel */
export function PolishIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M10 2.5h4v5h-4z" />
      <path d="M9 7.5h6l1.5 3.5v8.5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V11L9 7.5Z" />
      <path d="M7.5 14h9" />
    </svg>
  )
}

/** Lấp lánh — nail art / vẽ móng */
export function SparkleIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M10 3.5c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6Z" />
      <path d="M18 14.5c.3 1.8.9 2.4 2.5 2.7-1.6.3-2.2.9-2.5 2.6-.3-1.7-.9-2.3-2.5-2.6 1.6-.3 2.2-.9 2.5-2.7Z" />
    </svg>
  )
}

/** Giọt nước + sóng tóc — gội đầu thư giãn */
export function HairWashIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 3s-4 4.6-4 7.5a4 4 0 0 0 8 0C16 7.6 12 3 12 3Z" />
      <path d="M3.5 18c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.3 0 2.8-1.2 4.2 0 2.9 1.2 4.3 0" />
    </svg>
  )
}

/** Mắt và hàng mi — nối mi, uốn mi */
export function LashIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M3 13.5c2.5-3.3 5.5-5 9-5s6.5 1.7 9 5c-2.5 3-5.5 4.5-9 4.5s-6.5-1.5-9-4.5Z" />
      <circle cx="12" cy="13" r="2.4" />
      <path d="M7 8.8 5.8 6.5M12 8.5V5.8M17 8.8l1.2-2.3M4.2 11 2.5 9.6M19.8 11l1.7-1.4" />
    </svg>
  )
}

export function CheckIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function CloseIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function ChevronIcon({ className = 'size-5', dir = 'right' }: P & { dir?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} ${dir === 'left' ? 'rotate-180' : ''}`} aria-hidden {...stroke}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function ExpandIcon({ className = 'size-4' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </svg>
  )
}

export function FacebookIcon({ className = 'size-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z" />
    </svg>
  )
}

export function MenuIcon({ className = 'size-6' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M4 8h16M4 16h10" />
    </svg>
  )
}
