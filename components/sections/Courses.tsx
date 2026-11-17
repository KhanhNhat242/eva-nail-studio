import { classShifts, courseIntro, courseSlogan, extraCourse, mainCourses } from '@/data/courses'
import { formatVnd, nb } from '@/lib/format'
import { zaloHref } from '@/lib/links'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { buttonClass } from '@/components/ui/ButtonLink'
import Image from 'next/image'
import TiltedCard from '@/components/ui/TiltedCard'
import { CourseRegisterButton } from './CourseRegisterButton'

export function Courses() {
  const [s1, s2, s3] = courseSlogan.split(' – ')
  return (
    <Section id="khoa-hoc" tone="deep" fadeFrom="cream" spacious labelledBy="khoa-hoc-title">
      {/* Conversion-Optimized (21): so sánh rõ ràng · KHÔNG đếm ngược / "chỉ còn X suất" / tháng ưu đãi */}
      <Container className="relative">
        <SectionHeading
          id="khoa-hoc-title"
          eyebrow="Đào tạo nghề nail & gội"
          layout="center"
          title={
            <>
              {s1} – {s2} –<br className="hidden sm:block" /> {nb(s3)}
            </>
          }
          description={courseIntro}
        />

        <div data-reveal="up" className="-mt-4 mb-12 flex flex-wrap items-center justify-center gap-2 lg:-mt-6 lg:mb-14">
          <span className="mr-1 text-[12px] font-medium uppercase tracking-[0.22em] text-ink-soft">3 ca học</span>
          {classShifts.map((s) => (
            <span key={s} className="rounded-control border border-line bg-cream px-4 py-2 text-[13px] tabular-nums text-ink">
              {s}
            </span>
          ))}
        </div>

        {/*
          3 thẻ TiltedCard — nghiêng theo chuột, nhấn để lật (theo mẫu người dùng gửi).
          Mặt trước: ảnh nền + cấp độ + tên khóa + giá. Mặt sau: chi tiết đầy đủ + nút đăng ký.
          Gói A–Z (featured): viền vàng đồng; 3 thẻ thẳng hàng (người dùng yêu cầu, không nhô). Không yếu tố gây áp lực (Conversion-Optimized).
        */}
        <div className="mx-auto grid max-w-[440px] items-stretch gap-8 md:max-w-none md:grid-cols-3 md:gap-6 lg:gap-8">
          {mainCourses.map((c, i) => {
            const featured = !!c.featured
            return (
              <div key={c.id} data-course-card className="min-h-[420px]">
                <TiltedCard
                  captionText={`${c.name}, ${formatVnd(c.price)} – nhấn để xem chi tiết khóa học`}
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  glare={0.5}
                  shadow={0.5}
                  radius={16}
                  introDelay={i * 120}
                  style={{ ['--tc-shadow-color' as string]: 'rgba(20, 20, 20, 0.35)' }}
                  backContent={
                    /* Mặt sau: chi tiết khóa (gọn — theo yêu cầu bỏ cấp độ, dòng "tiết kiệm", ô quà tặng) */
                    <div
                      className={`flex h-full flex-col rounded-card px-6 py-6 lg:px-7 ${
                        featured ? 'border-[1.5px] border-accent bg-ink text-cream' : 'border border-line bg-cream text-ink'
                      }`}
                    >
                      {featured ? (
                        <p className="mb-2 pr-10 text-[12px] font-medium uppercase tracking-[0.18em] text-accent">Lộ trình đầy đủ nhất</p>
                      ) : null}
                      <h3 className="pr-10 font-serif text-[26px] font-medium leading-[1.1]">{nb(c.name)}</h3>
                      <p className={`mt-2.5 text-[14px] leading-[1.6] ${featured ? 'text-cream/80' : 'text-ink-soft'}`}>{nb(c.summary)}</p>

                      <div className={`mt-4 border-y py-4 ${featured ? 'border-cream/15' : 'border-line'}`}>
                        {c.originalPrice ? (
                          <p className={`text-[14px] line-through decoration-1 ${featured ? 'text-cream/65' : 'text-ink-soft'}`}>
                            <span className="sr-only">Giá gốc </span>
                            {formatVnd(c.originalPrice)}
                          </p>
                        ) : null}
                        <p className={`mt-1 font-serif text-[36px] leading-none ${featured ? 'text-accent' : 'text-ink'}`}>{formatVnd(c.price)}</p>
                      </div>

                      <ul className="mt-4 flex-1 space-y-2">
                        {c.highlights.map((h) => (
                          <li key={h} className={`flex gap-3 text-[14px] leading-snug ${featured ? 'text-cream/90' : 'text-ink'}`}>
                            <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                            <span>{nb(h)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 [&>button]:w-full">
                        <CourseRegisterButton courseId={c.id} courseName={c.name} variant={featured ? 'light' : 'solid'} compact />
                      </div>
                    </div>
                  }
                >
                  {/* Mặt trước: ảnh nền + tên khóa + giá */}
                  <div className={`absolute inset-0 overflow-hidden rounded-card ${featured ? 'ring-[1.5px] ring-accent ring-inset' : ''}`}>
                    <Image src={c.cover} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    {/* Lớp tối dần ở đáy để chữ kem đủ tương phản */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
                      {featured ? (
                        <p className="mb-2 text-[11.5px] font-medium uppercase tracking-[0.18em] text-accent">Lộ trình đầy đủ nhất</p>
                      ) : null}
                      <h3 className="font-serif text-[32px] font-medium leading-[1.08]">{nb(c.name)}</h3>
                      {c.originalPrice ? (
                        <p className="mt-3 text-[14px] text-cream/75 line-through decoration-1">
                          <span className="sr-only">Giá gốc </span>
                          {formatVnd(c.originalPrice)}
                        </p>
                      ) : null}
                      <p className={`${c.originalPrice ? 'mt-1' : 'mt-3'} font-serif text-[40px] leading-none`}>{formatVnd(c.price)}</p>
                      <p className="mt-3 flex items-center gap-2 text-[12.5px] text-cream/85">
                        <span aria-hidden className="inline-block h-px w-5 bg-accent" />
                        Nhấn để xem chi tiết khóa học
                      </p>
                    </div>
                  </div>
                </TiltedCard>
              </div>
            )
          })}
        </div>

        {/* Khóa bổ trợ */}
        <div
          data-reveal="up"
          className="mt-12 grid items-center gap-6 rounded-card border border-line bg-cream px-7 py-7 md:grid-cols-[auto_1fr_auto] md:gap-10 lg:mt-16 lg:px-10"
        >
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent-deep">Khóa bổ trợ</p>
            <h3 className="mt-1 font-serif text-[26px] font-medium leading-tight text-ink">{nb(extraCourse.name)}</h3>
          </div>
          <p className="text-[15px] leading-[1.7] text-ink-soft">{nb(extraCourse.summary)}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-end lg:flex-row lg:items-center">
            <p className="font-serif text-[32px] leading-none text-ink">{formatVnd(extraCourse.price)}</p>
            <CourseRegisterButton courseId={extraCourse.id} courseName={extraCourse.name} variant="solid" compact />
          </div>
        </div>

        <p data-reveal="up" className="mt-10 text-center text-[14px] text-ink-soft">
          {nb('Chưa chắc khóa nào hợp với mình?')}{' '}
          <a href={zaloHref} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost')}>
            {nb('Nhắn Zalo để Eva tư vấn lộ trình')}
          </a>
        </p>
      </Container>
    </Section>
  )
}
