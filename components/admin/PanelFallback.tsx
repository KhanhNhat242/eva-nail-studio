import { Spin } from 'antd'

/**
 * Khung chờ cho phần dữ liệu của trang admin. Mỗi trang trong (panel) tự bọc phần gọi verifyAdmin() / đọc DB
 * trong <Suspense fallback={<PanelFallback />}>: Suspense ở layout không có tác dụng khi chuyển trang
 * giữa các trang cùng layout (docs: 02-guides/instant-navigation.md).
 */
export function PanelFallback() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spin />
    </div>
  )
}
