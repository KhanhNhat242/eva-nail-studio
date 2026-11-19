'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button, Drawer, Menu } from 'antd'
import { entities } from '@/lib/cms/schema'
import { logout } from '@/app/admin/actions/auth'

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
  const withLinks = items.map((it) =>
    'children' in it && it.children
      ? { ...it, children: it.children.map((c) => ({ key: c.key, label: <Link href={c.key} onClick={onNavigate}>{c.label}</Link> })) }
      : { key: it.key, label: <Link href={it.key} onClick={onNavigate}>{it.label}</Link> },
  )
  return <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={withLinks} className="border-0!" />
}

export function AdminNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Desktop: thanh bên cố định */}
      <aside className="sticky top-0 hidden h-svh w-[240px] shrink-0 flex-col overflow-y-auto bg-ink py-6 lg:flex">
        <Link href="/admin" className="px-7 font-serif text-[32px] font-medium leading-none text-cream">
          Eva <span className="text-[13px] font-normal tracking-[0.16em] text-accent">CMS</span>
        </Link>
        <div className="mt-6 flex-1">
          <NavMenu />
        </div>
        <div className="flex flex-col gap-2 px-6">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-cream/80 hover:text-cream">
            Xem website ↗
          </a>
          <form action={logout}>
            <button type="submit" className="min-h-11 text-[13px] text-cream/80 hover:text-cream">
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile: thanh trên + ngăn kéo */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-cream px-4 lg:hidden">
        <Link href="/admin" className="font-serif text-[26px] font-medium text-ink">
          Eva <span className="text-[12px] font-normal tracking-[0.16em] text-accent-deep">CMS</span>
        </Link>
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
          <form action={logout}>
            <button type="submit" className="min-h-11 text-[13px] text-cream/80">
              Đăng xuất
            </button>
          </form>
        </div>
      </Drawer>
    </>
  )
}
