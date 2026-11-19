<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Mọi nội dung bên dưới do dự án tự quản lý; `next dev` chỉ ghi đè phần nằm giữa các marker phía trên. -->

# Quy tắc dự án — Eva Nail Studio (Phiếu Dev 69)

Website demo cho **Eva Nail Studio** (tiệm nail + gội + mi, kiêm đào tạo nghề nail/gội tại Gò Vấp, TP.HCM).
Mọi thay đổi — code, nội dung, thiết kế, tính năng mới — **bắt buộc tuân theo các quy tắc dưới đây**.

## 1. Nguồn sự thật

1. [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) là nguồn sự thật duy nhất về phạm vi, nội dung, giá, giờ, địa chỉ, sitemap. **Đọc nó trước khi làm bất kỳ việc gì.**
2. Không thêm tính năng/trang/nội dung nằm ngoài tài liệu. Nếu người dùng yêu cầu điều mới hoặc khác tài liệu → **cập nhật `docs/REQUIREMENTS.md` trước** (ghi rõ nguồn: ai yêu cầu, ngày), rồi mới code.
3. Thông tin mâu thuẫn hoặc thiếu → không tự đoán. Ghi vào mục 13 "Việc còn mở" của tài liệu và hỏi lại người dùng; trong demo dùng placeholder có đánh dấu.
4. **Không bịa dữ liệu kinh doanh**: giá, khóa học, ca học, số điện thoại, đánh giá khách hàng, số liệu ("1000+ học viên"…), chứng nhận, ảnh "thành quả học viên". Chỉ dùng dữ liệu trong tài liệu. Dữ liệu ước lượng phải có cờ (`priceConfirmed: false`, `placeholder: true`).

## 2. Nội dung bắt buộc nhất quán

- Tên: **Eva Nail Studio**. Tagline: **Eva Nail n More – Nail Art & Hair Wash & Lashes**.
- Hotline/Zalo: **0789.784.718** · Giờ: **9:30 – 20:30, nhận khách cuối 19:30** · Địa chỉ: **120/61/29 Đường số 59, Phường An Hội Tây (P.14, Gò Vấp cũ), TP. Hồ Chí Minh** · Bảo hành nail 5–7 ngày.
- **Chuyên gel, không làm bột** — tuyệt đối không nhắc dịch vụ bột/acrylic.
- Các giá trị trên chỉ được khai báo **một lần** trong file dữ liệu (xem mục 4) và import ra dùng; cấm gõ lặp lại trong component.
- Ngôn ngữ giao diện: **chỉ tiếng Việt có dấu**, giọng văn nhẹ nhàng, sang, nữ tính, xưng "Eva" – gọi khách "bạn". Không trộn tiếng Anh trừ tên kỹ thuật quen thuộc (French, Ombre, Builder Gel – BIAB, Dual Form…).
- Định dạng tiền thống nhất: `129.000đ` (dấu chấm phân cách nghìn); khoảng giá `250.000đ – 300.000đ`; giá gốc gạch ngang cạnh giá ưu đãi. Dùng một hàm format chung.
- Không hard-code tên tháng khuyến mãi ("Đăng ký trong tháng 9"…).

## 3. Thiết kế

