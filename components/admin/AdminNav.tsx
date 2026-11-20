'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, type MouseEvent } from 'react'
import { Button, Drawer, Menu } from 'antd'
import { entities } from '@/lib/cms/schema'
import { logout } from '@/app/admin/actions/auth'
import { useLeaveGuard } from './UnsavedChanges'

const items = [
  { key: '/admin', label: 'Tổng quan' },
  {
    type: 'group' as const,
    label: 'Khách hàng',
    children: [
      { key: '/admin/dat-lich', label: 'Lịch đặt' },
      { key: '/admin/hoc-vien', label: 'Đăng ký học' },
    ],
  },
  {
    type: 'group' as const,
    label: 'Nội dung trang chủ',
    children: [{ key: '/admin/hero', label: 'Ảnh Hero' }, ...entities.map((e) => ({ key: `/admin/${e.slug}`, label: e.label }))],
  },
]

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const guard = useLeaveGuard()
  // Còn thay đổi chưa lưu → chặn link, hỏi trước rồi mới chuyển (components/admin/UnsavedChanges.tsx)
  const onClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.()
    if (href === pathname || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    guard(() => router.push(href))
  }
  const link = (href: string, label: string) => (
    <Link href={href} onClick={onClick(href)}>
      {label}
    </Link>
  )
  const withLinks = items.map((it) =>
    'children' in it && it.children
      ? { ...it, children: it.children.map((c) => ({ key: c.key, label: link(c.key, c.label) })) }
      : { key: it.key, label: link(it.key, it.label) },
  )
  return <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={withLinks} className="border-0!" />
}

/** Link về Tổng quan (logo) — cũng hỏi trước khi rời trang còn thay đổi chưa lưu. */
function HomeLink({ className, children }: { className: string; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const guard = useLeaveGuard()
  return (
    <Link
      href="/admin"
      className={className}
      onClick={(e) => {
        if (pathname === '/admin' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        guard(() => router.push('/admin'))
      }}
    >
      {children}
    </Link>
  )
}

/** Đăng xuất — hỏi trước nếu còn thay đổi chưa lưu. */
function LogoutForm({ className }: { className: string }) {
  const guard = useLeaveGuard()
  const formRef = useRef<HTMLFormElement>(null)
  const confirmed = useRef(false)
  return (
    <form
      ref={formRef}
      action={logout}
      onSubmit={(e) => {
        if (confirmed.current) return
        e.preventDefault()
        guard(() => {
          confirmed.current = true
          formRef.current?.requestSubmit()
        })
      }}
    >
      <button type="submit" className={className}>
        Đăng xuất
      </button>
    </form>
  )
}

export function AdminNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Desktop: thanh bên cố định */}
      <aside className="sticky top-0 hidden h-svh w-[240px] shrink-0 flex-col overflow-y-auto bg-ink py-6 lg:flex">
        <HomeLink className="px-7 font-serif text-[32px] font-medium leading-none text-cream">
          Eva <span className="text-[13px] font-normal tracking-[0.16em] text-accent">CMS</span>
        </HomeLink>
        <div className="mt-6 flex-1">
          <NavMenu />
        </div>
        <div className="flex flex-col gap-2 px-6">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-cream/80 hover:text-cream">
            Xem website ↗
          </a>
          <LogoutForm className="min-h-11 text-[13px] text-cream/80 hover:text-cream" />
        </div>
      </aside>

      {/* Mobile: thanh trên + ngăn kéo */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-cream px-4 lg:hidden">
        <HomeLink className="font-serif text-[26px] font-medium text-ink">
          Eva <span className="text-[12px] font-normal tracking-[0.16em] text-accent-deep">CMS</span>
        </HomeLink>
        <Button onClick={() => setOpen(true)} aria-label="Mở menu quản trị" className="min-h-11!">
          Menu
        </Button>
      </header>
      <Drawer open={open} onClose={() => setOpen(false)} placement="left" size={280} styles={{ body: { padding: 0, background: '#141414' } }} title="Eva CMS">
        <NavMenu onNavigate={() => setOpen(false)} />
        <div className="flex flex-col gap-2 px-6 py-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-cream/80">
            Xem website ↗
          </a>
          <LogoutForm className="min-h-11 text-[13px] text-cream/80" />
        </div>
      </Drawer>
    </>
  )
}
