# Eva Nail Studio — Tài liệu yêu cầu website (Phiếu Dev 69)

> **Nguồn sự thật duy nhất** cho nội dung và phạm vi website. Mọi tính năng, nội dung, giá, giờ, địa chỉ hiển thị trên web phải truy được về tài liệu này.
> Nguồn gốc: Phiếu Dev 69 (sale ghi) + tư liệu khách gửi trong `public/images/` (logo, menu bảng giá, poster khóa học).
> Khi có thông tin mới từ sale/khách → **cập nhật file này trước**, rồi mới sửa code.

---

## 0. Thông tin phiếu

| Mục | Giá trị |
|---|---|
| STT phiếu | 69 |
| Ngày giao hồ sơ | 13/11/2026 |
| Sale phụ trách | Mỹ Tuyền |
| Mã DN | DN0152 |
| Tên doanh nghiệp | **Eva Nail Studio** |
| Ngành | Spa / Thẩm mỹ / Làm đẹp |
| Tỉnh / TP | Hồ Chí Minh |
| Người liên hệ | Eva Huynh |
| SĐT / Zalo | 0789 784 718 |
| Facebook Page | https://www.facebook.com/profile.php?id=61563743506884 |
| Google Maps | https://maps.app.goo.gl/Ha3oeu3Zmsmkiftc8 |
| Website hiện tại | Chưa có |
| Khách đồng ý xem demo? | *(sale chưa ghi)* |
| Hạn giao demo | *(chưa ghi — "SALE GHI HẠN")* |
| Lưu ý / điều cần tránh | *(chưa ghi)* |
| Ngôn ngữ | **Tiếng Việt** (chỉ một ngôn ngữ) |
| Logo (Drive) | https://drive.google.com/drive/folders/1a8klpFPvdrCYh1jCarSU7eZS5rAqG_2G |
| Ảnh / tư liệu (Drive) | https://drive.google.com/drive/folders/1rd3uB0m4Azvl9cU_LxTHaw0zG6cP5OcE |

Các ô dev cần điền trên phiếu sau khi xong: *Dev phụ trách*, *Trạng thái demo*, *Link demo*, *Trạng thái gửi sale* (chọn "Xong – chờ sale gửi" thì phiếu tự đóng).

---

## 1. Mục tiêu website

**Mục tiêu chính: Đặt lịch / nhận tư vấn.** Mọi trang phải dẫn người xem tới một trong hai hành động:

1. **Đặt lịch làm đẹp** (khách làm đẹp) — form đặt lịch online, nút "Đặt mẫu này", Zalo, gọi điện.
2. **Đăng ký / nhận tư vấn khóa học** (học viên học nghề) — form đăng ký học, Zalo.

Hai nhóm khách hàng mục tiêu:

| Nhóm | Cần gì trên web |
|---|---|
| **Khách làm đẹp** | Xem mẫu nail đẹp + giá, bảng giá dịch vụ, đặt lịch nhanh, địa chỉ/giờ mở cửa |
| **Học viên học nghề** | So sánh các khóa (giá, ưu đãi, nội dung, thời lượng), thấy thành quả học viên, đăng ký/tư vấn |

> Đào tạo nghề nail là **nguồn doanh thu lớn** → khu vực Khóa học phải nổi bật ngang hàng với Dịch vụ (có mặt trên menu chính và trang chủ, không bị chôn ở cuối).

---

## 2. Thương hiệu & phong cách

### 2.1 Tên hiển thị
- Tên chính: **Eva Nail Studio**.
- Tagline (từ khách): **"Eva Nail n More – Nail Art & Hair Wash & Lashes"**.
- Handle mạng xã hội trên menu: `eva.nailstudio`.
- Poster cũ có dùng "Eva Nail & Haircare", "Eva Studio" → **không** dùng trên web để tránh lẫn lộn, trừ khi khách yêu cầu.

### 2.2 Logo
- File: `public/images/main-logo.jpg` — chữ "Eva" serif đen, cách điệu, 2 ngôi sao 4 cánh, nền trắng kem.
- Ngôi sao 4 cánh (✦) là **motif trang trí** được phép dùng lại (divider, bullet, hoạ tiết nhẹ).
- Nên có thêm bản SVG/PNG nền trong suốt nếu khách cung cấp; trước mắt dùng JPG trên nền trùng màu kem.

### 2.3 Màu & phong cách (khách chọn)
- **Màu chủ đạo: trắng kem + đen.**
- **Phong cách: tối giản, sang, nữ tính.**

Bảng màu đề xuất (định nghĩa làm design token, không hard-code rải rác):

| Token | Giá trị | Dùng cho |
|---|---|---|
| `cream` | `#FBF8F3` | Nền chính |
| `cream-deep` | `#F3ECE2` | Nền section xen kẽ, card |
| `line` | `#EFE8DC` | Viền, divider (đã có trong `globals.css`) |
| `ink` | `#141414` | Chữ chính, nút chính, logo |
| `ink-soft` | `#5B5550` | Chữ phụ |
| `accent` | `#B89B72` | **Chỉ trang trí**: ngôi sao ✦, đường kẻ, viền, hover. Được làm *chữ* **chỉ khi nằm trên nền `ink`** (6.99:1) |
| `accent-deep` | `#7D6440` | **Chữ vàng đồng trên nền sáng**: nhãn phụ, giá ưu đãi, chữ nghiêng nhấn (5.26:1 cream, 4.75:1 cream-deep) |

