# Hướng dẫn cấu hình Vercel KV để lưu trữ dữ liệu

## Vấn đề
Trên Vercel, file system là read-only trong runtime, nên không thể ghi file JSON trực tiếp. Cần sử dụng Vercel KV (Key-Value store) để lưu trữ dữ liệu.

## Giải pháp: Sử dụng Vercel KV

### Bước 1: Tạo Vercel KV Store

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **KV** (Key-Value)
6. Đặt tên cho KV store (ví dụ: `projects-kv`)
7. Chọn region gần nhất (ví dụ: `Southeast Asia (Singapore)`)
8. Click **Create**

### Bước 2: Kết nối KV với Project

1. Sau khi tạo KV store, click vào store vừa tạo
2. Vào tab **Settings**
3. Tìm phần **Environment Variables**
4. Copy các biến môi trường sau:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### Bước 3: Thêm Environment Variables vào Project

1. Vào **Project Settings** > **Environment Variables**
2. Thêm 3 biến môi trường từ bước 2:
   - `KV_REST_API_URL` = (giá trị từ KV store)
   - `KV_REST_API_TOKEN` = (giá trị từ KV store)
   - `KV_REST_API_READ_ONLY_TOKEN` = (giá trị từ KV store)
3. Chọn môi trường: **Production**, **Preview**, và **Development**
4. Click **Save**

### Bước 4: Redeploy Project

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
- **Miễn phí**: Vercel KV có gói miễn phí với 256MB storage và 30,000 requests/ngày

## Troubleshooting

### Lỗi: "Không thể lưu vào Vercel KV"
- Kiểm tra xem đã thêm đầy đủ 3 environment variables chưa
- Kiểm tra xem KV store đã được tạo và kết nối với project chưa
- Kiểm tra xem đã redeploy project sau khi thêm environment variables chưa

### Dữ liệu không hiển thị
- Kiểm tra xem dữ liệu có được lưu vào KV store không (vào KV store dashboard)
- Kiểm tra console log để xem có lỗi gì không

