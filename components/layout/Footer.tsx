import { business, navItems } from '@/data/business'
import { nb } from '@/lib/format'
import { telHref, zaloHref } from '@/lib/links'
import { Container } from '@/components/ui/Section'
import { FacebookIcon, ZaloIcon } from '@/components/ui/Icons'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pb-24 pt-16 text-cream/80 lg:pb-10 lg:pt-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo inverted className="h-14 w-auto" />
            <p className="mt-5 max-w-[300px] text-[14px] leading-[1.75] text-cream/70">{nb(business.tagline)}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={business.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Eva Nail Studio"
                className="press grid size-11 place-items-center rounded-control border border-cream/25 text-cream hover:border-accent hover:text-accent"
              >
                <FacebookIcon />
              </a>
              <a
                href={zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo Eva Nail Studio"
                className="press grid size-11 place-items-center rounded-control border border-cream/25 text-cream hover:border-accent hover:text-accent"
              >
                <ZaloIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent">Khám phá</h3>
            <ul className="mt-3 text-[14px]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-cream">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent">Ghé Eva</h3>
            <p className="mt-5 text-[14px] leading-[1.75]">{nb(business.address.full)}</p>
            <p className="mt-3 text-[14px] leading-[1.75]">
              {business.hours.display}
              <br />
              {nb(business.hours.note)}
            </p>
          </div>

          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent">Đặt lịch</h3>
            <a href={telHref} className="mt-5 block font-serif text-[28px] leading-none text-cream transition-colors hover:text-accent">
              {business.phoneDisplay}
            </a>
            <p className="mt-3 text-[14px] leading-[1.75]">{nb('Zalo / Booking / Hotline')}</p>
            <p className="mt-3 text-[14px] leading-[1.75]">{nb(business.warranty)}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[12px] tracking-wide text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {business.name} · {nb('Nail Art & Hair Wash & Lashes')}
          </p>
          <p className="flex items-center gap-2">
            {nb('Chuyên gel, không làm bột')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
