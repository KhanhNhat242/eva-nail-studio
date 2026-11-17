import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Suspense } from 'react'
import { business } from '@/data/business'

const display = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const body = Be_Vietnam_Pro({
  variable: '--font-body',
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${business.name} – Nail gel, gội đầu, uốn mi & khóa học nail Gò Vấp`,
  description:
    'Eva Nail Studio Gò Vấp: chuyên nail gel, không làm bột, gội đầu thư giãn, nối mi – uốn mi và đào tạo nghề nail, gội thực tế. Đặt lịch qua Zalo 0789.784.718.',
  openGraph: {
    title: business.name,
    description: business.tagline,
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/images/nails/hero-hoa-noi-hong.jpg' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#fbf8f3',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Suspense fallback={null}>
          <AntdRegistry>{children}</AntdRegistry>
        </Suspense>
      </body>
    </html>
  )
}
