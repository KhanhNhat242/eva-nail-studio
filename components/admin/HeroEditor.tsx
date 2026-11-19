'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { App, Button, Input, Select } from 'antd'
import { saveHeroGrid } from '@/app/admin/actions/hero'
import { ImagePicker } from './FieldInput'

type Slot = { img: string; img_alt: string; img_position: string }
const SLOTS = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7', 'hero8'] as const

/** Vị trí ô trên website — mobile chỉ dùng 4 ô (1, 4 ở trên · 6, 8 ở dưới). */
const where: Record<(typeof SLOTS)[number], string> = {
  hero1: 'Hàng trên · ô 1 (cả mobile)',
  hero2: 'Hàng trên · ô 2',
  hero3: 'Hàng trên · ô 3',
  hero4: 'Hàng trên · ô 4 (cả mobile)',
  hero5: 'Hàng dưới · ô 1',
  hero6: 'Hàng dưới · ô 2 (cả mobile)',
  hero7: 'Hàng dưới · ô 3',
  hero8: 'Hàng dưới · ô 4 (cả mobile)',
}

const focusOptions = [
  ['50% 50%', 'Giữa'],
  ['50% 30%', 'Lệch lên'],
  ['50% 40%', 'Hơi lệch lên'],
  ['50% 55%', 'Hơi lệch xuống'],
  ['50% 62%', 'Lệch xuống'],
].map(([value, label]) => ({ value, label }))

export function HeroEditor({ initial, images }: { initial: Record<string, Slot>; images: string[] }) {
  const router = useRouter()
  const { message } = App.useApp()
  const [slots, setSlots] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, start] = useTransition()
  const set = (k: string, patch: Partial<Slot>) => setSlots((s) => ({ ...s, [k]: { ...s[k], ...patch } }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {SLOTS.map((k) => {
          const s = slots[k] ?? { img: '', img_alt: '', img_position: '50% 50%' }
          const focusOpts = focusOptions.some((o) => o.value === s.img_position) ? focusOptions : [...focusOptions, { value: s.img_position, label: s.img_position }]
          return (
            <div key={k} className={`flex flex-col gap-3 rounded-card border bg-white p-4 ${errors[k] ? 'border-[#b4533c]' : 'border-line'}`}>
              <p className="text-[13px] font-medium text-ink">{where[k]}</p>
              <ImagePicker images={images} value={s.img} onChange={(img) => set(k, { img: img ?? '' })} />
              <label className="flex flex-col gap-1 text-[12px] text-ink-soft">
                Mô tả ảnh (alt)
                <Input value={s.img_alt} maxLength={200} onChange={(e) => set(k, { img_alt: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-[12px] text-ink-soft">
                Điểm lấy nét
                <Select value={s.img_position} options={focusOpts} onChange={(v) => set(k, { img_position: v })} />
              </label>
              {errors[k] ? <p className="text-[13px] text-[#b4533c]">{errors[k]}</p> : null}
            </div>
          )
        })}
      </div>
      <div>
        <Button
          type="primary"
          size="large"
          loading={pending}
          onClick={() =>
            start(async () => {
              const r = await saveHeroGrid(slots)
              if (r.ok) {
                setErrors({})
                message.success('Đã lưu ảnh Hero')
                router.refresh()
              } else {
                setErrors(r.errors ?? {})
                message.error(r.error)
              }
            })
          }
        >
          Lưu ảnh Hero
        </Button>
      </div>
    </div>
  )
}
