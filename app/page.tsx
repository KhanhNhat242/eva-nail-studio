import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCtaBar } from '@/components/layout/MobileCtaBar'
import { RevealObserver } from '@/components/ui/RevealObserver'
import { StarDivider } from '@/components/ui/Section'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Gallery } from '@/components/sections/Gallery'
import { Courses } from '@/components/sections/Courses'
import { StudentsAndWhy } from '@/components/sections/StudentsAndWhy'
import { Booking } from '@/components/sections/Booking'
import { business } from '@/data/business'

/** JSON-LD NailSalon — dữ liệu lấy từ data/business.ts */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NailSalon',
  name: business.name,
  description: business.tagline,
  telephone: business.phoneIntl,
  image: '/images/nails/hero-hoa-noi-hong.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.ward,
    addressRegion: business.address.city,
    addressCountry: 'VN',
  },
  // TODO: thêm openingHoursSpecification khi khách xác nhận các ngày mở cửa trong tuần.
  sameAs: [business.links.facebook],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">
        <Hero />
        <StarDivider />
        <Services />
        <Gallery />
        <Courses />
        <StudentsAndWhy />
        <Booking />
      </main>
      <Footer />
      <MobileCtaBar />
      <RevealObserver />
    </>
  )
}