Đo tương phản WCAG (17/11/2026):

| Token | Trên cream | Trên cream-deep | Trên ink | Kết luận |
|---|---|---|---|---|
| ink `#141414` | 17.39 | 15.71 | — | Đạt |
| ink-soft `#5B5550` | 6.93 | 6.26 | — | Đạt |
| accent `#B89B72` | 2.49 | 2.25 | 6.99 | ✗ chữ trên nền sáng → chỉ trang trí, hoặc chữ trên nền đen |
| accent-deep `#7D6440` | 5.26 | 4.75 | 3.31 | Đạt 4.5:1 trên nền sáng (không dùng trên nền đen) |

- Bo góc (Minimalist Monochrome đã "làm ấm"): `control` 10px (nút, ô nhập, chip) · `media` 12px (ảnh) · `card` 16px (thẻ, ô Bento). Không góc vuông 0px, không khung vòm/tròn lớn trang trí.
- Viền mảnh 1px là chính; bóng đổ chỉ rất nhẹ (ô Bento khi hover, popup). Nền có hạt giấy rất mờ (≈0.03).
- Chuyển động trạng thái (hover, focus, chọn): 200–300ms, ease mềm. Hover ô Bento: `scale 1.02`. Nhấn nút: `scale .98`.
- Focus bàn phím: viền 3px màu `accent` lệch 3px, luôn hiện.

### 2.4 Hệ style áp dụng (đối chiếu `styles.csv` / skill ui-ux-pro-max, 17/11/2026)

| Mức | Style (No.) | Áp dụng cho | Ghi chú bắt buộc |
|---|---|---|---|
| Chính | **Minimalist Monochrome (70)** | Ngôn ngữ tổng thể: đen trên kem, serif, đường kẻ mảnh, ảnh nail là điểm màu | Làm ấm: cream thay trắng thuần, bo 8–16px, transition 200–300ms (bản gốc 0px/không transition không dùng) |
| Chính | **Exaggerated Minimalism (47)** | **Chỉ** Hero và tiêu đề section: serif cỡ lớn, nén chữ, khoảng trắng rộng, một màu nhấn, không trang trí | **Không** áp cho form, bảng giá, thư viện mẫu |
| Bổ trợ | **Bento Box Grid (39)** | (không còn khu nào dùng: Dịch vụ → chồng thẻ cuộn dọc, Combo → hàng 4 thẻ hover, Vì sao → gallery trên tường — đều theo yêu cầu người dùng, xem mục 14) | Lưới 4 → 2 → 1 cột, ô cream-deep (nghịch nền khi section là cream-deep), bo 16px, hover scale 1.02 |
| Bổ trợ | **Conversion-Optimized (21)** | Bảng so sánh 3 khóa: giá gốc gạch ngang + giá ưu đãi + "tiết kiệm …" + CTA | **Cấm** đếm ngược, "chỉ còn X suất", hard-code tháng ưu đãi |
| Bổ trợ | **Micro-interactions (16)** | "Đặt mẫu này" điền sẵn + nháy ô + thông báo nhỏ, lọc mẫu, lightbox, validate SĐT khi rời ô, thanh CTA cố định | Xác nhận chỉ mời "Nhắn Zalo để xác nhận lịch", không thông báo giả |
| Nền tảng | **Accessible & Ethical (8)** | Toàn site: vùng chạm ≥ 44px, cách nhau ≥ 8px, focus 3px, label form, lỗi ngay dưới ô + tóm tắt lỗi nhận focus, reduced motion, tương phản ≥ 4.5:1 | |

Style **tránh dùng**: Nature Distilled (61), Soft UI Evolution (19), Claymorphism (9), Y2K (40), Gen Z Chaos (57), Gradient Mesh/Aurora (65), 3D Product Preview (64), Editorial Grid (66), Dark Mode (7).
Nét nữ tính đến từ **ảnh nail + font serif + ngôi sao ✦** — không thêm hồng/pastel, không hoạ tiết bay lượn.

- **Không** dùng xanh ngọc (teal) của poster khóa học hay nâu đỏ của poster gội làm màu giao diện — đó là màu ảnh, không phải màu thương hiệu.
- Website **luôn ở theme sáng (kem)**; không tự đổi sang dark theo hệ điều hành (cần bỏ khối `prefers-color-scheme: dark` trong `globals.css` của template).
- Typography: một font serif hiển thị (tiêu đề, hợp với logo) + một font sans dễ đọc (nội dung). **Bắt buộc có subset `vietnamese`** (ví dụ: Playfair Display / Cormorant Garamond + Be Vietnam Pro). Geist của template không phù hợp tiếng Việt.
- Nhiều khoảng trắng, ảnh lớn, góc bo nhẹ, animation nhẹ nhàng (đã có sẵn `data-reveal` trong `globals.css`).

