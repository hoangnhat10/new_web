# Hướng dẫn cấu hình Vercel KV để lưu trữ dữ liệu

## Vấn đề
Trên Vercel, file system là read-only trong runtime, nên không thể ghi file JSON trực tiếp. Cần sử dụng Vercel KV để lưu trữ dữ liệu.

## Giải pháp: Sử dụng Vercel KV qua Marketplace

### Bước 1: Tạo Vercel KV Store qua Marketplace

**Lưu ý:** Vercel đã thay đổi cách tạo KV - giờ phải thông qua Marketplace.

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database** hoặc **Browse Storage**
5. Bạn sẽ thấy modal "Browse Storage" với 2 tab:
   - **Create New**: Edge Config, Blob
   - **Select Existing**: Chọn database đã có
6. **Quan trọng:** Bạn sẽ thấy thông báo: *"KV and Postgres are now available through the Marketplace"*
7. Click vào phần **"Marketplace Database Providers"** hoặc click **"Learn more"** link
8. Trong Marketplace, tìm và chọn **"Upstash Redis"** hoặc **"Vercel KV"**
   - Upstash Redis là provider chính thức cho Vercel KV
9. Click **"Add Integration"** hoặc **"Create"**
10. Đặt tên cho KV store (ví dụ: `projects-kv`)
11. Chọn region gần nhất (ví dụ: `Southeast Asia (Singapore)` hoặc `ap-southeast-1`)
12. Chọn plan (có thể chọn Free tier)
13. Click **Create** hoặc **Deploy**

### Bước 2: Kết nối KV với Project

**Cách 1: Tự động kết nối (Khuyến nghị)**
- Khi tạo KV từ Marketplace, Vercel sẽ tự động hỏi bạn có muốn kết nối với project không
- Chọn project của bạn và click **Connect** hoặc **Add Integration**

**Cách 2: Kết nối thủ công**
1. Sau khi tạo KV store, quay lại tab **Storage** của project
2. Click vào KV store vừa tạo
3. Vào tab **Settings** hoặc **.env.local**
4. Tìm phần **Environment Variables** hoặc **Connection Details**
5. Copy các biến môi trường sau:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   
**Lưu ý:** Nếu sử dụng Upstash Redis, các biến có thể có tên khác:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Bước 3: Thêm Environment Variables vào Project

**Nếu đã tự động kết nối ở Bước 2:**
- Environment variables đã được thêm tự động, bạn có thể bỏ qua bước này
- Kiểm tra bằng cách vào **Project Settings** > **Environment Variables** để xác nhận

**Nếu kết nối thủ công:**
1. Vào **Project Settings** > **Environment Variables**
2. Thêm các biến môi trường từ bước 2:
   - `KV_REST_API_URL` = (giá trị từ KV store)
   - `KV_REST_API_TOKEN` = (giá trị từ KV store)
   - `KV_REST_API_READ_ONLY_TOKEN` = (giá trị từ KV store)
   
   **Hoặc nếu dùng Upstash Redis:**
   - `UPSTASH_REDIS_REST_URL` = (giá trị từ Upstash dashboard)
   - `UPSTASH_REDIS_REST_TOKEN` = (giá trị từ Upstash dashboard)
3. Chọn môi trường: **Production**, **Preview**, và **Development**
4. Click **Save**

### Bước 4: Cập nhật code để hỗ trợ Upstash Redis (nếu cần)

Nếu bạn sử dụng Upstash Redis thay vì Vercel KV trực tiếp, có thể cần cập nhật code để hỗ trợ cả hai format environment variables.

### Bước 5: Redeploy Project

1. Vào tab **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy** (hoặc push code mới lên GitHub để tự động deploy)

## Kiểm tra

Sau khi cấu hình xong:
1. Truy cập `/admin` trên website
2. Thử thêm một công trình mới
3. Nếu thành công, dữ liệu sẽ được lưu vào Vercel KV thay vì file JSON

## Lưu ý

- **Local Development**: Code sẽ tự động fallback về file system (`data/admin-projects.json`) nếu không có Vercel KV
- **Production (Vercel)**: Sẽ sử dụng Vercel KV nếu đã cấu hình environment variables
- **Miễn phí**: Upstash Redis có gói miễn phí với 10,000 commands/ngày và 256MB storage

## Troubleshooting

### Lỗi: "Không thể lưu vào Vercel KV"
- Kiểm tra xem đã thêm đầy đủ environment variables chưa
- Kiểm tra xem KV store đã được tạo và kết nối với project chưa
- Kiểm tra xem đã redeploy project sau khi thêm environment variables chưa
- Kiểm tra tên biến môi trường có đúng không (KV_REST_API_* hoặc UPSTASH_REDIS_*)

### Dữ liệu không hiển thị
- Kiểm tra xem dữ liệu có được lưu vào KV store không (vào KV store dashboard)
- Kiểm tra console log để xem có lỗi gì không
- Kiểm tra xem environment variables có được set đúng môi trường không (Production/Preview/Development)
