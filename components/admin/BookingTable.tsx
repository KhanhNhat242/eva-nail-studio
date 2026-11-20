'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { App, Button, Modal, Popconfirm, Segmented, Select, Table, type TableColumnsType } from 'antd'
import type { RecordActions } from '@/app/admin/actions'
import type { ActionResult } from '@/types/cms'
import { BOOKING_STATUSES, PURGE_AFTER_DAYS, bookingStatusLabel, type BookingStatus } from '@/types/cms'

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

export function BookingTable({
  actions,
  rows,
  deletedRows,
  choiceTitle,
  whenTitle,
}: {
  actions: RecordActions
  rows: BookingRowView[]
  /** Bản ghi đã xóa mềm — có thì hiện nút "Đã xóa" (Lịch đặt và Đăng ký học) */
  deletedRows?: (BookingRowView & { purge_at: string | null })[]
  choiceTitle: string
  whenTitle: string
}) {
  const router = useRouter()
  const { message } = App.useApp()
  const [pending, start] = useTransition()
  const [filter, setFilter] = useState<BookingStatus | 'all'>('new')
  const [showDeleted, setShowDeleted] = useState(false)
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

  /** Cột thông tin — dùng chung cho bảng chính và popup "Đã xóa". */
  const infoColumns: TableColumnsType<BookingRowView> = [
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
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<BookingStatus | 'all'>
          value={filter}
          onChange={setFilter}
          options={[
            ...BOOKING_STATUSES.map((s) => ({ value: s, label: `${bookingStatusLabel[s]} (${count(s)})` })),
            { value: 'all', label: `Tất cả (${rows.length})` },
          ]}
        />
        {deletedRows ? <Button onClick={() => setShowDeleted(true)}>Đã xóa ({deletedRows.length})</Button> : null}
      </div>
      <Table<BookingRowView>
        rowKey="id"
        size="middle"
        dataSource={data}
        loading={pending}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        locale={{ emptyText: 'Chưa có bản ghi nào' }}
        columns={[
          ...infoColumns,
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
              <Popconfirm destroyOnHidden title="Xóa bản ghi này?" description={`Bản ghi chuyển vào "Đã xóa", khôi phục được trong ${PURGE_AFTER_DAYS} ngày.`} okText="Xóa" cancelText="Huỷ" okButtonProps={{ danger: true }} onConfirm={() => run(() => actions.remove(r.id), 'Đã xóa')}>
                <Button size="small" danger>
                  Xóa
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />

      {deletedRows ? (
        <Modal
          open={showDeleted}
          centered
          title={`Bản ghi đã xóa (${deletedRows.length})`}
          onCancel={() => setShowDeleted(false)}
          footer={<Button onClick={() => setShowDeleted(false)}>Đóng</Button>}
          width={1200}
        >
          <p className="mb-3 text-[13px] text-ink-soft">
            Các bản ghi đã bấm Xóa. Khôi phục được trong {PURGE_AFTER_DAYS} ngày kể từ lúc xóa; quá hạn sẽ bị xóa vĩnh viễn.
          </p>
          <Table<BookingRowView & { purge_at: string | null }>
            rowKey="id"
            size="small"
            dataSource={deletedRows}
            scroll={{ x: 1120 }}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            locale={{ emptyText: 'Chưa có bản ghi nào bị xóa' }}
            loading={pending}
            columns={[
              ...(infoColumns as TableColumnsType<BookingRowView & { purge_at: string | null }>),
              { title: 'Trạng thái', width: 120, render: (_, r) => bookingStatusLabel[r.status] },
              { title: 'Xóa vĩnh viễn lúc', width: 140, render: (_, r) => (r.purge_at ? fmtCreated(r.purge_at) : '—') },
              ...(actions.restore
                ? [
                    {
                      title: '',
                      width: 110,
                      render: (_: unknown, r: BookingRowView) => (
                        <Button size="small" onClick={() => run(() => actions.restore!(r.id), 'Đã khôi phục')}>
                          Khôi phục
                        </Button>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Modal>
      ) : null}
    </div>
  )
}
