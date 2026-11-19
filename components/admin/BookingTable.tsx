'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { App, Button, Popconfirm, Segmented, Select, Table } from 'antd'
import type { RecordActions } from '@/app/admin/actions'
import type { ActionResult } from '@/types/cms'
import { BOOKING_STATUSES, bookingStatusLabel, type BookingStatus } from '@/types/cms'

export type BookingRowView = {
  id: string
  name: string
  phone_number: string
  choice: string
  when: string
  note: string | null
  status: BookingStatus
  created_at: string
}

const fmtCreated = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso))

export function BookingTable({ actions, rows, choiceTitle, whenTitle }: { actions: RecordActions; rows: BookingRowView[]; choiceTitle: string; whenTitle: string }) {
  const router = useRouter()
  const { message } = App.useApp()
  const [pending, start] = useTransition()
  const [filter, setFilter] = useState<BookingStatus | 'all'>('new')
  const data = useMemo(() => (filter === 'all' ? rows : rows.filter((r) => r.status === filter)), [rows, filter])
  const count = (s: BookingStatus) => rows.filter((r) => r.status === s).length

  const run = (fn: () => Promise<ActionResult>, ok: string) =>
    start(async () => {
      const r = await fn()
      if (r.ok) {
        message.success(ok)
        router.refresh()
      } else message.error(r.error)
    })

  return (
    <div className="flex flex-col gap-4">
      <Segmented<BookingStatus | 'all'>
        value={filter}
        onChange={setFilter}
        options={[
          ...BOOKING_STATUSES.map((s) => ({ value: s, label: `${bookingStatusLabel[s]} (${count(s)})` })),
          { value: 'all', label: `Tất cả (${rows.length})` },
        ]}
        className="self-start"
      />
      <Table<BookingRowView>
        rowKey="id"
        size="middle"
        dataSource={data}
        loading={pending}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        locale={{ emptyText: 'Chưa có bản ghi nào' }}
        columns={[
          { title: 'Gửi lúc', dataIndex: 'created_at', width: 130, render: fmtCreated },
          { title: 'Khách', render: (_, r) => <span className="font-medium">{r.name}</span> },
          {
            title: 'Liên hệ',
            width: 170,
            render: (_, r) => (
              <div className="flex flex-col">
                <a href={`tel:${r.phone_number}`} className="tabular-nums">
                  {r.phone_number}
                </a>
                <a href={`https://zalo.me/${r.phone_number.replace(/^\+84/, '0')}`} target="_blank" rel="noopener noreferrer" className="text-[12px]">
                  Nhắn Zalo ↗
                </a>
              </div>
            ),
          },
          { title: choiceTitle, dataIndex: 'choice' },
          { title: whenTitle, dataIndex: 'when', width: 150 },
          { title: 'Ghi chú', dataIndex: 'note', render: (n: string | null) => n ?? '' },
          {
            title: 'Trạng thái',
            width: 160,
            render: (_, r) => (
              <Select<BookingStatus>
                value={r.status}
                className="w-full"
                onChange={(s) => run(() => actions.setStatus(r.id, s), `Đã chuyển sang "${bookingStatusLabel[s]}"`)}
                options={BOOKING_STATUSES.map((s) => ({ value: s, label: bookingStatusLabel[s] }))}
              />
            ),
          },
          {
            title: '',
            width: 80,
            render: (_, r) => (
              <Popconfirm title="Xóa bản ghi này?" okText="Xóa" cancelText="Huỷ" okButtonProps={{ danger: true }} onConfirm={() => run(() => actions.remove(r.id), 'Đã xóa')}>
                <Button size="small" danger>
                  Xóa
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </div>
  )
}
