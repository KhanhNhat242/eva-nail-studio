'use client'

import Image from 'next/image'
import type { FormListFieldData, FormListOperation } from 'antd'
import { useState } from 'react'
import { App, Button, Form, Input, InputNumber, Modal, Select, Switch, Table } from 'antd'
import type { DeletedPairView } from '@/lib/cms/admin-queries'
import type { FieldDef, OptionSource } from '@/lib/cms/schema'
import { PURGE_AFTER_DAYS } from '@/types/cms'
import { useRowReorder } from './useRowReorder'

export type Option = { value: string; label: string }
export type OptionSources = Record<OptionSource, Option[]>

const thousands = (v: number | string | undefined) => (v === undefined || v === null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
const parseNum = (v: string | undefined) => Number((v ?? '').replace(/\./g, '')) || 0

function Money(props: { value?: number | null; onChange?: (v: number | null) => void; placeholder?: string }) {
  return (
    <InputNumber<number>
      className="w-full!"
      min={0}
      step={1000}
      formatter={thousands}
      parser={parseNum}
      suffix="đ"
      placeholder={props.placeholder}
      value={props.value ?? null}
      onChange={(v) => props.onChange?.(v ?? null)}
    />
  )
}

type Range = { min: number; max: number | null } | null
type RangeMode = 'fixed' | 'range' | 'from' | 'contact'

/** Giá: cố định · khoảng · từ … · liên hệ — lưu dạng { min, max } | null */
function PriceRangeInput({ value, onChange }: { value?: Range; onChange?: (v: Range) => void }) {
  const mode: RangeMode = !value ? 'contact' : value.max === null ? 'from' : value.max === value.min ? 'fixed' : 'range'
  const setMode = (m: RangeMode) => {
    const min = value?.min ?? 0
    if (m === 'contact') onChange?.(null)
    else if (m === 'fixed') onChange?.({ min, max: min })
    else if (m === 'from') onChange?.({ min, max: null })
    else onChange?.({ min, max: Math.max(min, value?.max ?? min) })
  }
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select<RangeMode>
        className="sm:w-[170px]!"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'fixed', label: 'Giá cố định' },
          { value: 'range', label: 'Khoảng giá' },
          { value: 'from', label: 'Giá từ …' },
          { value: 'contact', label: 'Liên hệ tư vấn' },
        ]}
      />
      {value ? (
        <div className="flex flex-1 items-center gap-2">
          <Money
            value={value.min}
            placeholder={mode === 'range' ? 'Thấp nhất' : 'Giá'}
            onChange={(min) => onChange?.({ min: min ?? 0, max: mode === 'fixed' ? (min ?? 0) : value.max })}
          />
          {mode === 'range' ? (
            <>
              <span className="text-ink-soft">–</span>
              <Money value={value.max} placeholder="Cao nhất" onChange={(max) => onChange?.({ min: value.min, max: max ?? value.min })} />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function ImagePicker({ value, onChange, images, allowEmpty }: { value?: string | null; onChange?: (v: string | null) => void; images: string[]; allowEmpty?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-media border border-line bg-cream-deep">
        {value ? <Image src={value} alt="" fill sizes="64px" className="object-cover" /> : null}
      </div>
      <Select
        className="min-w-0 flex-1"
        showSearch={{ optionFilterProp: 'label' }}
        allowClear={allowEmpty}
        placeholder="Chọn ảnh trong thư viện"
        value={value || undefined}
        onChange={(v) => onChange?.(v ?? null)}
        options={images.map((src) => ({ value: src, label: src.startsWith('/uploads/') ? `Tải lên · ${src.slice(9)}` : src.replace('/images/', '') }))}
      />
    </div>
  )
}

/** Icon ≡ của nút kéo — giống cột "Thứ tự" trong bảng (EntityManager) */
export function DragIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** Danh sách danh mục (bảng giá / nhóm mẫu): kéo nút ≡ để đổi thứ tự, giống bảng bên dưới; phím ↑/↓ trên nút kéo cũng được. */
const fmtDateTime = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso)) : '—'

function SortablePairs({
  name,
  rows,
  ops,
  labelKey,
  deleted,
}: {
  name: string[]
  rows: FormListFieldData[]
  ops: FormListOperation
  labelKey: string
  deleted?: DeletedPairView[]
}) {
  const { containerRef, handleProps } = useRowReorder({ count: rows.length, onReorder: ops.move, rowSelector: '[data-reorder-row]' })
  const { message } = App.useApp()
  const [showDeleted, setShowDeleted] = useState(false)
  // Danh mục đã khôi phục vào form (chưa Lưu) thì không hiện trong danh sách đã xóa nữa
  const current = Form.useWatch(name, Form.useFormInstance()) as { id?: string }[] | undefined
  const currentIds = new Set((current ?? []).map((p) => p?.id))
  const restorable = (deleted ?? []).filter((d) => !currentIds.has(d.id))
  const restore = (d: DeletedPairView) => {
    ops.add({ id: d.id, [labelKey]: d.label })
    message.success(`Đã đưa "${d.label}" trở lại danh sách. Bấm Lưu để áp dụng.`)
  }
  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={row.key} data-reorder-row className="flex items-center gap-2">
            <button
              type="button"
              className="drag-handle shrink-0"
              disabled={rows.length < 2}
              aria-label={`Kéo để đổi thứ tự danh mục ${i + 1} (hoặc dùng phím mũi tên lên/xuống)`}
              title="Nhấn giữ rồi kéo lên/xuống để đổi thứ tự"
              {...handleProps(i, (dir) => ops.move(i, i + dir))}
            >
              <DragIcon />
            </button>
            <Form.Item name={[row.name, labelKey]} noStyle rules={[{ required: true, message: 'Nhập tên' }]}>
              <Input placeholder="Tên danh mục" />
            </Form.Item>
            <Button aria-label="Xóa danh mục" danger onClick={() => ops.remove(row.name)}>
              Xóa
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="dashed" className="flex-1" onClick={() => ops.add({ [labelKey]: '' })}>
          Thêm danh mục
        </Button>
        {deleted ? <Button onClick={() => setShowDeleted(true)}>Danh mục đã xóa ({restorable.length})</Button> : null}
      </div>
      {deleted ? (
        <Modal
          open={showDeleted}
          centered
          destroyOnHidden
          title={`Danh mục đã xóa (${restorable.length})`}
          onCancel={() => setShowDeleted(false)}
          footer={<Button onClick={() => setShowDeleted(false)}>Đóng</Button>}
          width={760}
        >
          <p className="mb-3 text-[13px] text-ink-soft">
            Danh mục đã bỏ khỏi danh sách (tính từ lúc bấm Lưu). Khôi phục được trong {PURGE_AFTER_DAYS} ngày; quá hạn sẽ bị xóa vĩnh viễn. Khôi phục đưa danh mục về
            cuối danh sách với mã cũ, bấm Lưu để áp dụng.
          </p>
          <Table<DeletedPairView>
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            dataSource={restorable}
            locale={{ emptyText: 'Chưa có danh mục nào bị xóa' }}
            columns={[
              { title: 'Tên danh mục', dataIndex: 'label' },
              { title: 'Xóa lúc', width: 150, render: (_, d) => <span className="tabular-nums">{fmtDateTime(d.deleted_at)}</span> },
              { title: 'Xóa vĩnh viễn lúc', width: 150, render: (_, d) => <span className="tabular-nums">{fmtDateTime(d.purge_at)}</span> },
              {
                title: '',
                width: 110,
                render: (_, d) => (
                  <Button size="small" onClick={() => restore(d)}>
                    Khôi phục
                  </Button>
                ),
              },
            ]}
          />
        </Modal>
      ) : null}
    </div>
  )
}

/** Một dòng / một mục: textarea, lưu thành mảng chuỗi */
const listProps = {
  getValueProps: (v: unknown) => ({ value: Array.isArray(v) ? v.join('\n') : '' }),
  normalize: (v: string) => v.split('\n'),
}

export function FieldInput({
  field,
  sources,
  images,
  serverError,
  deletedPairs,
}: {
  field: FieldDef
  sources: OptionSources
  images: string[]
  serverError?: string
  /** Trường 'pairs': danh mục đã xóa để khôi phục */
  deletedPairs?: DeletedPairView[]
}) {
  const name = field.name.split('.')
  const common = {
    name,
    label: field.label,
    extra: field.help,
    validateStatus: serverError ? ('error' as const) : undefined,
    help: serverError,
    rules: field.required && field.type !== 'bool' ? [{ required: true, message: `Vui lòng nhập ${field.label.toLowerCase()}.` }] : undefined,
  }

  switch (field.type) {
    case 'text':
      return (
        <Form.Item {...common}>
          <Input maxLength={field.max} />
        </Form.Item>
      )
    case 'textarea':
      return (
        <Form.Item {...common}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} maxLength={field.max} showCount />
        </Form.Item>
      )
    case 'money':
    case 'moneyNullable':
      return (
        <Form.Item {...common}>
          <Money />
        </Form.Item>
      )
    case 'int':
      return (
        <Form.Item {...common}>
          <InputNumber className="w-full!" min={1} precision={0} />
        </Form.Item>
      )
    case 'priceRange':
      return (
        <Form.Item {...common}>
          <PriceRangeInput />
        </Form.Item>
      )
    case 'list':
      return (
        <Form.Item {...common} {...listProps} extra={field.help ?? 'Mỗi dòng một mục.'}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
        </Form.Item>
      )
    case 'select':
    case 'multiselect':
      return (
        <Form.Item {...common}>
          <Select mode={field.type === 'multiselect' ? 'multiple' : undefined} options={field.options ? sources[field.options] : []} />
        </Form.Item>
      )
    case 'bool':
      return (
        <Form.Item {...common} valuePropName="checked">
          <Switch />
        </Form.Item>
      )
    case 'image':
    case 'imageNullable':
      return (
        <Form.Item {...common}>
          <ImagePicker images={images} allowEmpty={field.type === 'imageNullable'} />
        </Form.Item>
      )
    case 'pairs': {
      const key = field.pairLabelKey ?? 'label'
      return (
        <Form.Item label={field.label} extra={field.help} validateStatus={serverError ? 'error' : undefined} help={serverError}>
          <Form.List name={name}>{(rows, ops) => <SortablePairs name={name} rows={rows} ops={ops} labelKey={key} deleted={deletedPairs} />}</Form.List>
        </Form.Item>
      )
    }
  }
}
