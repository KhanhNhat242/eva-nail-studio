import type { Metadata } from 'next'
import { verifyAdmin } from '@/lib/auth/dal'
import { getSectionDoc, listImages } from '@/lib/cms/admin-queries'
import { HeroEditor } from '@/components/admin/HeroEditor'
import { PageHeader } from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Ảnh Hero' }

export default async function HeroPage() {
  await verifyAdmin()
  const [doc, images] = await Promise.all([getSectionDoc('hero_grid'), listImages()])
  const slots = Object.fromEntries(Object.entries(doc ?? {}).filter(([k]) => k !== 'id'))
  return (
    <>
      <PageHeader title="Ảnh Hero" description="8 ảnh quanh mảng giấy ở đầu trang chủ. Ưu tiên ảnh tông nude, không có chữ watermark." />
      <HeroEditor initial={slots as Record<string, { img: string; img_alt: string; img_position: string }>} images={images} />
    </>
  )
}