---

## 3. Thông tin liên hệ & vận hành (hiển thị trên web)

| Mục | Nội dung chuẩn dùng trên web |
|---|---|
| Hotline / Zalo / Booking | **0789.784.718** (link `tel:0789784718`, Zalo `https://zalo.me/0789784718`) |
| Giờ hoạt động | **9:30 – 20:30, nhận khách cuối lúc 19:30** |
| Địa chỉ | **120/61/29 Đường số 59, Phường An Hội Tây (P.14, Gò Vấp cũ), TP. Hồ Chí Minh** |
| Bản đồ | Google Maps link ở trên (nhúng iframe hoặc nút "Chỉ đường") |
| Mạng xã hội | Facebook (link ở trên), Instagram, TikTok — *chưa có URL Instagram/TikTok, cần sale xin* |
| Bảo hành | **Bảo hành nail 5–7 ngày tùy trường hợp** |
| Đặt lịch hiện tại | Qua Zalo và Facebook |

> Ghi chú đối chiếu: phiếu ghi "9:30 – Nhận khách cuối lúc 19h30", menu ghi "9g30 – 20g30" → hai thông tin khớp nhau (đóng cửa 20:30, khách cuối 19:30). Phiếu ghi "Phường 14, Gò Vấp", menu ghi "An Hội Tây (P.14, Gò Vấp cũ)" → dùng tên phường mới kèm tên cũ trong ngoặc.

---

## 4. Dịch vụ & bảng giá

Nguồn: ảnh `public/images/tư liệu/Menu/…` (menu bảng giá nail). **Đơn vị trên menu là nghìn đồng** (30 = 30.000đ). Hiển thị trên web dạng `30.000đ` hoặc `30k` — thống nhất một kiểu.

**Định vị chuyên môn: chuyên gel, KHÔNG làm bột.** Không được liệt kê hay gợi ý dịch vụ bột/acrylic ở bất kỳ đâu.

### 4.1 Nail Care – Chăm sóc móng
| Dịch vụ | Giá (k) | Ghi chú |
|---|---|---|
| Cắt da tay / chân | 30 | |
| Cứng móng – cứng móng tạo cầu | 30 – 50 – 70 | Làm đầy móng, fix móng yếu, dễ gãy |
| Phá sơn gel | 30 | |
| Phá móng úp / gel cứng | 50 | |
| Phủ gel nuôi móng | 100 | |
| Đắp gel nối móng / Dual Form | 250 – 300 | |
| Refill móng đắp gel | 150 – 200 | Làm đầy chân móng gel mới lại |
| Úp móng gel | 130 | Úp móng bằng base gel cách chân |
| Refill móng úp | 80 – 100 | Làm đầy chân móng úp mới lại |
| Builder Gel – BIAB | 180 – 220 | Phủ gel builder nuôi móng, có màu sẵn |

### 4.2 Sơn
| Dịch vụ | Giá (k) |
|---|---|
| Sơn gel / thạch | 110 |
| Sơn mắt mèo / nhũ / ngọc trai… | 130 |
| Ombre lòng đào / full móng | 70 – 100 – 120 |
| Sơn từ 3 màu / dặm che nền móng | 30 |

### 4.3 Hot Combo – All Day (làm nổi bật)
| Combo | Giá (k) | Bao gồm |
|---|---|---|
| Cắt da – Sơn thạch | 129 | Cắt da, dũa form, sơn gel |
| Cắt da – Sơn mắt mèo | 149 | Cắt da, dũa form, sơn mắt mèo không nền |
| Úp móng – Sơn thạch | 199 | Úp móng gel cách chân, dũa form, sơn gel |
| Úp móng – Sơn mắt mèo | 229 | Úp móng gel cách chân, dũa form, sơn gel |

### 4.4 Design – Thiết kế móng
| Hạng mục | Giá (k) |
|---|---|
| French | 99 – 120 / set |
| Tráng gương | 99 – 120 / set |
| Vẽ gel nổi | 10 – 50 |
| Vẽ cơ bản | 5 – 35 |
| Vẽ hoạt hình / hoạ tiết | 20 – 200 |
| Ẩn nhũ / xà cừ / hoa | 10 – 30 |
| Loang marble vân đá | 15 – 45 |
| Hoạ tiết gấm | 15 – 25 |
| Charm / đính đá | 3 – 50 |
| Thú nổi / hoa nổi | 20 – 80 |
| Sticker | 3 – 30 |
| Phủ mắt mèo (thêm 1 lớp mắt mèo trên nền) | 90 |

### 4.5 Gội đầu thư giãn
| Dịch vụ | Giá |
|---|---|
| Gội đầu thư giãn 30' | 69k |
| Gội đầu thư giãn 45' | 99k |

### 4.6 Nối mi, uốn mi
- Có dịch vụ (ảnh tư liệu: `public/images/tư liệu/uốn mi/`). **Chưa có bảng giá** → hiển thị "Liên hệ tư vấn" cho tới khi khách cung cấp giá. Không tự đặt giá.

---

