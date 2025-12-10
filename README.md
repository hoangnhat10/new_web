# Website Bán Sản Phẩm và Dịch vụ Cổng Nhôm Đúc

Website bán sản phẩm và dịch vụ cổng nhôm đúc được xây dựng bằng Next.js 14 và Tailwind CSS.

## Tính năng

- ✅ Trang chủ với banner, giới thiệu và sản phẩm nổi bật
- ✅ Trang sản phẩm với danh sách đầy đủ và bộ lọc theo danh mục
- ✅ Trang chi tiết sản phẩm
- ✅ Trang dịch vụ
- ✅ Trang báo giá với form yêu cầu
- ✅ Trang liên hệ với form và thông tin
- ✅ Responsive design, tương thích mobile và desktop
- ✅ Giao diện hiện đại, gọn gàng với Tailwind CSS

## Cấu trúc dự án

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Trang chủ
│   ├── layout.tsx         # Layout chính
│   ├── globals.css        # CSS toàn cục
│   ├── san-pham/          # Trang sản phẩm
│   │   ├── page.tsx       # Danh sách sản phẩm
│   │   └── [id]/          # Chi tiết sản phẩm
│   ├── dich-vu/           # Trang dịch vụ
│   ├── bao-gia/           # Trang báo giá
│   └── lien-he/           # Trang liên hệ
├── components/            # React Components
│   ├── Header.tsx         # Header/Navigation
│   └── Footer.tsx         # Footer
├── data/                  # Dữ liệu mẫu
│   └── products.ts        # Dữ liệu sản phẩm
└── public/                # Static files
```

## Cài đặt và chạy

### ⚠️ QUAN TRỌNG: Nếu chưa chạy được dự án

**Nguyên nhân thường gặp:**
1. **Node.js chưa được cài đặt** - Đây là yêu cầu bắt buộc
2. **Dependencies chưa được cài đặt** - Chưa chạy `npm install`

**Giải pháp nhanh:**
1. **Cài đặt Node.js**: 
   - Truy cập https://nodejs.org/
   - Tải phiên bản LTS và cài đặt
   - Đảm bảo tích chọn "Add to PATH"
   - Khởi động lại máy tính

2. **Sử dụng script tự động** (Windows):
   - Chạy file `kiem-tra.bat` để kiểm tra và cài đặt tự động
   - Sau đó chạy file `chay-du-an.bat` để khởi động dự án

3. **Hoặc làm thủ công**:
   ```bash
   npm install
   npm run dev
   ```

📖 **Xem chi tiết**: Đọc file `HUONG_DAN_CAI_DAT.md` để biết hướng dẫn đầy đủ

### Yêu cầu
- Node.js 18+ (bắt buộc)
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

**Lưu ý**: Lần đầu cài đặt có thể mất 2-5 phút tùy vào tốc độ internet.

### Chạy development server

**Cách 1: Sử dụng script (Windows)**
```bash
chay-du-an.bat
```

**Cách 2: Sử dụng npm**
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

**Lưu ý**: Giữ terminal mở khi đang chạy server. Nhấn `Ctrl+C` để dừng server.

### Trang Admin
- Đường dẫn: `/admin`
- Mật khẩu: biến môi trường `NEXT_PUBLIC_ADMIN_PASS` (mặc định `admin123`)
- Chức năng: đăng nhập, thêm/sửa/xóa sản phẩm, upload ảnh (lưu base64), dữ liệu lưu tại `data/admin-products.json`
- Trang chính và trang sản phẩm đọc dữ liệu động từ `data/admin-products.json` (fallback dữ liệu tĩnh nếu file trống)

### Build production

```bash
npm run build
npm start
```

## Khắc phục lỗi thường gặp

### ❌ Lỗi: "npm.ps1 cannot be loaded - not digitally signed" (QUAN TRỌNG!)
- **Nguyên nhân**: PowerShell Execution Policy chặn script npm
- **Giải pháp nhanh**: 
  1. Chạy file `fix-npm-error.bat` (tự động fix)
  2. Hoặc chạy file `chay-bang-cmd.bat` (dùng Command Prompt thay vì PowerShell)
  3. Hoặc xem chi tiết trong file `fix-npm-error-manual.md`
- **Giải pháp thủ công**: Mở PowerShell (Admin) và chạy:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### ❌ Lỗi: "node is not recognized"
- **Nguyên nhân**: Node.js chưa được cài đặt hoặc chưa có trong PATH
- **Giải pháp**: Cài đặt Node.js từ https://nodejs.org/ và đảm bảo tích chọn "Add to PATH"

### ❌ Lỗi: "npm is not recognized"  
- **Nguyên nhân**: npm chưa được cài đặt hoặc bị chặn bởi PowerShell Policy
- **Giải pháp**: 
  - Nếu dùng PowerShell: Fix Execution Policy (xem lỗi trên)
  - Hoặc dùng Command Prompt: Chạy `chay-bang-cmd.bat`

### ❌ Lỗi: "Port 3000 is already in use"
- **Nguyên nhân**: Port 3000 đang được sử dụng
- **Giải pháp**: Đóng ứng dụng khác đang dùng port 3000, hoặc chạy `npm run dev -- -p 3001`

### ❌ Lỗi khi cài đặt dependencies
- **Nguyên nhân**: Kết nối internet không ổn định
- **Giải pháp**: Kiểm tra internet và chạy lại `npm install`

## Lịch sử thay đổi

### Version 1.2.0 (2024)
- ✅ Thêm trang Admin (/admin) với đăng nhập (mật khẩu env `NEXT_PUBLIC_ADMIN_PASS`, mặc định `admin123`)
- ✅ Quản lý sản phẩm: thêm/sửa/xóa, upload ảnh (base64) và lưu vào `data/admin-products.json`
- ✅ API CRUD `/api/admin/products` đọc/ghi file JSON
- ✅ Form quản trị có preview ảnh, làm mới, sửa/xóa

### Version 1.1.1 (2024)
- ✅ Sửa lỗi CSS với @apply trong selector *
- ✅ Sửa lỗi font variables trong Tailwind config
- ✅ Sửa lỗi bg-clip-text với luxury-gradient class
- ✅ Thay thế bằng text-gradient class cho text gradient
- ✅ Cải thiện transitions cho interactive elements

### Version 1.1.0 (2024)
- ✅ Nâng cấp UI/UX đẳng cấp, thượng lưu với màu sắc vàng/đồng cao cấp
- ✅ Thêm animations mượt mà (fade-in, fade-in-up, float, hover effects)
- ✅ Cải thiện Header với glassmorphism và backdrop blur
- ✅ Nâng cấp Hero banner với gradient đẹp và animated background
- ✅ Cải thiện cards sản phẩm với hover lift effects và shadows
- ✅ Nâng cấp Footer với design sang trọng hơn
- ✅ Thêm custom scrollbar với gradient
- ✅ Cải thiện typography và spacing
- ✅ Thêm luxury gradient colors và effects
- ✅ Tối ưu transitions và animations cho trải nghiệm mượt mà

### Version 1.0.2 (2024)
- ✅ Thêm script khắc phục lỗi PowerShell Execution Policy (fix-npm-error.bat)
- ✅ Thêm script chạy bằng Command Prompt (chay-bang-cmd.bat)
- ✅ Thêm hướng dẫn chi tiết khắc phục lỗi npm (fix-npm-error-manual.md)
- ✅ Cập nhật README với hướng dẫn fix lỗi PowerShell

### Version 1.0.1 (2024)
- ✅ Thêm file hướng dẫn cài đặt chi tiết (HUONG_DAN_CAI_DAT.md)
- ✅ Thêm script kiểm tra môi trường (kiem-tra.bat)
- ✅ Thêm script chạy dự án tự động (chay-du-an.bat)
- ✅ Cập nhật README với hướng dẫn khắc phục lỗi

### Version 1.0.0 (2024)
- ✅ Khởi tạo dự án Next.js với TypeScript và Tailwind CSS
- ✅ Tạo cấu trúc thư mục và các component cơ bản (Header, Footer)
- ✅ Tạo trang Trang chủ với banner, giới thiệu và sản phẩm nổi bật
- ✅ Tạo trang Sản phẩm với danh sách và bộ lọc theo danh mục
- ✅ Tạo trang Chi tiết sản phẩm
- ✅ Tạo trang Dịch vụ với 6 dịch vụ chính
- ✅ Tạo trang Báo giá với form yêu cầu báo giá
- ✅ Tạo trang Liên hệ với form và thông tin liên hệ
- ✅ Tạo dữ liệu mẫu cho 6 sản phẩm cổng nhôm đúc
- ✅ Thiết kế giao diện hiện đại, responsive với Tailwind CSS
- ✅ Tích hợp navigation menu với mobile responsive

## Công nghệ sử dụng

- **Next.js 14**: Framework React với App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: UI library

## Ghi chú

- Dữ liệu sản phẩm hiện tại là dữ liệu mẫu, có thể thay thế bằng API hoặc database
- Form liên hệ và báo giá hiện chỉ log ra console, cần tích hợp backend để xử lý
- Hình ảnh sản phẩm hiện dùng placeholder, cần thay thế bằng hình ảnh thực tế
- Có thể thêm tính năng giỏ hàng và thanh toán nếu cần

## Tác giả

Website được phát triển cho công ty chuyên cung cấp cổng nhôm đúc.

