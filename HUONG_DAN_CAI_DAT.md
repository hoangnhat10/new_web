# Hướng Dẫn Cài Đặt và Chạy Dự Án

## Nguyên nhân không chạy được dự án

1. **Node.js chưa được cài đặt**: Dự án Next.js yêu cầu Node.js để chạy
2. **Dependencies chưa được cài đặt**: Các thư viện cần thiết chưa được tải về

## Giải pháp khắc phục

### Bước 1: Cài đặt Node.js

1. Truy cập trang web: https://nodejs.org/
2. Tải về phiên bản **LTS (Long Term Support)** - khuyến nghị
3. Chạy file cài đặt và làm theo hướng dẫn
4. Đảm bảo tích chọn option "Add to PATH" trong quá trình cài đặt
5. Khởi động lại máy tính sau khi cài đặt

### Bước 2: Kiểm tra cài đặt Node.js

Mở PowerShell hoặc Command Prompt và chạy các lệnh sau:

```bash
node --version
npm --version
```

Nếu hiển thị số phiên bản (ví dụ: v18.17.0) thì đã cài đặt thành công.

### Bước 3: Cài đặt Dependencies

Mở terminal trong thư mục dự án và chạy:

```bash
npm install
```

Lệnh này sẽ:
- Tải về tất cả các thư viện cần thiết vào thư mục `node_modules`
- Tạo file `package-lock.json` để khóa phiên bản dependencies

**Thời gian**: Có thể mất 2-5 phút tùy vào tốc độ internet

### Bước 4: Chạy dự án

Sau khi cài đặt xong, chạy lệnh:

```bash
npm run dev
```

Bạn sẽ thấy thông báo:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Bước 5: Mở trình duyệt

Truy cập: **http://localhost:3000**

## Lưu ý quan trọng

1. **Phải cài Node.js trước** - không thể bỏ qua bước này
2. **Phải chạy `npm install` trước khi chạy `npm run dev`**
3. **Giữ terminal mở** khi đang chạy `npm run dev` - đóng terminal sẽ dừng server
4. **Port 3000 phải trống** - nếu port 3000 đã được sử dụng, Next.js sẽ tự động chuyển sang port khác (3001, 3002, ...)

## Các lệnh hữu ích

- `npm run dev` - Chạy development server
- `npm run build` - Build dự án cho production
- `npm run start` - Chạy production server (sau khi build)
- `npm run lint` - Kiểm tra lỗi code

## Khắc phục lỗi thường gặp

### Lỗi: "node is not recognized"
- **Nguyên nhân**: Node.js chưa được cài đặt hoặc chưa có trong PATH
- **Giải pháp**: Cài đặt lại Node.js và đảm bảo tích chọn "Add to PATH"

### Lỗi: "npm is not recognized"
- **Nguyên nhân**: npm (Node Package Manager) chưa được cài đặt
- **Giải pháp**: npm đi kèm với Node.js, cài đặt Node.js sẽ tự động cài npm

### Lỗi: "Port 3000 is already in use"
- **Nguyên nhân**: Port 3000 đang được sử dụng bởi ứng dụng khác
- **Giải pháp**: 
  - Đóng ứng dụng đang dùng port 3000
  - Hoặc chạy: `npm run dev -- -p 3001` để dùng port khác

### Lỗi khi cài đặt dependencies
- **Nguyên nhân**: Kết nối internet không ổn định hoặc registry npm bị chặn
- **Giải pháp**: 
  - Kiểm tra kết nối internet
  - Thử chạy lại: `npm install`
  - Hoặc xóa thư mục `node_modules` và file `package-lock.json` rồi chạy lại `npm install`

## Yêu cầu hệ thống

- **Node.js**: Phiên bản 18.0.0 trở lên (khuyến nghị LTS)
- **npm**: Phiên bản 9.0.0 trở lên (đi kèm với Node.js)
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **Ổ cứng**: Ít nhất 500MB trống cho node_modules


