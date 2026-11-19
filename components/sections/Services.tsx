import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { ComboRow } from './ComboRow'
import { PriceListDialog } from './PriceListDialog'
import { ServicesShowcase } from './ServicesShowcase'
import { getComboSection, getPriceList, getServiceSection } from '@/lib/cms/queries'
import { nb } from '@/lib/format'

export async function Services() {
  const [services, combo, priceList] = await Promise.all([getServiceSection(), getComboSection(), getPriceList()])
  return (
    <>
      {/* Dịch vụ & đào tạo: chồng thẻ cuộn dọc (sticky, theo scroll) — xem ServicesShowcase */}
      <ServicesShowcase {...services} />

      {/* Hot Combo — bố cục theo ảnh mẫu: nhãn nhỏ + tiêu đề 2 dòng (dòng 2 màu nhấn) · link bảng giá bên phải */}
      <Section id="combo" tone="deep" fadeFrom="cream" labelledBy="combo-title">
        <Container>
          <SectionHeading
            id="combo-title"
            eyebrow={combo.eyebrow}
            title={
              <>
                {combo.title}
                {combo.titleHighlight ? (
                  <>
                    <br />
                    <span className="text-accent-deep">{nb(combo.titleHighlight)}</span>
                  </>
                ) : null}
              </>
            }
            action={<PriceListDialog trigger="link" categories={priceList} />}
            className="border-b-0! pb-0! lg:items-end"
          />
          <ComboRow combos={combo.combos} />
        </Container>
      </Section>
    </>
  )
}
