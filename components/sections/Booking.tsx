import { business } from '@/data/business'
import { nb } from '@/lib/format'
import { mapEmbedSrc, telHref, zaloHref } from '@/lib/links'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { ArrowIcon, buttonClass } from '@/components/ui/ButtonLink'
import { ClockIcon, PhoneIcon, PinIcon, ShieldIcon, ZaloIcon } from '@/components/ui/Icons'
import { getBookingOptions } from '@/lib/cms/queries'
import { BookingForm } from './BookingForm'

export async function Booking() {
  const options = await getBookingOptions()
  return (
    <Section id="dat-lich" tone="deep" fadeFrom="cream" labelledBy="dat-lich-title">
      <span id="lien-he" className="absolute top-0" aria-hidden />
      <Container>
        <SectionHeading
          id="dat-lich-title"
          title="Đặt lịch hẹn tại Eva Nail Studio"
          description="Chọn dịch vụ hoặc mẫu, ngày và giờ. Tiệm xác nhận qua Zalo và nhắn nhắc lịch trước giờ hẹn."
        />

        <div className="grid gap-12 lg:grid-cols-[1.08fr_1fr]">
          {/* Cột trái: biểu mẫu */}
          <div data-reveal="up" className="rounded-card border border-line bg-cream p-6 sm:p-8 lg:p-10">
            <BookingForm options={options} />
          </div>

          {/* Cột phải: thông tin vận hành + bản đồ */}
          <div data-reveal="up" style={{ ['--reveal-delay' as string]: '120ms' }} className="flex flex-col">
            <ul className="divide-y divide-accent/20 border-y border-accent/20">
              <li className="flex gap-4 py-5">
                <PinIcon className="mt-0.5 size-5 shrink-0 text-accent-deep" />
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-soft">Địa chỉ</p>
                  <p className="mt-1.5 text-[15px] leading-[1.65] text-ink">{nb(business.address.full)}</p>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-accent-deep" />
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-soft">Giờ mở cửa</p>
                  <p className="mt-1.5 text-[15px] leading-[1.65] text-ink">
                    {business.hours.display} <span className="text-ink-soft">({nb(business.hours.note.toLowerCase())})</span>
                  </p>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <ShieldIcon className="mt-0.5 size-5 shrink-0 text-accent-deep" />
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-soft">Bảo hành</p>
                  <p className="mt-1.5 text-[15px] leading-[1.65] text-ink">{nb(business.warranty)}</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={telHref} className={buttonClass('solid', 'mdTight')}>
                <PhoneIcon className="size-4" /> {business.phoneDisplay}
              </a>
              <a href={zaloHref} target="_blank" rel="noopener noreferrer" className={buttonClass('outline', 'mdTight')}>
                <ZaloIcon className="size-4" /> Nhắn Zalo
              </a>
            </div>

            <div className="relative mt-6 min-h-[280px] flex-1 overflow-hidden rounded-card border border-line bg-cream lg:min-h-[300px]">
              {/* Nền chờ khi bản đồ chưa tải xong */}
              <div aria-hidden className="absolute inset-0 grid place-items-center text-center">
                <div className="flex flex-col items-center gap-3 text-ink-soft">
                  <span className="grid size-12 place-items-center rounded-media bg-cream-deep text-accent-deep">
                    <PinIcon />
                  </span>
                  <span className="text-[13px]">{nb('Đang tải bản đồ Gò Vấp…')}</span>
                </div>
              </div>
              <iframe
                title={`Bản đồ đường đến ${business.name}`}
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full grayscale-[35%] sepia-[12%]"
              />
            </div>
            <a
              href={business.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass('ghost')} mt-4 gap-1.5 self-start`}
            >
              Mở chỉ đường trên Google Maps <ArrowIcon className="size-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </Section>
  )
}
