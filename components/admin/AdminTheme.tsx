'use client'

import type { ReactNode } from 'react'
import { App, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'

/**
 * Theme antd cho CMS — map sang design token trong app/globals.css (không để lộ màu xanh mặc định).
 * ink #141414 · cream #FBF8F3 · cream-deep #F3ECE2 · line #EFE8DC · ink-soft #5B5550 · accent-deep #7D6440.
 */
export function AdminTheme({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#141414',
          colorInfo: '#7D6440',
          colorLink: '#7D6440',
          colorLinkHover: '#141414',
          colorText: '#141414',
          colorTextSecondary: '#5B5550',
          colorBorder: '#E4DACB',
          colorBorderSecondary: '#EFE8DC',
          colorBgLayout: '#FBF8F3',
          colorBgContainer: '#FFFFFF',
          colorFillAlter: '#F3ECE2',
          borderRadius: 10,
          borderRadiusLG: 16,
          fontFamily: 'var(--font-body), system-ui, sans-serif',
          controlHeight: 40,
        },
        components: {
          Layout: { siderBg: '#141414', headerBg: '#FBF8F3', bodyBg: '#FBF8F3' },
          Menu: {
            darkItemBg: '#141414',
            darkItemSelectedBg: '#F3ECE2',
            darkItemSelectedColor: '#141414',
            darkItemColor: '#EFE8DC',
            darkItemHoverColor: '#FFFFFF',
          },
          Table: { headerBg: '#F3ECE2' },
          Switch: { colorPrimary: '#7D6440', colorPrimaryHover: '#141414' },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}
