'use client'

import { useEffect, useState } from 'react'
import { navItems, business } from '@/data/business'
import { buttonClass } from '@/components/ui/ButtonLink'
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/Icons'
import { telHref } from '@/lib/links'
import { Logo } from './Logo'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // Đang trong vùng Hero → menu dồn phải, ẩn nút "Đặt lịch"; qua khỏi Hero → menu về giữa, hiện nút.
  const [inHero, setInHero] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero || !('IntersectionObserver' in window)) return
    const headerH = window.matchMedia('(min-width: 1024px)').matches ? 76 : 64
    const io = new IntersectionObserver(([entry]) => setInHero(entry.isIntersecting), {
      // coi như đã rời Hero khi phần còn lại của Hero nằm khuất sau header
      rootMargin: `-${headerH + 8}px 0px 0px 0px`,
      threshold: 0,
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      // Trong Hero: trong suốt, nằm đè lên nền blush của Hero. Ra khỏi Hero (hoặc mở menu mobile): nền kem + viền mảnh.
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-[var(--ease-soft)] ${
        inHero && !open ? 'border-transparent bg-transparent' : `bg-cream ${scrolled ? 'border-line' : 'border-transparent'}`
      }`}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[76px] lg:px-10">
        <a href="#top" aria-label={`${business.name} – về đầu trang`} className="relative z-10 shrink-0">
          <Logo className="h-9 w-auto lg:h-11" preload />
        </a>

        {/*
          Lớp định vị menu = đúng vùng nội dung (trừ padding). Trượt giữa 2 trạng thái bằng left + translateX:
          trong Hero: left 100% / -100% (sát phải) · ngoài Hero: left 50% / -50% (giữa).
        */}
        <div className="pointer-events-none absolute inset-y-0 left-5 right-5 hidden sm:left-8 sm:right-8 lg:left-10 lg:right-10 lg:block">
          <nav
            aria-label="Điều hướng chính"
            className="pointer-events-auto absolute top-1/2 w-max whitespace-nowrap transition-[left,transform] duration-700 ease-[var(--ease-lux)] motion-reduce:transition-none"
            style={{ left: inHero ? '100%' : '50%', transform: `translate(${inHero ? '-100%' : '-50%'}, -50%)` }}
          >
            {/* Trong Hero: nền kem đặc + viền mảnh để chữ không chìm vào ảnh phía sau; ngoài Hero: trong suốt */}
            <ul
              className={`flex items-center gap-8 rounded-control border px-6 transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none ${
                inHero ? 'border-line bg-cream shadow-[0_10px_30px_-18px_rgba(20,20,20,0.35)]' : 'border-transparent bg-transparent shadow-none'
              }`}
            >
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative inline-flex min-h-11 items-center text-[14px] tracking-[0.02em] text-ink transition-colors duration-200 hover:text-accent-deep after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
            </ul>
          </nav>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <a
            href="#dat-lich"
            aria-hidden={inHero}
            tabIndex={inHero ? -1 : undefined}
            className={`${buttonClass('solid', 'sm')} hidden transition-[opacity,translate,visibility] duration-500 ease-[var(--ease-lux)] motion-reduce:transition-none sm:inline-flex lg:h-11 lg:px-6 lg:text-[14px] ${
              inHero ? 'invisible translate-x-3 opacity-0' : 'visible translate-x-0 opacity-100'
            }`}
          >
            Đặt lịch
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            className="press -mr-2 grid size-11 place-items-center rounded-control text-ink lg:hidden"
          >
            {open ? <CloseIcon className="size-6" /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-[var(--ease-soft)] lg:hidden ${open ? 'max-h-[100svh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav aria-label="Menu di động" className="h-[calc(100svh-64px)] overflow-y-auto border-t border-line px-5 pb-28 pt-6 sm:px-8">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 font-serif text-[28px] leading-none text-ink"
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <a href="#dat-lich" onClick={() => setOpen(false)} className={buttonClass('solid')}>
              Đặt lịch làm đẹp
            </a>
            <a href={telHref} className={buttonClass('outline')}>
              <PhoneIcon className="size-4" /> {business.phoneDisplay}
            </a>
          </div>
          <p className="mt-8 flex items-center gap-2 text-[13px] text-ink-soft">

            {business.hours.display} · {business.hours.note}
          </p>
        </nav>
      </div>
    </header>
  )
}
