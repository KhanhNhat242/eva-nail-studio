# Triển khai Eva Nail Studio lên VPS

Website và CMS (`/admin`) là **một app Next.js**. Mọi nội dung và dữ liệu khách nằm trong **MongoDB**.

## 1. Chuẩn bị máy chủ

- **Node.js 22** trở lên (cần 22.6+ để chạy các script `.mts`).
- **MongoDB**, chọn một trong hai cách:
  - **MongoDB Atlas** (cloud, gói miễn phí): tạo cluster, tạo user, thêm IP của VPS vào *Network Access*, rồi lấy chuỗi `mongodb+srv://…`.
  - **MongoDB trên chính VPS** (Docker):
    ```bash
    docker run -d --name eva-mongo --restart unless-stopped \
      -p 127.0.0.1:27017:27017 -v eva-mongo:/data/db \
      -e MONGO_INITDB_ROOT_USERNAME=eva -e MONGO_INITDB_ROOT_PASSWORD='<mật khẩu mạnh>' \
      mongo:7
    # MONGODB_URI=mongodb://eva:<mật khẩu>@127.0.0.1:27017/?authSource=admin
    ```
    Chỉ mở cổng `27017` cho `127.0.0.1`, không mở ra Internet.
- **PM2**: `npm i -g pm2`. **nginx** làm reverse proxy có HTTPS (Let's Encrypt).

## 2. Cài đặt

```bash
git clone <repo> eva-nail-studio && cd eva-nail-studio
npm ci
cp .env.example .env    # rồi điền các giá trị bên dưới
```

| Biến | Giá trị |
|---|---|
| `MONGODB_URI` | Chuỗi kết nối ở bước 1 |
| `MONGODB_DB` | `eva_nail_studio` |
| `ADMIN_USERNAME` | Tên đăng nhập CMS |
| `ADMIN_PASSWORD_HASH` | `node scripts/hash-password.mts "<mật khẩu>"` → dán kết quả (dạng `scrypt:…:…`) |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

Nạp dữ liệu **lần đầu**:

```bash
npm run db:seed -- --only-missing   # chỉ nạp collection còn trống
```

> `npm run db:seed` không kèm cờ sẽ **ghi đè** nội dung đã sửa trong CMS bằng dữ liệu trong `docs/cms-seed/`. Chỉ dùng khi muốn đặt lại.

## 3. Build & chạy

```bash
npm run build    # CẦN kết nối MongoDB: trang chủ được dựng sẵn từ dữ liệu trong DB
pm2 start npm --name eva -- start -- -p 3000
pm2 save && pm2 startup
```

Mỗi lần cập nhật code: `git pull && npm ci && npm run build && pm2 restart eva`.

nginx (rút gọn):

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_buffering off;   # để phần nội dung tải sau (streaming) hiện ngay
}
```

- **Cookie đăng nhập** chỉ gửi qua HTTPS khi chạy production. Muốn thử production trên `http://` nội bộ thì đặt `COOKIE_INSECURE=1`; không đặt biến này trên máy thật.
- **Server Action báo lỗi Origin**: xảy ra khi đặt sau proxy dùng domain khác với `Host`. Khai báo `experimental.serverActions.allowedOrigins` trong `next.config.ts`.
- **Chạy nhiều instance**: đặt `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (base64 32 byte) để mọi instance dùng chung khoá mã hoá.

## 4. Bàn giao dữ liệu cho khách

- **Atlas**: chuyển quyền sở hữu project (*Project Settings → Access*), hoặc chép dữ liệu sang cluster của khách bằng lệnh bên dưới.
- **Chuyển database**, kể cả lịch đặt và nội dung đã sửa:
  ```bash
  mongodump --uri="<URI cũ>" --db=eva_nail_studio --archive=eva.gz --gzip
  mongorestore --uri="<URI mới>" --archive=eva.gz --gzip
  ```
- **Đổi tài khoản admin** khi bàn giao: tạo hash mới, sửa `.env`, rồi `pm2 restart eva`. Mọi phiên đăng nhập cũ hết hiệu lực khi đổi `ADMIN_USERNAME` hoặc `SESSION_SECRET`.

## 5. Sao lưu (khi tự chạy MongoDB trên VPS)

```bash
# crontab -e — 2 giờ sáng mỗi ngày, giữ 14 bản
0 2 * * * mongodump --uri="$MONGODB_URI" --db=eva_nail_studio --archive=/var/backups/eva-$(date +\%F).gz --gzip && find /var/backups -name 'eva-*.gz' -mtime +14 -delete
```

## 6. Ảnh

**Ảnh có sẵn**: CMS chọn ảnh trong `public/images/` (thư mục tên ASCII). Thêm ảnh bằng cách commit vào repo rồi deploy lại, hoặc chép thẳng vào `public/images/<thư mục>/` trên VPS. Ảnh chép thẳng chỉ hiện sau khi `pm2 restart eva`.

**Ảnh tải lên từ CMS** (trang Ảnh Hero → "Tải ảnh từ máy"):
- File lưu ở `public/images/uploads/` trên VPS, phục vụ qua đường dẫn `/uploads/<tên file>` nên hiện ngay, không cần restart. Thư mục này nằm trong `.gitignore`.
- **Không xóa thư mục này khi deploy.** Đừng chạy `git clean -fdx`, và đừng deploy bằng cách xóa rồi clone lại repo.
- **Sao lưu** thư mục này cùng với database. Ví dụ thêm vào crontab ở mục 5:
  ```bash
  0 2 * * * tar czf /var/backups/eva-uploads-$(date +\%F).tgz -C /path/to/eva-nail-studio/public/images uploads
  ```
- nginx mặc định chỉ nhận body 1MB. Thêm `client_max_body_size 8m;` vào khối `server` hoặc `location /`, nếu không ảnh trên 1MB sẽ lỗi 413. Next đã đặt `serverActions.bodySizeLimit: "6mb"` cho ảnh tối đa 5MB.
- Chạy nhiều instance trên nhiều máy thì không dùng cách lưu file này được, vì mỗi máy có thư mục riêng.