## 5. Thư viện mẫu nail ("Vừa ra lò")

- Khách đăng mẫu mới liên tục → trang thư viện phải dễ thêm mẫu (chỉ thêm 1 entry dữ liệu + 1 ảnh).
- Mục **"Vừa ra lò"**: các mẫu mới nhất, hiển thị trên trang chủ và đầu trang thư viện (sắp xếp theo ngày thêm, mới nhất trước).
- Mỗi mẫu gồm: ảnh, tên mẫu, **giá**, nhóm/tag (ví dụ: mắt mèo, french, vẽ, đính đá, tráng gương, ombre, úp móng…), ngày thêm.
- Mỗi mẫu có nút **"Đặt mẫu này"** → mở form đặt lịch đã điền sẵn mẫu đã chọn (mã + tên + giá).
- Có lọc theo nhóm, xem ảnh lớn (lightbox — đã có class `.lightbox-fade`).
- Ảnh nguồn: `public/images/tư liệu/nails/` (~80 ảnh).
- ⚠ **Giá từng mẫu chưa được khách cung cấp.** Trong demo: hiển thị dạng **"Giá từ …"** ước lượng theo bảng giá mục 4 (combo + design), và đánh dấu trong dữ liệu là `priceConfirmed: false`. Phải xin khách xác nhận trước khi go-live.

---

## 6. Khóa học (đào tạo nghề)

Thông điệp chung: **Học thực tế, áp dụng được ngay ở salon, từ cơ bản đến chuyên nghiệp.** Slogan từ poster: *"Học đúng – Làm được – Tự tin mở tiệm"*.

### 6.1 Khóa học nail (từ phiếu — ưu tiên)
| Khóa | Giá gốc | Giá ưu đãi |
|---|---|---|
| **Full A–Z chuyên nghiệp** | 16.900.000đ | **16.000.000đ** |
| **Full Salon** | 12.900.000đ | **12.000.000đ** |
| **Cơ bản Salon** | 8.000.000đ | — |

Thông tin bổ sung từ poster (dùng làm nội dung chi tiết, cần khách xác nhận khóa nào áp dụng — poster chỉ ghi cho khóa 16.9tr):
- Thời gian học: 3–5 tháng tùy lộ trình cá nhân; học theo lộ trình cá nhân, không chạy theo lớp.
- Bao gồm cốp đồ cơ bản (không có máy mài); tặng bộ đầu mài WILSON cao cấp.
- Định hướng việc làm sau học; hỗ trợ set up mở tiệm chuẩn salon.
- Điểm mạnh đào tạo: Giáo trình rõ ràng · Lên mẫu thực tế (thực hành trên mẫu thật) · Ứng dụng salon · Hỗ trợ đồ nghề (tư vấn mua đồ nghề sau khóa).
- Ca học: ⚠ hai poster mâu thuẫn — (a) 9:30–13:00 & 14:00–18:30; (b) 3 ca 9:30–13:00, 13:30–17:00, 17:30–20:30. **Demo dùng (b)** (poster mới hơn), cần xác nhận.

### 6.2 Khóa học khác (từ poster — mục "Khóa học Nail Gội")
| Khóa | Học phí | Nội dung |
|---|---|---|
| **Gội dưỡng sinh – 2 tuần** | 6.000.000đ | Lý thuyết & thực hành đầy đủ; thực hành trên mẫu thật mỗi buổi; kỹ thuật massage – bấm huyệt dưỡng sinh; cấp chứng chỉ sau khi hoàn thành; sát thực tế làm nghề. Phù hợp người mới & chủ tiệm muốn thêm dịch vụ |
| **Vẽ móng hoạt hình – Online** | 3.500.000đ | Tặng bộ màu & cọ vẽ cao cấp; không giới hạn thời gian; hướng dẫn bài bản đến khi vẽ được |

> Khóa "Vẽ móng hoạt hình" không nằm trong phiếu → hiển thị ở mức phụ, chờ khách xác nhận còn mở không.

### 6.3 Trang khóa học — yêu cầu
- Trang danh sách so sánh các khóa (giá gốc gạch ngang + giá ưu đãi, thời lượng, nội dung chính).
- Trang chi tiết từng khóa.
- **Form đăng ký học**: họ tên, SĐT/Zalo (bắt buộc), khóa quan tâm, ca học mong muốn, ghi chú. Nút phụ "Nhắn Zalo tư vấn".
- Ưu đãi theo tháng (poster ghi "Đăng ký trong tháng 3/4/9…") → **không hard-code tên tháng**; dùng nhãn chung "Ưu đãi học phí" hoặc cấu hình được.

---

## 7. Thành quả học viên

- Trang riêng (và một khối nhỏ trên trang chủ + trang khóa học) trưng bày ảnh sản phẩm học viên.
- ⚠ **Chưa có thư mục ảnh học viên riêng.** Không được ghi ảnh mẫu tiệm là "thành quả học viên". Demo: dùng khung bố cục với ảnh tạm, chú thích rõ trong dữ liệu `placeholder: true`; xin khách ảnh thật.

---

