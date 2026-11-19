import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { entities, entityBySlug } from '@/lib/cms/schema'
import { getEntityData, listImages } from '@/lib/cms/admin-queries'
import { EntityManager } from '@/components/admin/EntityManager'
import { PageHeader } from '@/components/admin/PageHeader'
import { contentActions } from '@/app/admin/actions'

export function generateStaticParams() {
  return entities.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: PageProps<'/admin/[slug]'>): Promise<Metadata> {
  const def = entityBySlug((await params).slug)
  return { title: def?.label ?? 'Không tìm thấy' }
}

export default async function EntityPage({ params }: PageProps<'/admin/[slug]'>) {
  await verifyAdmin()
  const def = entityBySlug((await params).slug)
  const actions = def && contentActions[def.slug]
  if (!def || !actions) notFound()
  const [{ section, items, visibleIds, optionSources }, images] = await Promise.all([getEntityData(def), listImages()])
  return (
    <>
      <PageHeader
        title={def.label}
        description="Bật Hiển thị để đưa lên trang chủ; mũi tên đổi thứ tự. Lưu xong trang chủ cập nhật ngay."
      />
      <EntityManager slug={def.slug} section={section} items={items} visibleIds={visibleIds} sources={optionSources} images={images} actions={actions} />
    </>
  )
}