- **Hệ style bắt buộc: `docs/REQUIREMENTS.md` mục 2.4** — Minimalist Monochrome (làm ấm) + Exaggerated Minimalism (chỉ hero/tiêu đề) + các khu đặc thù theo yêu cầu người dùng: Dịch vụ `ServicesShowcase`, Combo `ComboRow`, Vì sao `WhyGallery` + Conversion-Optimized (bảng khóa học, không urgency) + Micro-interactions + Accessible & Ethical. Không đưa vào các style "tránh dùng". Dùng skill `ui-ux-pro-max` để tra thông số khi thêm thành phần mới.
- Màu: chỉ dùng design token trong `app/globals.css` (`@theme`): `cream #FBF8F3`, `cream-deep #F3ECE2`, `line #EFE8DC`, `ink #141414`, `ink-soft #5B5550`, `accent #B89B72`, `accent-deep #7D6440`, `linen #EDE6DF` (nền Hero), `blush #EBD6CB` (nền thẻ combo khi active; trên nền này `accent-deep` chỉ cho chữ lớn/icon). Không dùng mã màu tuỳ tiện trong class/JSX; muốn màu mới → thêm token + ghi vào tài liệu mục 2.3.
- **Tương phản**: `text-accent` chỉ được làm chữ khi nền là `ink`; chữ vàng đồng trên nền sáng luôn là `text-accent-deep`. Không làm mờ chữ bằng opacity (`text-ink/80`, `text-ink-soft/70`…) trên nền sáng. Màu mới phải đạt ≥ 4.5:1 trước khi dùng.
- Bo góc chỉ dùng token `rounded-control` (10px) · `rounded-media` (12px) · `rounded-card` (16px); `rounded-full` chỉ cho chấm nhỏ. Ô Bento dùng class `bento-tile`; nút/ô bấm dùng `press`. Transition trạng thái 200–300ms.
- Vùng chạm ≥ 44×44px cho mọi nút, link dạng nút, chip, icon bấm được; khoảng cách giữa các vùng chạm ≥ 8px.
- Phong cách **tối giản, sang, nữ tính**: nền kem, chữ đen, nhiều khoảng trắng, ảnh lớn, bo góc nhẹ, accent rất tiết chế. Không gradient sặc sỡ, không teal/nâu của poster, không emoji trong giao diện, không hoạ tiết bay lượn/lấp lánh (✦ chỉ làm divider, bullet, nhãn).
- **Chống "AI slop"** (đã soát bằng skill `ui-taste`, 17/11/2026) — KHÔNG đưa lại các thói quen sau:
  - Nhãn phụ in hoa trên mọi section, nhất là khi chỉ lặp lại tiêu đề (hiện chỉ Khóa học có nhãn phụ).
  - Đánh số 01/02/03… khi không có thứ tự thật (menu, thẻ combo, ô USP, khung chờ).
  - Chữ nghiêng màu nhấn trong tiêu đề section — chỉ Hero được dùng một lần.
  - Tiêu đề + mô tả căn giữa ở mọi section — mặc định `SectionHeading layout="split"`; `center` chỉ cho bảng so sánh khóa học và khu "Vừa ra lò" (người dùng yêu cầu 17/11/2026).
  - Thẻ chỉ số/huy hiệu nổi đè lên ảnh hero; kính mờ (backdrop-blur) cho header/thanh CTA.
  - Ô thẻ chữ dồn đáy để trống phía trên; khung chờ trang trí giả nội dung (số lớn, hình vẽ giả).
  - Câu tự nhận không có dữ liệu ("được yêu thích nhất", "hàng nghìn học viên"…) và link có nhãn sai đích.
  - Hiệu ứng trượt lớn giống hệt nhau ở mọi khối (giữ reveal 16px / 0.6s).
- Luôn theme sáng; không bật dark mode.
- Font: serif hiển thị cho tiêu đề + sans cho nội dung, load bằng `next/font` với **subset `vietnamese`**. Kiểm tra chữ có dấu (ặ, ẫ, ữ, ộ…) hiển thị đúng.
- Motif cho phép: ngôi sao 4 cánh ✦ từ logo. Animation dùng sẵn hệ `data-reveal`, `.reveal-zoom`, `.deco-float`, `.lightbox-fade` trong `globals.css`; luôn tôn trọng `prefers-reduced-motion`.
- **Mobile-first**: thiết kế ở 360–390px trước, rồi mở rộng. Không cuộn ngang. Có thanh CTA cố định trên mobile (Gọi · Zalo · Đặt lịch).
- Mỗi trang phải có ít nhất một CTA dẫn tới **Đặt lịch** hoặc **Đăng ký/Tư vấn khóa học**.

## 4. Kiến trúc & code

- Stack cố định: **Next.js 16.4.6 (App Router) · React 19.3 · TypeScript · Tailwind CSS 4 · Ant Design 6**. Không thêm thư viện mới khi chưa hỏi người dùng.
- Next.js bản này khác dữ liệu huấn luyện: **đọc tài liệu trong `node_modules/next/dist/docs/` trước khi dùng API** (đặc biệt: `01-getting-started/05-server-and-client-components.md`, `08-caching.md`, `12-images.md`, `14-metadata-and-og-images.md`, `02-guides/forms.md`, `02-guides/server-actions.md`). `next.config.ts` đang bật `cacheComponents` và `partialPrefetching` — tuân thủ quy tắc của các tính năng này (dữ liệu động nằm trong `<Suspense>`…).
- Mặc định **Server Component**; chỉ thêm `'use client'` cho phần thật sự cần tương tác (lọc, lightbox, form state, menu mobile) và giữ chúng nhỏ, ở lá của cây component.
- Cấu trúc thư mục:
  - `app/<route>/page.tsx` — route theo sitemap trong tài liệu mục 9 (slug tiếng Việt không dấu, kebab-case: `dich-vu`, `mau-nail`, `khoa-hoc`, `thanh-qua-hoc-vien`, `dat-lich`, `lien-he`).
  - `components/` — component dùng chung (`layout/`, `ui/`, `sections/`…), tên file PascalCase.
  - `data/` — dữ liệu tĩnh có kiểu: `business.ts` (thông tin tiệm), `services.ts`, `courses.ts`, `nail-designs.ts`, `student-works.ts`. **Mọi nội dung kinh doanh nằm ở đây**, không nằm trong JSX.
  - `lib/` — tiện ích (format tiền, validate SĐT, link Zalo/tel), `types/` nếu cần.
