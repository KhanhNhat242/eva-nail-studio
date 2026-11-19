# Dữ liệu mẫu cho CMS (seed)

Mỗi file `.json` là một collection theo mô tả backend (người dùng yêu cầu 19/11/2026).
Nội dung **sinh ra từ `data/*.ts` và các section đang chạy trên trang chủ**, nên khớp với website hiện tại; không thêm dữ liệu kinh doanh mới.

## Danh sách

| File | Kiểu | Nguồn trên site |
|---|---|---|
| `hero_grid.json` | 1 bản ghi (`hero1`…`hero8`) | Lưới ảnh Hero (`components/sections/Hero.tsx`) |
| `service_section.json` / `service.json` | section + 4 thẻ | Chồng thẻ Dịch vụ (`ServicesShowcase`) |
| `combo_section.json` / `combo.json` | section + 4 combo | Hot Combo (`ComboRow`) |
| `price_list.json` / `price.json` | danh mục + 30 mục giá | Popup "Xem toàn bộ bảng giá" |
| `model_section.json` / `model.json` | section + 8 mẫu | "Vừa ra lò" (`GalleryGrid`) |
| `course_section.json` / `course.json` | section + 4 khóa | Khóa học (`Courses`) + lựa chọn trong form |
| `achievement_section.json` / `achievement.json` | section + 4 thẻ | Thành quả học viên |
| `whyus_section.json` / `whyus.json` | section + 7 lý do | Vì sao chọn Eva (`WhyStory`) |
| `booking_customer.json` | 3 bản ghi | Form "Đặt lịch làm đẹp" |
| `course_student.json` | 3 bản ghi | Form "Đăng ký khóa học" |

## Quy ước

- **Section tham chiếu item bằng `id`**, ví dụ `combo_section.combo = ["combo-cat-da-son-thach", …]`. Thứ tự mảng là thứ tự hiển thị. Item không có trong mảng thì **bị ẩn** khỏi website nhưng vẫn còn trong DB.
- Khi nạp vào MongoDB (`npm run db:seed`): `id` trở thành `_id`; section được lưu thành 1 document có `_id: "main"`.
- **Tiền tính bằng đồng, kiểu số nguyên** (`129000`). Định dạng `129.000đ` thuộc phần giao diện.
- **Giá có khoảng** (`service.price`, `price.price`) là object `{ "min", "max" }`:
  - giá cố định: `min = max`;
  - `max: null` nghĩa là "từ `min`" (ví dụ học phí từ 8.000.000đ);
  - `price: null` nghĩa là "Liên hệ tư vấn" (nối mi, uốn mi chưa có giá).
- `combo.price`, `model.price`, `course.price` là số đơn. Với mẫu nail, đây là giá **"từ"**.
- Ảnh là đường dẫn trong `public/` (`/images/...`); khi lên CMS, đổi thành URL của kho media.

## Trường thêm ngoài mô tả gốc

Các trường này giao diện đang dùng, hoặc cần để không vi phạm quy tắc "không bịa dữ liệu". CMS có thể giữ lại hoặc bỏ đi:

- `img_alt` (mọi ảnh): alt tiếng Việt, bắt buộc theo quy tắc ảnh. `hero_grid.*.img_position` là điểm lấy nét `object-position`.
- `service`: `price_label`, `cta`, `overlay` (chữ đè lên thẻ khóa học).
  - Khi `price` là `null`, `price_label` là chữ hiện thay cho giá ("Liên hệ tư vấn").
  - Khi có giá, `price_label` là tiền tố đứng trước giá ("Học phí từ" → "Học phí từ 8.000.000đ").
- `combo_section.title_highlight`: dòng 2 của tiêu đề, hiển thị màu nhấn.
- `price`: `category_name`, `unit` (`set`), `note`; `price_list.categories` giữ thứ tự danh mục.
- `model`: `code` (EVA-01…), `img_width/height`. `category` là **mảng**, vì một mẫu có thể thuộc nhiều nhóm. `model_section` có thêm `title` và `categories` (chip lọc).
- `course`: `original_price` (giá gốc gạch ngang), `gift`, `featured`, `img`.
- `achievement`: `course_id`; `description` đang là tên khóa.

## Cờ chờ xác nhận (không được bỏ khi đưa vào CMS)

| Cờ | Ý nghĩa | REQUIREMENTS |
|---|---|---|
| `model.price_confirmed: false` | Giá mẫu nail là ước lượng | §5, §13 #1 |
| `course_section.session_confirmed: false` | Ca học lấy theo poster mới, chưa chốt | §6.1, §13 #3 |
| `course.img_placeholder: true` | Ảnh bìa khóa học là ảnh mẫu nail minh họa | §14 |
| `achievement.placeholder: true` | **Không phải bài của học viên**; giao diện phải ghi "Ảnh minh họa" | §7, §13 #5 |
| `course.img: null` (gội dưỡng sinh) | Chưa có ảnh | — |

## Dữ liệu form

`booking_customer` và `course_student` là **bản ghi thử nghiệm**: tên "Khách/Học viên thử nghiệm", SĐT `09000000xx` đúng định dạng `^(0|\+84)(3|5|7|8|9)\d{8}$`. Không phải khách thật.

- `booking_customer.service` lưu `value` của ô chọn trong form (`lib/booking-options.ts`):
  - id combo: `combo-…`;
  - id mục giá: `goi-45`…;
  - mẫu nail: `design:<model.id>`.
- `booking_customer.time` thuộc các khung 09:30 → 19:30, mỗi khung cách nhau 30 phút.
- `course_student.course_name` lưu id khóa (`course.id`) hoặc `tu-van` (chưa chọn, cần tư vấn).
- `course_student.session` có thể `null`, vì ô ca học trong form không bắt buộc.
- **Khi lưu thật**, backend thêm các trường sau (file seed không có; `db:seed --with-samples` tự điền):
  - `service_label` / `course_label`: nhãn tại thời điểm đặt;
  - `status`: `new` · `confirmed` · `done` · `cancelled`;
  - `created_at`.
