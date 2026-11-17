import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { GalleryGrid } from './GalleryGrid'

export function Gallery() {
  return (
    <Section id="mau-nail" fadeFrom="deep" labelledBy="mau-nail-title">
      <Container>
        {/* "Vừa ra lò" là tên mục khách đang dùng trên Facebook — giữ nguyên làm tiêu đề. Căn giữa theo yêu cầu. */}
        <SectionHeading id="mau-nail-title" layout="center" title="Vừa ra lò: mẫu nail mới tại Eva" className="mb-8! lg:mb-10!" />
        <GalleryGrid />
      </Container>
    </Section>
  )
}
