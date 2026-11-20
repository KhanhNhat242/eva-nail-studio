'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { App, Button, Card, Form, Modal, Popconfirm, Switch, Table, Tag, Tooltip, type TableColumnsType } from 'antd'
import type { ContentActions } from '@/app/admin/actions'
import { entityBySlug, getPath, type FieldDef } from '@/lib/cms/schema'
import { formatPrice, formatVnd } from '@/lib/format'
import { PURGE_AFTER_DAYS, type ActionResult, type PriceRange } from '@/types/cms'
import type { DeletedPairView } from '@/lib/cms/admin-queries'
import { DragIcon, FieldInput, type OptionSources } from './FieldInput'
import { useRowReorder } from './useRowReorder'
import { useUnsavedChanges } from './UnsavedChanges'

type Doc = Record<string, unknown> & { id: string }

/** Lỗi trả về từ server → gắn vào đúng ô của form antd */
function applyErrors(form: ReturnType<typeof Form.useForm>[0], fields: FieldDef[], errors?: Record<string, string>) {
  form.setFields(fields.map((f) => ({ name: f.name.split('.'), errors: errors?.[f.name] ? [errors[f.name]] : [] })))
}

const fmtDate = (iso: unknown) =>
  typeof iso === 'string' ? new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso)) : '—'

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
  deletedPairs,
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
  /** Danh mục đã xóa của các trường 'pairs' trong phần tiêu đề (theo tên trường) */
  deletedPairs: Record<string, DeletedPairView[]>
}) {
  const def = entityBySlug(slug)!
  const router = useRouter()
  const { message } = App.useApp()
  const [pending, startTransition] = useTransition()
  const [sectionForm] = Form.useForm()
  const [itemForm] = Form.useForm()
  const [editing, setEditing] = useState<Doc | 'new' | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  // Thay đổi chưa lưu (form tiêu đề / form sửa item) — để hỏi "có muốn lưu không" khi rời trang
  const [sectionDirty, setSectionDirty] = useState(false)
  const [itemDirty, setItemDirty] = useState(false)

  /** Gọi action trong transition; trả về true khi thành công (để popup "Lưu và chuyển" biết có lưu được không). */
  const run = (fn: () => Promise<ActionResult>, ok: string, after?: () => void, onError?: (r: Extract<ActionResult, { ok: false }>) => void) =>
    new Promise<boolean>((resolve) =>
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
        resolve(r.ok)
      }),
    )

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

  const openEditor = (doc: Doc | 'new') => {
    setItemDirty(false)
    setEditing(doc)
  }
  const closeEditor = () => {
    setItemDirty(false)
    setEditing(null)
  }

  const submitItem = async (): Promise<boolean> => {
    try {
      await itemForm.validateFields()
    } catch {
      return false
    }
    const values = itemForm.getFieldsValue(true) as Record<string, unknown>
    const id = editing && editing !== 'new' ? editing.id : null
    return run(
      () => actions.saveItem(id, values),
      id ? 'Đã lưu' : full ? `Đã thêm ${def.itemLabel} (đang ẩn vì đã đủ ${max} mục hiển thị)` : `Đã thêm ${def.itemLabel} (hiện ở đầu danh sách)`,
      closeEditor,
      (r) => applyErrors(itemForm, def.fields, r.errors),
    )
  }

  const submitSection = async (): Promise<boolean> => {
    try {
      await sectionForm.validateFields()
    } catch {
      return false
    }
    const values = sectionForm.getFieldsValue(true) as Record<string, unknown>
    return run(() => actions.saveSection(values), 'Đã lưu phần tiêu đề', () => setSectionDirty(false), (r) =>
      applyErrors(sectionForm, def.sectionFields, r.errors),
    )
  }

  useUnsavedChanges(sectionDirty, submitSection)
  useUnsavedChanges(editing !== null && itemDirty, submitItem)

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
        <Form
          form={sectionForm}
          layout="vertical"
          initialValues={section ?? {}}
          requiredMark="optional"
          className="max-w-[720px]"
          onValuesChange={() => setSectionDirty(true)}
        >
          {def.sectionFields.map((f) => (
            <FieldInput key={f.name} field={f} sources={sources} images={images} deletedPairs={deletedPairs[f.name]} />
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
                    <DragIcon />
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
                  <Tooltip destroyOnHidden title={fullHint}>
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
                    destroyOnHidden
                    title={`Xóa ${def.itemLabel} này?`}
                    description={`Mục chuyển vào "Đã xóa", khôi phục được trong ${PURGE_AFTER_DAYS} ngày. Muốn tạm ẩn thì tắt Hiển thị.`}
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
        centered
        title={`${def.label} đã xóa (${deletedItems.length})`}
        onCancel={() => setShowDeleted(false)}
        footer={<Button onClick={() => setShowDeleted(false)}>Đóng</Button>}
        width={960}
      >
        <p className="mb-3 text-[13px] text-ink-soft">
          Các mục đã bấm Xóa. Khôi phục được trong {PURGE_AFTER_DAYS} ngày kể từ lúc xóa; quá hạn sẽ bị xóa vĩnh viễn. Mục khôi phục quay về danh sách ở trạng thái ẩn.
        </p>
        <Table<Doc>
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          scroll={{ x: 820 }}
          dataSource={deletedItems}
          loading={pending}
          columns={[
            ...infoColumns,
            { title: 'Xóa vĩnh viễn lúc', width: 150, render: (_, d) => <span className="tabular-nums">{fmtDate(d.purge_at)}</span> },
            {
              title: '',
              width: 110,
              render: (_, d) => (
                <Button size="small" onClick={() => run(() => actions.restoreItem(d.id), `Đã khôi phục (đang ẩn — bật Hiển thị nếu muốn đưa lên trang chủ)`)}>
                  Khôi phục
                </Button>
              ),
            },
          ]}
          locale={{ emptyText: 'Chưa có mục nào bị xóa' }}
        />
      </Modal>

      <Modal
        open={editing !== null}
        title={editing === 'new' ? `Thêm ${def.itemLabel}` : `Sửa ${def.itemLabel}`}
        onCancel={closeEditor}
        onOk={submitItem}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={pending}
        destroyOnHidden
        centered
        width={720}
        // Form dài (vd. Dịch vụ, Khóa học): chỉ phần thân cuộn dọc, tiêu đề + nút Lưu/Huỷ luôn hiện.
        // 220px ≈ tiêu đề + chân + đệm của modal; lề phải âm để thanh cuộn nằm sát mép, không ép ô nhập.
        styles={{ body: { maxHeight: 'calc(100dvh - 220px)', overflowY: 'auto', overscrollBehavior: 'contain', paddingRight: 12, marginRight: -12 } }}
      >
        <Form
          form={itemForm}
          layout="vertical"
          requiredMark="optional"
          preserve={false}
          initialValues={editing === null ? undefined : itemInitialValues(editing)}
          onValuesChange={() => setItemDirty(true)}
        >
          {def.fields.map((f) => (
            <FieldInput key={f.name} field={f} sources={sources} images={images} />
          ))}
        </Form>
      </Modal>
    </div>
  )
}
