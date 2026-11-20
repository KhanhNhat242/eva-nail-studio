'use client'

import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { flushSync } from 'react-dom'

type DragState = {
  pointerId: number
  from: number
  to: number
  startY: number
  rows: HTMLElement[]
  tops: number[]
  heights: number[]
  /** Khoảng hở giữa 2 dòng liền nhau (bảng = 0; danh sách flex có gap > 0) */
  gap: number
  minDy: number
  maxDy: number
}

const DURATION = 200

/**
 * Kéo-thả đổi thứ tự `count` dòng đầu trong `containerRef` — không dùng thư viện.
 * Mặc định là dòng của antd Table; danh sách khác truyền `rowSelector` (vd. danh mục trong form section).
 * Nhấn giữ nút kéo → dòng đi theo con trỏ, các dòng khác trượt nhường chỗ; thả → dòng trượt vào chỗ mới
 * rồi `onReorder(from, to)` được gọi (đồng bộ, trước khi gỡ hiệu ứng để không bị giật).
 * Bàn phím: mũi tên lên/xuống trên nút kéo.
 */
export function useRowReorder({
  count,
  onReorder,
  rowSelector = 'tbody tr.ant-table-row',
}: {
  count: number
  onReorder: (from: number, to: number) => void
  rowSelector?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)

  const duration = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DURATION)

  function onPointerDown(e: PointerEvent<HTMLElement>, index: number) {
    if (e.button !== 0 || drag.current || index >= count) return
    const rows = Array.from(containerRef.current?.querySelectorAll<HTMLElement>(rowSelector) ?? []).slice(0, count)
    if (!rows[index]) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    const rects = rows.map((r) => r.getBoundingClientRect())
    const tops = rects.map((r) => r.top)
    const heights = rects.map((r) => r.height)
    drag.current = {
      pointerId: e.pointerId,
      from: index,
      to: index,
      startY: e.clientY,
      rows,
      tops,
      heights,
      gap: rows.length > 1 ? Math.max(0, tops[1] - (tops[0] + heights[0])) : 0,
      minDy: tops[0] - tops[index],
      maxDy: tops[count - 1] + heights[count - 1] - (tops[index] + heights[index]),
    }
    const ms = duration()
    rows.forEach((r, i) => {
      r.style.transition = i === index ? 'none' : `transform ${ms}ms ease`
      r.style.willChange = 'transform'
    })
    rows[index].dataset.dragging = ''
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    const dy = Math.min(d.maxDy, Math.max(d.minDy, e.clientY - d.startY))
    d.rows[d.from].style.transform = `translateY(${dy}px)`

    // Vị trí mới = dòng mà tâm dòng đang kéo đã vượt qua tâm của nó
    const center = d.tops[d.from] + d.heights[d.from] / 2 + dy
    let to = d.from
    for (let i = d.from + 1; i < count; i++) if (center > d.tops[i] + d.heights[i] / 2) to = i
    for (let i = d.from - 1; i >= 0; i--) if (center < d.tops[i] + d.heights[i] / 2) to = i
    d.to = to

    const h = d.heights[d.from] + d.gap
    d.rows.forEach((r, i) => {
      if (i === d.from) return
      const shift = d.from < i && i <= to ? -h : to <= i && i < d.from ? h : 0
      r.style.transform = shift ? `translateY(${shift}px)` : ''
    })
  }

  function finish(e: PointerEvent<HTMLElement>, cancelled: boolean) {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    const { from, rows, heights, gap } = d
    const to = cancelled ? from : d.to
    let offset = 0
    if (to > from) for (let i = from + 1; i <= to; i++) offset += heights[i] + gap
    else for (let i = to; i < from; i++) offset -= heights[i] + gap

    const ms = duration()
    const el = rows[from]
    el.style.transition = `transform ${ms}ms ease`
    el.style.transform = offset ? `translateY(${offset}px)` : ''
    if (cancelled) rows.forEach((r) => (r.style.transform = ''))

    window.setTimeout(() => {
      // Cập nhật thứ tự trong DOM trước, rồi mới gỡ transform → dòng đứng yên đúng chỗ, không nháy
      if (to !== from) flushSync(() => onReorder(from, to))
      for (const r of rows) {
        r.style.transition = 'none'
        r.style.transform = ''
        r.style.willChange = ''
        delete r.dataset.dragging
      }
      void el.offsetHeight
      for (const r of rows) r.style.transition = ''
      drag.current = null
    }, ms)
  }

  /** Props gắn vào nút kéo của dòng thứ `index` (trong danh sách đang hiển thị). */
  const handleProps = (index: number, move: (dir: -1 | 1) => void) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => onPointerDown(e, index),
    onPointerMove,
    onPointerUp: (e: PointerEvent<HTMLElement>) => finish(e, false),
    onPointerCancel: (e: PointerEvent<HTMLElement>) => finish(e, true),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowUp' && index > 0) {
        e.preventDefault()
        move(-1)
      } else if (e.key === 'ArrowDown' && index < count - 1) {
        e.preventDefault()
        move(1)
      }
    },
  })

  return { containerRef, handleProps }
}