- Thêm mẫu nail mới = thêm 1 object vào `data/nail-designs.ts` (+ ảnh). Không cần sửa component. Giữ nguyên nguyên tắc này cho mọi danh sách.
- Form (đặt lịch, đăng ký học): Server Action + validate phía server (SĐT VN: `^(0|\+84)(3|5|7|8|9)\d{8}$`), thông báo lỗi tiếng Việt. Chưa có backend → để `// TODO(integration)` rõ ràng; **không** hiển thị thông báo giả như "đã gửi nhắc lịch qua Zalo".
- Ant Design: dùng cho form/input/date-time picker/modal khi tiện; chỉnh theme qua `ConfigProvider` theo token màu ở mục 3, locale `vi_VN`. Bố cục/spacing dùng Tailwind. Không để style mặc định xanh của antd lộ ra.
- TypeScript strict, không `any`. Chạy `npm run lint` và `npm run build` không lỗi trước khi báo xong.
- **Không rớt 1 chữ xuống dòng cuối** (desktop/tablet/mobile): mọi chuỗi chữ hiển thị đi qua `nb()` trong `lib/format.ts`; chữ viết thẳng trong JSX thì dùng `&nbsp;` giữa hai từ cuối. CSS `text-wrap: pretty/balance` đã bật sẵn trong `globals.css`.
- Khối dựng sẵn — dùng lại, không viết lại: `Section` (đệm dọc chuẩn, `fadeFrom` để chuyển màu nền mượt), `SectionHeading`, `Eyebrow`, `StarDivider`, `Container` trong `components/ui/Section.tsx`; `buttonClass(variant, size)` cho mọi nút. **Không ghép thêm class `h-`/`px-`/`text-` vào `buttonClass`** — cần cỡ khác thì thêm size mới trong `ButtonLink.tsx`.
- Khoảng cách: section 56–64px (mobile) → 96px (desktop), khu vực ưu tiên (Khóa học) 112px; tiêu đề cách lưới 48–56px; khoảng cách thẻ 24px (mobile) / 32px (desktop); khung tối đa 1240px, lề 20 → 40px.
- CSS tự viết trong `globals.css` phải nằm trong `@layer base` hoặc `@layer components` nếu nó đặt thuộc tính mà class tiện ích cũng đặt (CSS ngoài layer sẽ đè Tailwind).

## 5. Ảnh & tài sản

- Luôn dùng `next/image` với `alt` tiếng Việt mô tả thật nội dung ảnh và `sizes` phù hợp; chỉ ảnh màn hình đầu mới dùng ưu tiên tải.
- Tài sản mới đặt tên **ASCII, kebab-case, không dấu, không khoảng trắng** (ví dụ `public/images/nails/mat-meo-01.jpg`). Thư mục gốc `public/images/tư liệu/` là tư liệu khách gửi: khi đưa ảnh vào sử dụng, sao chép/đổi tên sang thư mục ASCII tương ứng (`public/images/nails/`, `public/images/lashes/`, `public/images/courses/`), không tham chiếu trực tiếp đường dẫn có dấu.
- Không dùng ảnh stock/AI ngoài tư liệu khách trừ khi người dùng đồng ý. Không làm nổi bật hình nhân vật hoạt hình có bản quyền.
- Không gán ảnh tiệm là "thành quả học viên" nếu chưa được xác nhận.

## 6. SEO & chất lượng

- `<html lang="vi">`; mỗi trang có `metadata` (title, description tiếng Việt). Layout gốc phải bỏ hết dấu vết template ("Booking Homestay", "Create Next App", Geist).
- JSON-LD `NailSalon` với tên, địa chỉ, giờ, SĐT lấy từ `data/business.ts`.
- Kiểm tra trước khi báo xong: hiển thị ở 360px và desktop, chữ tiếng Việt đúng dấu, mọi CTA hoạt động (`tel:`, Zalo, form), không lỗi console.

## 7. Quy trình khi làm việc

1. Đọc `docs/REQUIREMENTS.md` + mục liên quan trong tài liệu Next.js.
2. Nếu yêu cầu mới/khác tài liệu → cập nhật tài liệu (và "Việc còn mở" nếu cần xác nhận) trước.
3. Code theo quy tắc trên; dữ liệu vào `data/`, giao diện vào `components/` + `app/`.
4. Lint + build + kiểm tra mobile.
5. Báo lại: đã làm gì, còn gì đang dùng placeholder/chờ xác nhận.
