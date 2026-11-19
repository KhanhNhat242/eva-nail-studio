import type { Metadata } from 'next'
import { AdminTheme } from '@/components/admin/AdminTheme'

export const metadata: Metadata = {
  title: { default: 'Quản trị – Eva Nail Studio', template: '%s – Quản trị Eva' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return <AdminTheme>{children}</AdminTheme>
}
