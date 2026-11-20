'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { App, Button, Card, Form, Modal, Popconfirm, Switch, Table, Tag, Tooltip, type TableColumnsType } from 'antd'
import type { ContentActions } from '@/app/admin/actions'
import { entityBySlug, getPath, type FieldDef } from '@/lib/cms/schema'
import { formatPrice, formatVnd } from '@/lib/format'
import type { ActionResult, PriceRange } from '@/types/cms'
import { FieldInput, type OptionSources } from './FieldInput'
import { useRowReorder } from './useRowReorder'

type Doc = Record<string, unknown> & { id: string }

/** Lỗi trả về từ server → gắn vào đúng ô của form antd */
function applyErrors(form: ReturnType<typeof Form.useForm>[0], fields: FieldDef[], errors?: Record<string, string>) {
  form.setFields(fields.map((f) => ({ name: f.name.split('.'), errors: errors?.[f.name] ? [errors[f.name]] : [] })))
}

function priceText(doc: Doc): string {
  const p = doc.price
  if (typeof p === 'number') return formatVnd(p)
  if (p === null || (typeof p === 'object' && p !== null)) return formatPrice(p as PriceRange, typeof doc.price_label === 'string' ? doc.price_label : undefined)
  return ''
}

export function EntityManager({
  slug,
  section,
  items,
  visibleIds,
  sources,
  images,
  actions,
  deletedItems,
}: {
  slug: string
  section: Doc | null
  items: Doc[]
  visibleIds: string[]
  sources: OptionSources
  images: string[]
  /** Server Action riêng của khối này — `app/admin/actions/<slug>.ts` */
  actions: ContentActions
  /** Mục đã xóa mềm (is_deleted: true) — xem trong popup "Đã xóa" */
  deletedItems: Doc[]
}) {
  const def = entityBySlug(slug)!
  const router = useRouter()
  const { message } = App.useApp()
  const [pending, startTransition] = useTransition()
  const [sectionForm] = Form.useForm()
  const [itemForm] = Form.useForm()
  const [editing, setEditing] = useState<Doc | 'new' | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  const run = (fn: () => Promise<ActionResult>, ok: string, after?: () => void, onError?: (r: Extract<ActionResult, { ok: false }>) => void) =>
    startTransition(async () => {
      const r = await fn()
      if (r.ok) {
        message.success(ok)
        after?.()
        router.refresh()
      } else {
        message.error(r.error)
        onError?.(r)
      }
    })

  const visible = new Set(visibleIds)
  const setOrder = (ids: string[], ok: string) => run(() => actions.setVisibleOrder(ids), ok)

  // Thứ tự tạm (hiện ngay sau khi kéo-thả, trong lúc chờ server lưu). Gắn với mảng visibleIds lúc tạo:
  // server trả dữ liệu mới (router.refresh) → visibleIds là mảng khác → tự bỏ thứ tự tạm.
  const [draftOrder, setDraftOrder] = useState<{ base: string[]; ids: string[] } | null>(null)
  const order = draftOrder?.base === visibleIds ? draftOrder.ids : visibleIds
  const byId = new Map(items.map((d) => [d.id, d]))
  const rows = [...order.map((id) => byId.get(id)).filter((d): d is Doc => !!d), ...items.filter((d) => !visible.has(d.id))]

  // Giới hạn số mục hiển thị (schema.maxVisible) — server cũng chặn, ở đây chỉ để báo sớm
  const max = def.maxVisible
  const full = max !== undefined && order.length >= max
  const fullHint = max !== undefined ? `Đã đủ ${max} mục hiển thị. Tắt Hiển thị 1 mục khác trước.` : ''

  const reorder = (from: number, to: number) => {
    const ids = [...order]
    const [moved] = ids.splice(from, 1)
    ids.splice(to, 0, moved)
    setDraftOrder({ base: visibleIds, ids })
    run(() => actions.setVisibleOrder(ids), 'Đã đổi thứ tự', undefined, () => setDraftOrder(null))
  }
  const { containerRef, handleProps } = useRowReorder({ count: order.length, onReorder: reorder })
  const toggle = (id: string, on: boolean) =>
    setOrder(on ? [...order, id] : order.filter((x) => x !== id), on ? 'Đã hiện trên website' : 'Đã ẩn khỏi website')

  /**
   * Giá trị ban đầu của form sửa/thêm. Truyền qua `initialValues` (không gọi itemForm.setFieldsValue lúc mở):
   * Modal dùng `destroyOnHidden` nên Form chỉ mount khi Modal mở — mỗi lần mở là một Form mới đọc lại giá trị này.
   */
  const itemInitialValues = (doc: Doc | 'new'): Record<string, unknown> => {
    if (doc !== 'new') return doc
    // Giá trị mặc định cho mục mới
    const init: Record<string, unknown> = {}
    for (const f of def.fields) {
      if (f.type === 'bool') init[f.name] = false
      if (f.type === 'priceRange') init[f.name] = { min: 0, max: 0 }
      if (f.type === 'int') init[f.name] = 1080
      if (f.name === 'cta.label') init.cta = { label: 'Đặt lịch', href: '#dat-lich' }
    }
    return init
  }

  const openEditor = (doc: Doc | 'new') => setEditing(doc)

  const submitItem = async () => {
    try {
      await itemForm.validateFields()
    } catch {
      return
    }
    const values = itemForm.getFieldsValue(true) as Record<string, unknown>
    const id = editing && editing !== 'new' ? editing.id : null
    run(
      () => actions.saveItem(id, values),
      id ? 'Đã lưu' : full ? `Đã thêm ${def.itemLabel} (đang ẩn vì đã đủ ${max} mục hiển thị)` : `Đã thêm ${def.itemLabel} (hiện ở đầu danh sách)`,
      () => setEditing(null),
      (r) => applyErrors(itemForm, def.fields, r.errors),
    )
  }

  const submitSection = async () => {
    try {
      await sectionForm.validateFields()
    } catch {
      return
    }
    const values = sectionForm.getFieldsValue(true) as Record<string, unknown>
    run(() => actions.saveSection(values), 'Đã lưu phần tiêu đề', undefined, (r) => applyErrors(sectionForm, def.sectionFields, r.errors))
  }

  const imgField = def.fields.find((f) => f.type === 'image' || f.type === 'imageNullable')

  /** Cột Ảnh · Tên · Giá — dùng chung cho bảng chính và popup "Đã xóa". */
  const infoColumns: TableColumnsType<Doc> = [
    ...(imgField
      ? [
          {
            title: 'Ảnh',
            width: 76,
            render: (_: unknown, d: Doc) => {
              const src = getPath(d, imgField.name)
              return (
                <div className="relative size-12 overflow-hidden rounded-media bg-cream-deep">
                  {typeof src === 'string' && src ? <Image src={src} alt="" fill sizes="48px" className="object-cover" /> : null}
                </div>
              )
            },
          },
        ]
      : []),
    {
      title: 'Tên',
      render: (_, d) => (
        <div>
          <p className="font-medium text-ink">{String(getPath(d, def.titleField) ?? d.id)}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {d.price_confirmed === false ? <Tag color="gold">Giá ước lượng</Tag> : null}
            {d.placeholder === true ? <Tag color="gold">Ảnh minh họa</Tag> : null}
            {d.featured === true ? <Tag>Nổi bật</Tag> : null}
            {typeof d.category_name === 'string' ? <Tag>{d.category_name}</Tag> : null}
          </div>
        </div>
      ),
    },
    { title: 'Giá', width: 190, render: (_, d) => <span className="tabular-nums">{priceText(d)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      {def.note ? <p className="rounded-control border border-line bg-cream-deep px-4 py-3 text-[14px] text-ink">{def.note}</p> : null}

      <Card title="Tiêu đề & thông tin chung" size="small">
        <Form form={sectionForm} layout="vertical" initialValues={section ?? {}} requiredMark="optional" className="max-w-[720px]">
          {def.sectionFields.map((f) => (
            <FieldInput key={f.name} field={f} sources={sources} images={images} />
          ))}
          <Button type="primary" onClick={submitSection} loading={pending}>
            Lưu
          </Button>
        </Form>
      </Card>

      <Card
        title={`Danh sách ${def.label.toLowerCase()} (${order.length}${max !== undefined ? `/${max}` : ''} đang hiện · ${items.length} mục)`}
        size="small"
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setShowDeleted(true)}>Đã xóa ({deletedItems.length})</Button>
            <Button type="primary" onClick={() => openEditor('new')}>
              Thêm {def.itemLabel}
            </Button>
          </div>
        }
      >
        {max !== undefined ? (
          <p className="mb-3 text-[13px] text-ink-soft">
            Trang chủ hiển thị tối đa {max} mục. Muốn hiện thêm mục khác thì tắt Hiển thị 1 mục đang hiện trước. Mục mới thêm khi đã đủ sẽ ở trạng thái ẩn.
          </p>
        ) : null}
        <div ref={containerRef}>
        <Table<Doc>
          rowKey="id"
          size="middle"
          pagination={false}
          scroll={{ x: 720 }}
          dataSource={rows}
          loading={pending}
          columns={[
            {
              title: 'Thứ tự',
              width: 90,
              render: (_, d, index) =>
                visible.has(d.id) ? (
                  <button
                    type="button"
                    className="drag-handle"
                    disabled={pending || order.length < 2}
                    aria-label={`Kéo để đổi thứ tự ${String(getPath(d, def.titleField) ?? d.id)} (hoặc dùng phím mũi tên lên/xuống)`}
                    title="Nhấn giữ rồi kéo lên/xuống để đổi thứ tự"
                    {...handleProps(index, (dir) => reorder(index, index + dir))}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                    </svg>
                  </button>
                ) : (
                  <span className="text-[12px] text-ink-soft">Đang ẩn</span>
                ),
            },
            ...infoColumns,
            {
              title: 'Hiển thị',
              width: 90,
              render: (_, d) => {
                const on = visible.has(d.id)
                const locked = !on && full
                const sw = (
                  <Switch
                    checked={on}
                    disabled={locked}
                    onChange={(v) => toggle(d.id, v)}
                    aria-label={`Hiển thị ${String(getPath(d, def.titleField))}${locked ? ` (${fullHint})` : ''}`}
                  />
                )
                // Switch bị khóa không nhận sự kiện chuột → bọc span để Tooltip vẫn hiện
                return locked ? (
                  <Tooltip title={fullHint}>
                    <span className="inline-block">{sw}</span>
                  </Tooltip>
                ) : (
                  sw
                )
              },
            },
            {
              title: '',
              width: 150,
              render: (_, d) => (
                <div className="flex gap-2">
                  <Button size="small" onClick={() => openEditor(d)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title={`Xóa ${def.itemLabel} này?`}
                    description="Không hoàn tác được. Muốn tạm ẩn thì tắt Hiển thị."
                    okText="Xóa"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => run(() => actions.deleteItem(d.id), 'Đã xóa')}
                  >
                    <Button size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
        </div>
      </Card>

      <Modal
        open={showDeleted}
        title={`${def.label} đã xóa (${deletedItems.length})`}
        onCancel={() => setShowDeleted(false)}
        footer={<Button onClick={() => setShowDeleted(false)}>Đóng</Button>}
        width={760}
      >
        <p className="mb-3 text-[13px] text-ink-soft">Các mục đã bấm Xóa (is_deleted: true). Vẫn còn trong cơ sở dữ liệu nhưng không hiện trên website và CMS.</p>
        <Table<Doc>
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          scroll={{ x: 560 }}
          dataSource={deletedItems}
          columns={infoColumns}
          locale={{ emptyText: 'Chưa có mục nào bị xóa' }}
        />
      </Modal>

      <Modal
        open={editing !== null}
        title={editing === 'new' ? `Thêm ${def.itemLabel}` : `Sửa ${def.itemLabel}`}
        onCancel={() => setEditing(null)}
        onOk={submitItem}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={pending}
        destroyOnHidden
        width={720}
      >
        <Form
          form={itemForm}
          layout="vertical"
          requiredMark="optional"
          preserve={false}
          initialValues={editing === null ? undefined : itemInitialValues(editing)}
        >
          {def.fields.map((f) => (
            <FieldInput key={f.name} field={f} sources={sources} images={images} />
          ))}
        </Form>
      </Modal>
    </div>
  )
}
