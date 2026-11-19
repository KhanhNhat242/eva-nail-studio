'use client'

import Image from 'next/image'
import { Button, Form, Input, InputNumber, Select, Switch } from 'antd'
import type { FieldDef, OptionSource } from '@/lib/cms/schema'

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
        placeholder="Chọn ảnh trong /public/images"
        value={value || undefined}
        onChange={(v) => onChange?.(v ?? null)}
        options={images.map((src) => ({ value: src, label: src.replace('/images/', '') }))}
      />
    </div>
  )
}

/** Một dòng / một mục: textarea, lưu thành mảng chuỗi */
const listProps = {
  getValueProps: (v: unknown) => ({ value: Array.isArray(v) ? v.join('\n') : '' }),
  normalize: (v: string) => v.split('\n'),
}

export function FieldInput({ field, sources, images, serverError }: { field: FieldDef; sources: OptionSources; images: string[]; serverError?: string }) {
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
          <Form.List name={name}>
            {(rows, { add, remove, move }) => (
              <div className="flex flex-col gap-2">
                {rows.map((row, i) => (
                  <div key={row.key} className="flex items-center gap-2">
                    <Form.Item name={[row.name, key]} noStyle rules={[{ required: true, message: 'Nhập tên' }]}>
                      <Input placeholder="Tên danh mục" />
                    </Form.Item>
                    <Button aria-label="Lên" disabled={i === 0} onClick={() => move(i, i - 1)}>
                      ↑
                    </Button>
                    <Button aria-label="Xuống" disabled={i === rows.length - 1} onClick={() => move(i, i + 1)}>
                      ↓
                    </Button>
                    <Button aria-label="Xóa danh mục" danger onClick={() => remove(row.name)}>
                      Xóa
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ [key]: '' })}>
                  Thêm danh mục
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
      )
    }
  }
}