## 8. Đặt lịch online & nhắc lịch qua Zalo

### 8.1 Form đặt lịch (bắt buộc)
- Trường: họ tên, SĐT/Zalo (bắt buộc, validate SĐT VN), dịch vụ hoặc mẫu nail (điền sẵn khi bấm "Đặt mẫu này"), ngày, giờ, ghi chú.
- Giờ chọn được: **9:30 → 19:30** (khách cuối 19:30), bước 30 phút; không cho chọn ngày quá khứ.
- Sau khi gửi: màn hình xác nhận + nút **"Nhắn Zalo để xác nhận lịch"** (mở `zalo.me/0789784718`) + nút gọi.

### 8.2 Nhắc lịch qua Zalo
- Yêu cầu khách: đặt lịch online **và nhắc lịch qua Zalo**.
- Gửi tin nhắc tự động thật cần **Zalo Official Account + Zalo ZNS (API, có phí, cần duyệt template)** → **ngoài phạm vi demo**.
- Demo: thể hiện luồng (xác nhận + nút Zalo) và ghi chú "tiệm sẽ nhắn Zalo nhắc lịch trước giờ hẹn". **Không** được hiển thị thông báo giả kiểu "Đã gửi tin nhắc qua Zalo" nếu chưa tích hợp thật.

### 8.3 Lưu dữ liệu form
- Demo: xử lý bằng Server Action, validate phía server, trả kết quả thành công; chưa có backend lưu trữ (ghi rõ trong code là TODO tích hợp).
- Giai đoạn sau: gửi về Google Sheet / email / Zalo OA (chờ chốt).

---

## 9. Sơ đồ trang (sitemap)

| Route | Trang | Nội dung chính |
|---|---|---|
| `/` | Trang chủ | Hero (logo, tagline, CTA Đặt lịch + Xem khóa học) · Dịch vụ nổi bật · Hot Combo · "Vừa ra lò" · Khóa học (teaser) · Thành quả học viên · Vì sao chọn Eva (USP) · Đặt lịch nhanh · Bản đồ & giờ mở cửa |
| `/dich-vu` | Dịch vụ & bảng giá | Toàn bộ mục 4, nhóm theo danh mục, CTA đặt lịch |
| `/mau-nail` | Thư viện mẫu nail | Mục 5: "Vừa ra lò", lọc, lightbox, giá, "Đặt mẫu này" |
| `/khoa-hoc` | Khóa học | Mục 6: so sánh khóa, form đăng ký học |
| `/khoa-hoc/[slug]` | Chi tiết khóa | Nội dung, giá, ca học, đăng ký |
| `/thanh-qua-hoc-vien` | Thành quả học viên | Mục 7 |
| `/dat-lich` | Đặt lịch | Mục 8, nhận query `?mau=<id>` hoặc `?dich-vu=<id>` |
| `/lien-he` | Liên hệ | Địa chỉ, bản đồ, giờ, hotline, mạng xã hội |

Thành phần dùng chung:
- **Header**: logo, menu (Dịch vụ · Mẫu nail · Khóa học · Thành quả học viên · Liên hệ), nút "Đặt lịch" nổi bật.
- **Footer**: logo, tagline, địa chỉ, giờ, hotline, bảo hành, mạng xã hội, bản đồ.
- **Thanh CTA cố định trên mobile**: Gọi · Zalo · Đặt lịch.

---

## 10. Điểm mạnh (USP) — dùng cho khối "Vì sao chọn Eva"

1. Vừa làm dịch vụ vừa **đào tạo nghề nail và gội**.
2. **Chuyên gel**, học thực tế, áp dụng được ngay tại salon.
3. Nhiều khóa học theo cấp độ và mức học phí.
4. Nhiều dịch vụ trong một tiệm: **nail, gội, mi**.
5. Cập nhật mẫu mới liên tục; thường xuyên có khuyến mãi theo dịp lễ.
6. Đặt lịch qua Zalo và Facebook; hoạt động trên Facebook, Instagram, TikTok.
7. Bảo hành nail 5–7 ngày.

---

## 11. Yêu cầu phi chức năng

- **Mobile-first** (khách đến từ Facebook/TikTok/Zalo trên điện thoại). Không cuộn ngang ở 360px.
- Tải nhanh: ảnh qua `next/image`, đúng `sizes`, lazy-load ngoài màn hình đầu.
- SEO local: `<html lang="vi">`, title/description từng trang bằng tiếng Việt, Open Graph dùng logo/ảnh mẫu, JSON-LD `NailSalon`/`LocalBusiness` (tên, địa chỉ, giờ, SĐT).
- Accessibility: alt ảnh tiếng Việt có nghĩa, tương phản đủ (chữ đen trên kem), focus rõ, tôn trọng `prefers-reduced-motion` (đã có).
- Toàn bộ chữ trên giao diện bằng tiếng Việt có dấu, đúng chính tả.

---

## 12. Tư liệu ảnh hiện có

