import type { ReactNode } from 'react'

export function PageHeader({ title, description, extra }: { title: string; description?: ReactNode; extra?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div>
        <h1 className="font-serif text-[32px] font-medium leading-tight text-ink lg:text-[40px]">{title}</h1>
        {description ? <div className="mt-1.5 max-w-[720px] text-[14px] leading-[1.65] text-ink-soft">{description}</div> : null}
      </div>
      {extra}
    </div>
  )
}
