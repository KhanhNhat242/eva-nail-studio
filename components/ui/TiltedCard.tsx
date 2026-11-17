'use client'

/**
 * TiltedCard — thẻ nghiêng theo chuột + nhấn để lật (ý tưởng từ React Bits "Tilted Card").
 * Viết lại không dùng thư viện ngoài (rules: không thêm dependency), API theo bản người dùng gửi:
 * rotateAmplitude · scaleOnHover · glare · shadow · radius · introDelay · captionText · backContent.
 *
 * - Hai mặt nằm chung 1 ô grid → chiều cao thẻ = mặt cao hơn (không cần đo tay).
 * - Mặt trước là <button> (nhấn / Enter / Space để lật). Mặt sau có nút "Quay lại" riêng;
 *   bấm vào vùng trống mặt sau cũng lật lại (bỏ qua khi bấm link/nút bên trong).
 * - Chỉ nghiêng với chuột (pointer: fine); reduced-motion: không nghiêng, lật tức thì.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

type TiltedCardProps = {
  children: ReactNode
  backContent: ReactNode
  captionText: string
  rotateAmplitude?: number
  scaleOnHover?: number
  /** Độ mạnh vệt sáng 0–1 */
  glare?: number
  /** Độ đậm bóng đổ 0–1 (màu lấy từ biến --tc-shadow-color) */
  shadow?: number
  /** Bo góc px */
  radius?: number
  /** Trễ (ms) hiệu ứng xuất hiện khi cuộn tới */
  introDelay?: number
  className?: string
  style?: CSSProperties
  backLabel?: string
}

export default function TiltedCard({
  children,
  backContent,
  captionText,
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  glare = 0.5,
  shadow = 0.5,
  radius = 16,
  introDelay = 0,
  className = '',
  style,
  backLabel = 'Quay lại mặt trước',
}: TiltedCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLSpanElement>(null)
  const backBtnRef = useRef<HTMLButtonElement>(null)
  const frontBtnRef = useRef<HTMLButtonElement>(null)
  const [flipped, setFlipped] = useState(false)
  const [reduce, setReduce] = useState(false)
  const moved = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduce(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const onMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (reduce || e.pointerType !== 'mouse') return
      const el = tiltRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.transform = `rotateX(${(-(y - 0.5) * 2 * rotateAmplitude).toFixed(2)}deg) rotateY(${((x - 0.5) * 2 * rotateAmplitude).toFixed(2)}deg) scale(${scaleOnHover})`
      if (glareRef.current) {
        glareRef.current.style.opacity = '1'
        glareRef.current.style.background = `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255,255,255,${glare}), transparent 55%)`
      }
      moved.current = true
    },
    [reduce, rotateAmplitude, scaleOnHover, glare],
  )

  const onLeave = useCallback(() => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
    moved.current = false
  }, [])

  const flip = (next: boolean) => {
    setFlipped(next)
    // chuyển focus sang mặt đang hiện (bàn phím / trình đọc màn hình)
    requestAnimationFrame(() => (next ? backBtnRef.current : frontBtnRef.current)?.focus({ preventScroll: true }))
  }

  const faceStyle: CSSProperties = { gridArea: '1 / 1', borderRadius: radius, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

  return (
    <div
      data-reveal="up"
      className={`h-full [perspective:1000px] ${className}`}
      style={{ ['--reveal-delay' as string]: `${introDelay}ms`, ...style }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        ref={tiltRef}
        className="relative h-full [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
        style={{ borderRadius: radius, boxShadow: `0 28px 56px -26px color-mix(in srgb, var(--tc-shadow-color, rgba(20,20,20,0.35)) ${Math.round(shadow * 200)}%, transparent)` }}
      >
        <div
          className={`grid h-full [transform-style:preserve-3d] ${reduce ? '' : 'transition-transform duration-700 ease-[var(--ease-lux)]'}`}
          style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
        >
          {/* Mặt trước */}
          <div aria-hidden={flipped} inert={flipped} className="relative h-full overflow-hidden" style={faceStyle}>
            {children}
            {/* Nút phủ toàn thẻ (heading không được nằm trong <button>) */}
            <button
              ref={frontBtnRef}
              type="button"
              aria-label={captionText}
              onClick={() => flip(true)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-6px]"
              style={{ borderRadius: radius }}
            />
          </div>

          {/* Mặt sau */}
          <div
            aria-hidden={!flipped}
            inert={!flipped}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a,button')) return
              flip(false)
            }}
            className="relative h-full overflow-hidden"
            style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          >
            {backContent}
            <button
              ref={backBtnRef}
              type="button"
              onClick={() => flip(false)}
              aria-label={backLabel}
              // nền kem + chữ đen: luôn hiện rõ trên cả mặt sau nền sáng lẫn nền tối
              className="press absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-control border border-line bg-cream text-ink hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4.3h4.3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vệt sáng theo chuột */}
        <span
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 [transform:translateZ(1px)]"
          style={{ borderRadius: radius, mixBlendMode: 'soft-light' }}
        />
      </div>
    </div>
  )
}
