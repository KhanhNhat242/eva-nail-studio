import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { StudentWorksCarousel } from './StudentWorksCarousel'
import { WhyStory } from './WhyStory'
import { getAchievementSection, getWhyusSection } from '@/lib/cms/queries'

export async function StudentsAndWhy() {
  const [achievement, whyus] = await Promise.all([getAchievementSection(), getWhyusSection()])
  return (
    <>
      <Section id="thanh-qua" fadeFrom="deep" labelledBy="thanh-qua-title">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="thanh-qua-title"
              eyebrow={achievement.eyebrow}
              title={achievement.title}
              description={achievement.description}
              className="lg:mb-14"
            />
          </div>
          <StudentWorksCarousel works={achievement.works} />
        </Container>
      </Section>

      {/* Vì sao chọn Eva — carousel ảnh theo scroll + chữ đổi theo bên trái (xem WhyStory) */}
      <WhyStory eyebrow={whyus.eyebrow} usps={whyus.usps} />
    </>
  )
}
