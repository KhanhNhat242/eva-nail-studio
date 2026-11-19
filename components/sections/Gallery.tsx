import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { GalleryGrid } from './GalleryGrid'
import { getModelSection } from '@/lib/cms/queries'

export async function Gallery() {
  const { title, filters, designs } = await getModelSection()
  return (
    <Section id="mau-nail" fadeFrom="deep" labelledBy="mau-nail-title">
      <Container>
        {/* "Vừa ra lò" là tên mục khách đang dùng trên Facebook — giữ nguyên làm tiêu đề. Căn giữa theo yêu cầu. */}
        <SectionHeading id="mau-nail-title" layout="center" title={title} className="mb-8! lg:mb-10!" />
        <GalleryGrid filters={filters} designs={designs} />
      </Container>
    </Section>
  )
}
