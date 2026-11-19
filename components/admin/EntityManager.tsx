'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { App, Button, Card, Form, Modal, Popconfirm, Switch, Table, Tag } from 'antd'
import type { ContentActions } from '@/app/admin/actions'
import { entityBySlug, getPath, type FieldDef } from '@/lib/cms/schema'
import { formatPrice, formatVnd } from '@/lib/format'
import type { ActionResult, PriceRange } from '@/types/cms'
import { FieldInput, type OptionSources } from './FieldInput'

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
}: {
  slug: string
  section: Doc | null
  items: Doc[]
  visibleIds: string[]
  sources: OptionSources
  images: string[]
  /** Server Action riêng của khối này — `app/admin/actions/<slug>.ts` */
  actions: ContentActions
}) {
  const def = entityBySlug(slug)!
  const router = useRouter()
  const { message } = App.useApp()
  const [pending, startTransition] = useTransition()
  const [sectionForm] = Form.useForm()
  const [itemForm] = Form.useForm()
  const [editing, setEditing] = useState<Doc | 'new' | null>(null)

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
  const move = (id: string, dir: -1 | 1) => {
    const ids = [...visibleIds]
    const i = ids.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setOrder(ids, 'Đã đổi thứ tự')
  }
  const toggle = (id: string, on: boolean) =>
    setOrder(on ? [...visibleIds, id] : visibleIds.filter((x) => x !== id), on ? 'Đã hiện trên website' : 'Đã ẩn khỏi website')

  const openEditor = (doc: Doc | 'new') => {
    itemForm.resetFields()
    if (doc !== 'new') itemForm.setFieldsValue(doc)
    else {
      // Giá trị mặc định cho mục mới
      const init: Record<string, unknown> = {}
      for (const f of def.fields) {
        if (f.type === 'bool') init[f.name] = false
        if (f.type === 'priceRange') init[f.name] = { min: 0, max: 0 }
        if (f.type === 'int') init[f.name] = 1080
        if (f.name === 'cta.label') init.cta = { label: 'Đặt lịch', href: '#dat-lich' }
      }
      itemForm.setFieldsValue(init)
    }
    setEditing(doc)
  }

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
      id ? 'Đã lưu' : `Đã thêm ${def.itemLabel} (hiện ở đầu danh sách)`,
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
        title={`Danh sách ${def.label.toLowerCase()} (${visibleIds.length} đang hiện / ${items.length})`}
        size="small"
        extra={
          <Button type="primary" onClick={() => openEditor('new')}>
            Thêm {def.itemLabel}
          </Button>
        }
      >
        <Table<Doc>
          rowKey="id"
          size="middle"
          pagination={false}
          scroll={{ x: 720 }}
          dataSource={items}
          loading={pending}
          columns={[
            {
              title: 'Thứ tự',
              width: 110,
              render: (_, d) =>
                visible.has(d.id) ? (
                  <div className="flex gap-1">
                    <Button size="small" aria-label="Lên" disabled={visibleIds[0] === d.id} onClick={() => move(d.id, -1)}>
                      ↑
                    </Button>
                    <Button size="small" aria-label="Xuống" disabled={visibleIds.at(-1) === d.id} onClick={() => move(d.id, 1)}>
                      ↓
                    </Button>
                  </div>
                ) : (
                  <span className="text-[12px] text-ink-soft">Đang ẩn</span>
                ),
            },
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
            {
              title: 'Hiển thị',
              width: 90,
              render: (_, d) => <Switch checked={visible.has(d.id)} onChange={(on) => toggle(d.id, on)} aria-label={`Hiển thị ${String(getPath(d, def.titleField))}`} />,
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
      </Card>

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
        <Form form={itemForm} layout="vertical" requiredMark="optional" preserve={false}>
          {def.fields.map((f) => (
            <FieldInput key={f.name} field={f} sources={sources} images={images} />
          ))}
        </Form>
      </Modal>
    </div>
  )
}