| Thư mục | Số ảnh | Dùng cho |
|---|---|---|
| `public/images/main-logo.jpg` | 1 | Logo |
| `public/images/tư liệu/Menu/` | 1 | Nguồn bảng giá (không cần hiển thị ảnh, đã chép sang dữ liệu) |
| `public/images/tư liệu/nails/` | ~80 | Thư viện mẫu nail, hero, "Vừa ra lò" |
| `public/images/tư liệu/uốn mi/` | 3 | Dịch vụ mi |
| `public/images/tư liệu/Khóa học/` | 6 | Poster khóa học (nguồn nội dung; có thể hiển thị trong trang khóa học) |

Lưu ý:
- Poster "Vẽ móng hoạt hình" có hình nhân vật hoạt hình có bản quyền → **không dùng làm ảnh nổi bật** trên web.
- Tên thư mục có dấu và khoảng trắng (`tư liệu`, `uốn mi`, `Khóa học`) dễ lỗi URL → xem quy tắc tài sản trong `AGENTS.md`.

---

## 13. Việc còn mở — cần sale/khách xác nhận

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | Giá từng mẫu nail trong thư viện | Mục 5 (đang dùng "Giá từ…" ước lượng) |
| 2 | Bảng giá nối mi, uốn mi | Mục 4.6 |
| 3 | Ca học chính xác; nội dung/thời lượng từng khóa 8tr / 12tr | Mục 6.1 |
| 4 | Khóa "Vẽ móng hoạt hình online" còn mở không | Mục 6.2 |
| 5 | Ảnh thành quả học viên thật | Mục 7 |
| 6 | URL Instagram, TikTok | Footer, Liên hệ |
| 7 | Logo bản vector / nền trong suốt | Header, favicon |
| 8 | Nơi nhận dữ liệu form (Sheet/email/Zalo OA) và có làm Zalo ZNS không | Mục 8 |
| 9 | Khách đồng ý xem demo? Hạn giao demo? Điều cần tránh? | Tiến độ |
| 10 | Tiệm mở cửa những ngày nào trong tuần (có nghỉ ngày nào không)? | JSON-LD giờ mở cửa (đang bỏ trống) |
| 11 | Ảnh gội đầu thật tại tiệm (demo đang cắt từ poster khóa gội) | Thẻ "Gội đầu thư giãn" |
| 12 | Ảnh mẫu không watermark (đa số ảnh có chữ "EvaNailStudio") | Thư viện mẫu, Hero |

---

## 14. Nhật ký triển khai

- **17/11/2026 – Landing page một trang** (`app/page.tsx`), theo brief thiết kế của người dùng: Hero → Dịch vụ nổi bật + Hot Combo → "Vừa ra lò" → Khóa học → Thành quả học viên + 7 USP → Đặt lịch/Đăng ký học + bản đồ → Footer. Menu trỏ tới anchor (`#dich-vu`, `#mau-nail`, `#khoa-hoc`, `#thanh-qua`, `#lien-he`, `#dat-lich`); các route con ở mục 9 làm sau.
  - "Xem toàn bộ bảng giá" mở popup bảng giá (thay cho trang `/dich-vu` chưa có).
  - Form đặt lịch có 2 tab: *Đặt lịch làm đẹp* / *Đăng ký khóa học*; nút "Đặt mẫu này", "Chọn lịch nhanh", "Đăng ký học" tự điền sẵn lựa chọn.
  - Ảnh đã chọn được sao chép sang `public/images/{nails,lashes,services,brand}/` (tên ASCII). Logo: `brand/logo-eva.png` (nền trong suốt, cắt từ `main-logo.jpg`).
  - Giá "Giá từ…" của 8 mẫu nail là **ước lượng** (`priceConfirmed: false`).
- **17/11/2026 – Áp hệ style mục 2.4** cho toàn bộ section (tra thông số bằng skill `ui-ux-pro-max`):
  - Token mới `accent-deep #7D6440` cho chữ vàng đồng trên nền sáng; `accent` chỉ còn trang trí / chữ trên nền đen. Bo góc `control/media/card` = 10/12/16px; focus 3px.
  - Hero + tiêu đề: Exaggerated Minimalism (serif lớn, nén chữ, bỏ con dấu xoay & sao lấp lánh, khung vòm/tròn → bo 12–16px).
  - Bento: Dịch vụ (ô **Khóa học 2×2 ngang hàng ô Nail 2×2**, Gội/Mi 2×1), Hot Combo, "Vì sao chọn Eva"; hover scale 1.02.
  - Khóa học: bảng so sánh kiểu Conversion-Optimized, thêm "tiết kiệm …" tính từ dữ liệu; không yếu tố urgency.
  - Micro-interactions: "Đặt mẫu này" → ô lựa chọn nháy viền + thông báo "Đã chọn: …"; chip lọc có số lượng + `aria-pressed`; validate SĐT khi rời ô; nhấn nút scale .98.
  - Accessible: mọi vùng chạm ≥ 44px, lỗi form có hộp tóm tắt nhận focus + link tới từng ô, ô nhập 16px (không bị iOS phóng to).
