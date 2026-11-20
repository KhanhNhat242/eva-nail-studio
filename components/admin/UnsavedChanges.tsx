'use client'

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button, Modal } from 'antd'

/**
 * Cảnh báo thay đổi chưa lưu khi rời trang trong CMS.
 * - Trình soạn (EntityManager, HeroEditor…) gọi `useUnsavedChanges(dirty, save)` khi có thay đổi chưa lưu.
 * - Link trên thanh menu / nút Đăng xuất gọi `guard(proceed)` trước khi rời trang → hiện popup
 *   "Lưu và chuyển" · "Ở lại" (người dùng bỏ nút "Không lưu" 20/11/2026 — muốn bỏ thay đổi thì tải lại trang).
 * - Tải lại / đóng tab: hộp thoại mặc định của trình duyệt (beforeunload — không đổi được chữ).
 * Nút Back của trình duyệt không chặn được với App Router.
 */

type SaveFn = () => Promise<boolean>
type Ctx = {
  register: (id: string, save: SaveFn) => void
  unregister: (id: string) => void
  /** Chạy `proceed` ngay nếu không có thay đổi chưa lưu; nếu có thì hỏi trước. */
  guard: (proceed: () => void) => void
}

const UnsavedCtx = createContext<Ctx | null>(null)

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const entries = useRef(new Map<string, SaveFn>())
  const [pending, setPending] = useState<(() => void) | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (entries.current.size === 0) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  const register = useCallback((id: string, save: SaveFn) => void entries.current.set(id, save), [])
  const unregister = useCallback((id: string) => void entries.current.delete(id), [])
  const guard = useCallback((proceed: () => void) => {
    if (entries.current.size === 0) proceed()
    else setPending(() => proceed)
  }, [])
  const ctx = useMemo(() => ({ register, unregister, guard }), [register, unregister, guard])

  const close = () => setPending(null)
  const leave = () => {
    const go = pending
    setPending(null)
    go?.()
  }
  const saveAndLeave = async () => {
    setSaving(true)
    let ok = true
    for (const save of [...entries.current.values()]) {
      if (!(await save())) {
        ok = false
        break
      }
    }
    setSaving(false)
    // Lưu lỗi → ở lại trang để sửa (trình soạn đã báo lỗi tại ô)
    if (ok) leave()
    else close()
  }

  return (
    <UnsavedCtx value={ctx}>
      {children}
      <Modal
        open={pending !== null}
        title="Bạn có muốn lưu thay đổi không?"
        onCancel={close}
        centered
        mask={{ closable: !saving }}
        closable={!saving}
        destroyOnHidden
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={close} disabled={saving}>
              Ở lại
            </Button>
            <Button type="primary" onClick={saveAndLeave} loading={saving}>
              Lưu và chuyển
            </Button>
          </div>
        }
      >
        <p className="text-[14px] text-ink">Trang này có thay đổi chưa lưu. Nếu chuyển trang mà không lưu, các thay đổi sẽ bị mất.</p>
      </Modal>
    </UnsavedCtx>
  )
}

/** Đăng ký thay đổi chưa lưu của một trình soạn. `save` trả về true khi lưu thành công. */
export function useUnsavedChanges(dirty: boolean, save: SaveFn) {
  const ctx = useContext(UnsavedCtx)
  const id = useId()
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })
  useEffect(() => {
    if (!ctx || !dirty) return
    ctx.register(id, () => saveRef.current())
    return () => ctx.unregister(id)
  }, [ctx, id, dirty])
}

/** Hàm chặn rời trang cho link/nút điều hướng (ngoài provider thì cho đi luôn). */
export function useLeaveGuard(): (proceed: () => void) => void {
  const ctx = useContext(UnsavedCtx)
  return ctx?.guard ?? ((proceed) => proceed())
}
