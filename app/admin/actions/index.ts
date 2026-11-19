import type { ActionResult } from '@/types/cms'
import * as dichVu from './dich-vu'
import * as combo from './combo'
import * as bangGia from './bang-gia'
import * as mauNail from './mau-nail'
import * as khoaHoc from './khoa-hoc'
import * as thanhQua from './thanh-qua'
import * as viSao from './vi-sao'

/**
 * Bảng tra slug trang admin → bộ Server Action của khối nội dung đó.
 * Trang `/admin/[slug]` (server) lấy bộ action ở đây rồi truyền xuống `EntityManager` (client) qua props.
 * Thêm khối nội dung mới: tạo `app/admin/actions/<slug>.ts` (4 hàm như dưới) + thêm 1 dòng vào đây.
 */
export type ContentActions = {
  saveItem: (id: string | null, input: Record<string, unknown>) => Promise<ActionResult>
  deleteItem: (id: string) => Promise<ActionResult>
  setVisibleOrder: (ids: string[]) => Promise<ActionResult>
  saveSection: (input: Record<string, unknown>) => Promise<ActionResult>
}

/** Chép sang object thường — props truyền từ server sang client không nhận module namespace. */
const pick = (m: ContentActions): ContentActions => ({
  saveItem: m.saveItem,
  deleteItem: m.deleteItem,
  setVisibleOrder: m.setVisibleOrder,
  saveSection: m.saveSection,
})

export const contentActions: Record<string, ContentActions> = {
  'dich-vu': pick(dichVu),
  combo: pick(combo),
  'bang-gia': pick(bangGia),
  'mau-nail': pick(mauNail),
  'khoa-hoc': pick(khoaHoc),
  'thanh-qua': pick(thanhQua),
  'vi-sao': pick(viSao),
}

/** Bộ action cho bảng Lịch đặt / Đăng ký học. */
export type RecordActions = {
  setStatus: (id: string, status: string) => Promise<ActionResult>
  remove: (id: string) => Promise<ActionResult>
}