- **17/11/2026 – Soát "AI slop" (skill `ui-taste`)**: bỏ nhãn phụ lặp, đánh số vô nghĩa, chữ nghiêng nhấn ngoài hero, thẻ chỉ số nổi trên ảnh hero, kính mờ header/thanh CTA, sao trang trí thừa; tiêu đề section chuyển sang bố cục chia đôi (trái tiêu đề · phải mô tả + hành động); đổi "Combo được yêu thích nhất" (tự nhận) → "Hot combo áp dụng cả ngày"; bỏ link "So sánh chi tiết" (sai đích); khung chờ học viên thành trạng thái trống trung thực. Danh sách cấm ghi trong `AGENTS.md`.
- **17/11/2026 – Icon tab**: `app/favicon.ico` (32px), `app/icon.png` (512px), `app/apple-icon.png` (180px) — chữ "Eva" màu kem trên nền ink, tạo từ `public/images/brand/logo-eva.png`. Nên thay bằng bản vector khi khách gửi (mục 13 #7) để icon sắc nét hơn.
- **17/11/2026 – Hiệu ứng BounceCards cho thư viện mẫu** (người dùng yêu cầu): tab *Mắt mèo / Ombre / Đính đá / Vẽ nổi 3D* hiển thị chồng thẻ BounceCards (React Bits, `components/ui/BounceCards.tsx` — chuyển TS từ registry `BounceCards-JS-CSS`, không thêm dependency) + danh sách mẫu kèm "Đặt mẫu này"; tab *Tất cả* giữ lưới cũ. Bấm thẻ → mở ảnh lớn. Tiêu đề "Vừa ra lò" và thanh tab căn giữa.
- **17/11/2026 – Hero làm lại theo ảnh mẫu người dùng gửi**: trái = "EVA" serif giãn chữ + "Nail Studio" nghiêng, divider ✦, tagline, hàng 4 dịch vụ có icon (Nail gel · Nail art · Gội đầu · Nối mi), 2 nút CTA; phải = `public/images/hero-img.jpg` tràn mép. Mobile: ảnh trên, chữ dưới (vừa 1 màn hình). Tiêu đề 8 từ + đoạn dẫn 22 từ của brief cũ được thay bằng tên thương hiệu theo bố cục mới.
- **17/11/2026 – Header theo vùng Hero**: trong Hero menu dồn phải, ẩn nút "Đặt lịch"; cuộn qua Hero → menu trượt về giữa (left/translate 700ms) và nút hiện lại (`components/layout/Header.tsx`, IntersectionObserver trên `#top`).
- **17/11/2026 – Section Dịch vụ dạng chồng thẻ cuộn dọc** (người dùng yêu cầu, thay cho lưới Bento của mục 2.4 ở khu này): `components/sections/ServicesShowcase.tsx` — section ghim (sticky), cuộn trong phạm vi section thì thẻ chính trượt xuống + mờ dần, thẻ phụ phóng to thành thẻ chính; cột phải là tiêu đề + mô tả + chi tiết thẻ đang hiện; có chỉ báo bấm được. Thứ tự: Nail → Khóa học → Gội đầu → Nối mi. Hot Combo và "Vì sao chọn Eva" vẫn dùng Bento.
- **17/11/2026 – Hero: ảnh `hero2-img` + nền `blush` #EBD6CB, cao 100% màn hình desktop, header trong suốt nằm đè lên Hero** (nền kem khi rời Hero). Ảnh đã tách nền trắng → `public/images/hero/hero2-cutout.png` (file gốc giữ nguyên). Token `blush`: ink 13.17:1, ink-soft 5.25:1, accent-deep 3.98:1 → trên nền blush, `accent-deep` chỉ dùng cho chữ lớn ≥ 24px và icon.
- **17/11/2026 – Hot Combo theo ảnh mẫu**: nhãn nhỏ + tiêu đề 2 dòng (dòng 2 màu nhấn) · link "Xem toàn bộ bảng giá ↗" bên phải; 4 thẻ cùng 1 hàng (`components/sections/ComboRow.tsx`). Desktop: hover/focus → thẻ nở rộng, chia 2 cột, ảnh minh họa trượt từ trái sang, nền phần chữ đổi sang blush. Mobile: 1 hàng vuốt ngang, ảnh hiện sẵn. Ảnh minh họa: `public/images/combos/` (mẫu tương tự trong kho tư liệu, ghi rõ "Ảnh minh họa" trong alt).
- **17/11/2026 – Hero đổi nền `linen` #EDE6DF** (thay `blush`; `blush` chỉ còn cho thẻ combo khi active) + gradient chuyển tiếp ở mép trái ảnh (mask) — mobile mờ ở mép dưới; menu trong Hero đặt trên nền kem đặc viền mảnh để không chìm vào ảnh.
- **17/11/2026 – 3 thẻ khóa học dạng TiltedCard** (theo code mẫu người dùng gửi): `components/ui/TiltedCard.tsx` tự viết (không dependency) — nghiêng theo chuột, glare, nhấn để lật; mặt trước ảnh nền + tên + giá, mặt sau chi tiết + "Đăng ký học". Theo yêu cầu: bỏ nhãn cấp độ (Khởi đầu/Đi làm/Mở tiệm), dòng "Ưu đãi · tiết kiệm…", ô quà tặng WILSON; thẻ thấp lại (664px → 470px desktop). Dữ liệu `level`, `gift` vẫn giữ trong `data/courses.ts` nhưng không hiển thị. Ảnh bìa: `cover` trong data (ảnh mẫu, minh họa).
- **17/11/2026 – 4 thẻ Thành quả học viên dạng ProfileCard** (React Bits, `components/ui/ProfileCard.tsx` — chuyển TS, bỏ dependency @hugeicons, icon qua prop): ảnh lấy ngẫu nhiên trong `/public/images` theo yêu cầu, **luôn ghi trạng thái "Ảnh minh họa"** (chưa có ảnh học viên thật — mục 13 #5); nút "Đăng ký" điền sẵn khóa tương ứng.
- **17/11/2026 – 3 thẻ khóa học thẳng hàng** (bỏ phần nhô 12px của gói A–Z; viền vàng đồng vẫn giữ để nhận biết gói nổi bật).
- **17/11/2026 – "Vì sao chọn Eva" làm lại theo ảnh mẫu** (`components/sections/WhyGallery.tsx`, thay lưới Bento ở khu này): nền `public/images/why-us-banner.png` (tường + bàn ghế), hàng thẻ lơ lửng trên tường, tiêu đề góc dưới trái, 2 nút tròn góc dưới phải (thẻ trước/sau). Section ghim: cuộn → thẻ trượt ngang phải → trái; ngừng cuộn ~0,2s → căn giữa thẻ gần nhất và thẻ đó "tan" vào tường (khung mờ hẳn, ảnh minh họa mờ dần ra mép + hòa màu tường, tiêu đề & mô tả hiện lớn trên tường). Mỗi lý do có `image` + `tag` trong `data/usps.ts` (ảnh minh họa từ kho).
- **17/11/2026 – Hero dạng collage theo ảnh mẫu người dùng gửi**: lưới 8 ảnh nail (desktop 4×2; mobile 2 trên · 2 dưới) lấy ngẫu nhiên trong `/public/images`, mảng giấy xé kem ở giữa (clip-path) + vệt màu loang `blush` phía sau, chữ "EVA / Nail Studio", divider ✦, tagline "Nail art · Hair wash · Lashes", icon nhỏ, 2 CTA. Nền `linen`, cao 100% màn hình desktop, header đè lên. (Bỏ ảnh `hero2-img` và hàng 4 dịch vụ có icon của bản trước.)
- **17/11/2026 – "Vì sao chọn Eva" làm lại theo ảnh mẫu mới** (`components/sections/WhyStory.tsx`, thay bản Bento đã khôi phục): nền ink; trái = tiêu đề serif rất lớn (tên lý do) + mô tả + nút bo tròn "Đặt lịch tại Eva"; phải = carousel ảnh (ảnh chính lớn, các ảnh sau nhỏ & thấp dần) + thanh tiến độ bấm được. Section ghim: cuộn → chuyển ảnh tiếp theo, chữ bên trái đổi theo. `WhyGallery.tsx` (bản tường why-us-banner) không còn được dùng.
- **17/11/2026 – Hero phủ kín màn hình desktop, header hòa vào Hero**: lưới ảnh chạy cả phía sau header (từ mép trên), lớp chuyển màu `linen` ở mép trên làm nền cho logo/menu; mảng giấy căn giữa theo cả chiều cao. Menu **luôn căn giữa** (bỏ trạng thái dồn phải trong Hero); nút "Đặt lịch" vẫn ẩn trong Hero, hiện khi cuộn qua.
- **17/11/2026 – Hero giới hạn chiều cao trên màn lớn**: desktop cao `min(100svh, 960px)` (tối thiểu 680px), lưới ảnh rộng tối đa 1720px, căn giữa.
- **17/11/2026 – Hiệu ứng FoldText cho "Eva / Nail Studio" ở Hero** (người dùng gửi code React Bits): `components/ui/FoldText.tsx` + `.css` (chuyển TS). **Thêm dependency `gsap`** theo yêu cầu cài đặt trong đoạn code người dùng gửi. Cỡ chữ & độ đậm giữ theo kiểu chữ Hero (font serif không có weight 800).
- **17/11/2026 – Thẻ "Khóa học" trong Dịch vụ có ảnh minh họa** (thay nền đen): ảnh mẫu tráng gương + lớp tối dần ở đáy để chữ kem đủ tương phản.
- **17/11/2026 – Menu mobile toàn màn hình**: bấm nút menu → header phủ kín màn hình (100dvh), trang phía sau khóa cuộn (giữ đúng vị trí khi đóng); bấm mục menu → đóng menu rồi cuộn mượt tới section.
- **17/11/2026 – "Vì sao chọn Eva" bớt khoảng trống** (người dùng yêu cầu): chữ bên trái gom thành một khối căn giữa theo chiều dọc; khung ảnh desktop theo tỉ lệ 16:10 (tối đa 560px) thay vì cao cả màn hình; ở các mục cuối, ảnh đầu danh sách quay vòng vào hàng chờ để bên phải không trống.
