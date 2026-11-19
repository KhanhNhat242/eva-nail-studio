'use server'

import { verifyAdmin } from '@/lib/auth/dal'
import { col } from '@/lib/db/mongo'
import { fail, invalidate } from '@/lib/cms/mutations'
import { IMAGE_PATH_RE } from '@/lib/cms/schema'
import { HERO_SLOTS, SECTION_ID, type ActionResult } from '@/types/cms'

/** Ảnh Hero — collection `hero_grid` (trang /admin/hero). */

export async function saveHeroGrid(input: Record<string, { img?: unknown; img_alt?: unknown; img_position?: unknown }>): Promise<ActionResult> {
  await verifyAdmin()
  const doc: Record<string, { img: string; img_alt: string; img_position: string }> = {}
  const errors: Record<string, string> = {}
  for (const k of HERO_SLOTS) {
    const s = input?.[k] ?? {}
    const img = typeof s.img === 'string' ? s.img.trim() : ''
    const alt = typeof s.img_alt === 'string' ? s.img_alt.trim().slice(0, 200) : ''
    const pos = typeof s.img_position === 'string' && /^\d{1,3}% \d{1,3}%$/.test(s.img_position.trim()) ? s.img_position.trim() : '50% 50%'
    if (!IMAGE_PATH_RE.test(img) || img.includes('..')) errors[k] = 'Chọn ảnh trong /images/…'
    else if (!alt) errors[k] = 'Nhập mô tả ảnh.'
    doc[k] = { img, img_alt: alt, img_position: pos }
  }
  if (Object.keys(errors).length) return fail('Kiểm tra lại các ô ảnh được đánh dấu.', errors)
  await (await col('hero_grid')).updateOne({ _id: SECTION_ID } as never, { $set: doc } as never, { upsert: true })
  invalidate('hero_grid')
  return { ok: true }
}
