import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { ComboRow } from './ComboRow'
import { PriceListDialog } from './PriceListDialog'
import { ServicesShowcase } from './ServicesShowcase'

export function Services() {
  return (
    <>
      {/* Dịch vụ & đào tạo: chồng thẻ cuộn dọc (sticky, theo scroll) — xem ServicesShowcase */}
      <ServicesShowcase />

      {/* Hot Combo — bố cục theo ảnh mẫu: nhãn nhỏ + tiêu đề 2 dòng (dòng 2 màu nhấn) · link bảng giá bên phải */}
      <Section id="combo" tone="deep" fadeFrom="cream" labelledBy="combo-title">
        <Container>
          <SectionHeading
            id="combo-title"
            eyebrow="Hot combo – All day"
            title={
              <>
                Combo trọn gói,
                <br />
                <span className="text-accent-deep">áp dụng cả&nbsp;ngày</span>
              </>
            }
            action={<PriceListDialog trigger="link" />}
            className="border-b-0! pb-0! lg:items-end"
          />
          <ComboRow />
        </Container>
      </Section>
    </>
  )
}
