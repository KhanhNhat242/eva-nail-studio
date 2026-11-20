import type { Metadata } from 'next'
import { Suspense } from 'react'
import { verifyAdmin } from '@/lib/auth/dal'
import { getSectionDoc, listImages } from '@/lib/cms/admin-queries'
import { HeroEditor } from '@/components/admin/HeroEditor'
import { PageHeader } from '@/components/admin/PageHeader'
import { PanelFallback } from '@/components/admin/PanelFallback'
import { findUsages, listUploads } from '@/lib/media'

export const metadata: Metadata = { title: 'Ảnh Hero' }

export default function HeroPage() {
  return (
    <>
      <PageHeader title="Ảnh Hero" description="8 ảnh quanh mảng giấy ở đầu trang chủ. Ưu tiên ảnh tông nude, không có chữ watermark. Có thể tải ảnh từ máy lên (JPG, PNG, WebP, AVIF · tối đa 5MB)." />
      <Suspense fallback={<PanelFallback />}>
        <HeroContent />
      </Suspense>
    </>
  )
}

async function HeroContent() {
  await verifyAdmin()
  const [doc, images, uploadUrls] = await Promise.all([getSectionDoc('hero_grid'), listImages(), listUploads()])
  const usages = await findUsages(uploadUrls)
  const uploads = uploadUrls.map((src) => ({ src, usedIn: usages.get(src) ?? [] }))
  const slots = Object.fromEntries(Object.entries(doc ?? {}).filter(([k]) => k !== 'id'))
  return <HeroEditor initial={slots as Record<string, { img: string; img_alt: string; img_position: string }>} images={images} uploads={uploads} />
}
