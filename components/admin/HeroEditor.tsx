'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { App, Button, Card, Input, Popconfirm, Select, Tooltip } from 'antd'
import { deleteImage, saveHeroGrid, uploadImage } from '@/app/admin/actions/hero'
import { ImagePicker } from './FieldInput'

type Slot = { img: string; img_alt: string; img_position: string }
type Upload = { src: string; usedIn: string[] }
const SLOTS = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7', 'hero8'] as const

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'

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

export function HeroEditor({ initial, images, uploads }: { initial: Record<string, Slot>; images: string[]; uploads: Upload[] }) {
  const router = useRouter()
  const { message } = App.useApp()
  const [slots, setSlots] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, start] = useTransition()
  /** Ô đang tải ảnh lên (để hiện loading đúng nút) */
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const targetSlot = useRef<string | null>(null)
  const set = (k: string, patch: Partial<Slot>) => setSlots((s) => ({ ...s, [k]: { ...s[k], ...patch } }))

  const pickFile = (slot: string) => {
    targetSlot.current = slot
    fileInput.current?.click()
  }

  const onFile = (file: File | undefined) => {
    const slot = targetSlot.current
    if (fileInput.current) fileInput.current.value = ''
    if (!file || !slot) return
    if (file.size > MAX_BYTES) {
      message.error('Ảnh quá lớn (tối đa 5MB).')
      return
    }
    setUploadingSlot(slot)
    start(async () => {
      const fd = new FormData()
      fd.set('file', file)
      const r = await uploadImage(fd)
      setUploadingSlot(null)
      if (r.ok && r.id) {
        set(slot, { img: r.id })
        message.success('Đã tải ảnh lên. Nhập mô tả ảnh rồi bấm "Lưu ảnh Hero".')
        router.refresh()
      } else if (!r.ok) message.error(r.error)
    })
  }

  // Ảnh đang được chọn trong các ô (kể cả chưa lưu) → không cho xóa
  const inEditor = new Set(SLOTS.map((k) => slots[k]?.img).filter(Boolean))
  const usageOf = (u: Upload) => (inEditor.has(u.src) && !u.usedIn.includes('Ảnh Hero') ? [...u.usedIn, 'Ảnh Hero (chưa lưu)'] : u.usedIn)

  const remove = (src: string) =>
    start(async () => {
      const r = await deleteImage(src)
      if (r.ok) {
        message.success('Đã xóa ảnh')
        router.refresh()
      } else message.error(r.error)
    })

  return (
    <div className="flex flex-col gap-6">
      <input ref={fileInput} type="file" accept={ACCEPT} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {SLOTS.map((k) => {
          const s = slots[k] ?? { img: '', img_alt: '', img_position: '50% 50%' }
          const focusOpts = focusOptions.some((o) => o.value === s.img_position) ? focusOptions : [...focusOptions, { value: s.img_position, label: s.img_position }]
          return (
            <div key={k} className={`flex flex-col gap-3 rounded-card border bg-white p-4 ${errors[k] ? 'border-[#b4533c]' : 'border-line'}`}>
              <p className="text-[13px] font-medium text-ink">{where[k]}</p>
              <ImagePicker images={images} value={s.img} onChange={(img) => set(k, { img: img ?? '' })} />
              <Button onClick={() => pickFile(k)} loading={uploadingSlot === k} disabled={pending && uploadingSlot !== k}>
                Tải ảnh từ máy
              </Button>
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
          loading={pending && uploadingSlot === null}
          disabled={uploadingSlot !== null}
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

      <Card title={`Ảnh đã tải lên (${uploads.length})`} size="small">
        <p className="mb-4 text-[13px] text-ink-soft">
          Ảnh tải từ máy lên, chọn được ở mọi ô chọn ảnh trong CMS. Chỉ xóa được ảnh không còn dùng ở đâu. Ảnh có sẵn trong thư viện gốc không xóa từ đây.
        </p>
        {uploads.length === 0 ? (
          <p className="text-[14px] text-ink-soft">Chưa có ảnh nào được tải lên.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {uploads.map((u) => {
              const used = usageOf(u)
              const del = (
                <Button size="small" danger disabled={used.length > 0 || pending} className="w-full">
                  Xóa ảnh
                </Button>
              )
              return (
                <li key={u.src} className="flex flex-col gap-2">
                  <div className="relative aspect-square overflow-hidden rounded-media border border-line bg-cream-deep">
                    <Image src={u.src} alt="" fill sizes="(min-width: 1536px) 15vw, (min-width: 1024px) 22vw, 45vw" className="object-cover" />
                  </div>
                  <p className="truncate text-[12px] text-ink-soft" title={u.src}>
                    {used.length ? `Đang dùng: ${used.join(', ')}` : 'Chưa dùng'}
                  </p>
                  {used.length ? (
                    <Tooltip title="Đổi các nơi đang dùng sang ảnh khác trước khi xóa">
                      <span className="block">{del}</span>
                    </Tooltip>
                  ) : (
                    <Popconfirm
                      title="Xóa ảnh này?"
                      description="File bị xóa khỏi máy chủ, không hoàn tác được."
                      okText="Xóa"
                      cancelText="Huỷ"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => remove(u.src)}
                    >
                      {del}
                    </Popconfirm>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
