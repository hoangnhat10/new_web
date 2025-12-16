# Hướng dẫn kiểm tra và kết nối KV với Project

## Kiểm tra xem đã kết nối chưa

### Dấu hiệu chưa kết nối:
- Nút **"Connect Project"** vẫn còn hiển thị (màu đen) ở bên phải
- Environment variables chưa được thêm vào project

### Dấu hiệu đã kết nối:
- Nút "Connect Project" không còn hiển thị
- Hoặc hiển thị "Connected" hoặc "Already Connected"

## Các bước kết nối:

### Bước 1: Click "Connect Project"
1. Trong trang Storage, bạn sẽ thấy nút **"Connect Project"** (màu đen) ở bên phải
2. Click vào nút này
3. Chọn project của bạn (nếu có nhiều project)
4. Click **"Connect"** hoặc **"Add Integration"**

### Bước 2: Kiểm tra Environment Variables
1. Vào **Project Settings** (icon bánh răng ở trên cùng)
2. Chọn tab **Environment Variables**
3. Kiểm tra xem có các biến sau không:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL` (tùy chọn)
   - `REDIS_URL` (tùy chọn)

### Bước 3: Nếu chưa có Environment Variables
1. Quay lại trang Storage
2. Copy các giá trị từ tab **".env.local"**
3. Vào **Project Settings** > **Environment Variables**
4. Thêm từng biến một:
   - Name: `KV_REST_API_URL`
   - Value: (paste giá trị từ .env.local)
   - Chọn: Production, Preview, Development
   - Click **Save**
5. Lặp lại cho các biến còn lại

### Bước 4: Redeploy Project
1. Vào tab **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy** (hoặc push code mới lên GitHub)
4. Đợi deployment hoàn tất

## Kiểm tra sau khi kết nối:

1. Truy cập `/admin` trên website
2. Thử thêm một công trình mới
3. Nếu thành công, dữ liệu sẽ được lưu vào KV store

## Lưu ý:
- Nếu nút "Connect Project" vẫn còn hiển thị → **Chưa kết nối**, cần click vào
- Nếu nút "Connect Project" không còn → **Đã kết nối**, nhưng vẫn cần kiểm tra environment variables
- Sau khi kết nối, **bắt buộc phải redeploy** để environment variables có hiệu lực


