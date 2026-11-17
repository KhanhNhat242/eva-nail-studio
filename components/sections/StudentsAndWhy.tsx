import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { StudentWorksCarousel } from './StudentWorksCarousel'
import { WhyStory } from './WhyStory'

export function StudentsAndWhy() {
  return (
    <>
      <Section id="thanh-qua" fadeFrom="deep" labelledBy="thanh-qua-title">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="thanh-qua-title"
              eyebrow="Thành quả học viên"
              title="Từ những buổi học đầu tiên"
              description="Nơi lưu lại bài thực hành của học viên Eva qua từng khóa học. Ảnh thật đang được tiệm cập nhật."
              className="lg:mb-14"
            />
          </div>
          <StudentWorksCarousel />
        </Container>
      </Section>

      {/* Vì sao chọn Eva — carousel ảnh theo scroll + chữ đổi theo bên trái (xem WhyStory) */}
      <WhyStory />
    </>
  )
}
