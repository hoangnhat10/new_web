# Hướng dẫn chọn KV trong Vercel Dashboard

## Khi bạn thấy modal "Browse Storage"

### Bước 1: Tìm phần Marketplace
- Trong modal "Browse Storage", bạn sẽ thấy thông báo: 
  *"KV and Postgres are now available through the Marketplace"*
- Click vào phần **"Marketplace Database Providers"** hoặc click link **"Learn more"**

### Bước 2: Chọn Upstash Redis
- Trong Marketplace, tìm và chọn **"Upstash Redis"**
- Upstash Redis là provider chính thức cho Vercel KV
- Click **"Add Integration"** hoặc **"Create"**

### Bước 3: Cấu hình
- Đặt tên cho Redis database (ví dụ: `projects-kv`)
- Chọn region gần nhất (ví dụ: `Southeast Asia (Singapore)`)
- Chọn plan **Free** (miễn phí)
- Click **Create** hoặc **Deploy**

### Bước 4: Kết nối với Project
- Sau khi tạo, Vercel sẽ tự động hỏi bạn có muốn kết nối với project không
- Chọn project của bạn (ví dụ: `new-web`)
- Click **Connect** hoặc **Add Integration**
- Environment variables sẽ được thêm tự động

### Bước 5: Redeploy
- Vào tab **Deployments**
- Click **Redeploy** deployment mới nhất
- Hoặc push code mới lên GitHub để tự động deploy

## Xong!

Sau khi hoàn tất, website sẽ có thể lưu công trình vào Upstash Redis (Vercel KV).

## Lưu ý
- **Không chọn** Edge Config hoặc Blob trong tab "Create New" - chúng không phải KV
- **Phải chọn** Upstash Redis từ Marketplace
- Environment variables sẽ tự động được thêm, không cần thêm thủ công


