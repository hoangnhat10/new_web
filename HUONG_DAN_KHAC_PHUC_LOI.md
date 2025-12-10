# Hướng Dẫn Khắc Phục Lỗi "localhost refused to connect"

## Nguyên nhân

Lỗi "localhost refused to connect" thường xảy ra khi:
1. **Server chưa được khởi động** - Bạn chưa chạy `npm run dev`
2. **Port bị chiếm bởi process cũ** - Process cũ vẫn đang chạy nhưng đã crash
3. **Server đang chạy trên port khác** - Next.js tự động chuyển sang port khác nếu 3000 bị chiếm
4. **Firewall/Antivirus chặn** - Phần mềm bảo mật chặn kết nối

## Giải pháp

### Cách 1: Sử dụng script tự động (Khuyến nghị)

Chạy file `restart-server.bat`:
- Tự động dừng process cũ
- Kiểm tra và cài đặt dependencies nếu cần
- Khởi động lại server

### Cách 2: Khắc phục thủ công

#### Bước 1: Dừng process cũ

Mở PowerShell hoặc Command Prompt và chạy:

```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Dừng process (thay PID bằng số process ID bạn tìm được)
taskkill /F /PID <PID>
```

Hoặc dừng tất cả Node.js processes:

```powershell
taskkill /F /IM node.exe
```

#### Bước 2: Khởi động lại server

```bash
npm run dev
```

#### Bước 3: Kiểm tra port

Sau khi khởi động, bạn sẽ thấy thông báo:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Lưu ý**: Nếu port 3000 bị chiếm, Next.js sẽ tự động chuyển sang port 3001, 3002, v.v.

### Cách 3: Sử dụng port khác

Nếu port 3000 luôn bị chiếm, bạn có thể chạy trên port khác:

```bash
npm run dev -- -p 3001
```

Sau đó mở: http://localhost:3001

## Kiểm tra server có đang chạy

### Kiểm tra port 3000:
```powershell
netstat -ano | findstr :3000
```

Nếu thấy `LISTENING` thì server đang chạy.

### Kiểm tra trong trình duyệt:
- Mở: http://localhost:3000
- Nếu thấy trang web = server đang chạy
- Nếu thấy "refused to connect" = server chưa chạy hoặc đã crash

## Lỗi thường gặp

### ❌ Lỗi: "Port 3000 is already in use"
**Nguyên nhân**: Port 3000 đang được sử dụng bởi ứng dụng khác

**Giải pháp**:
1. Dừng ứng dụng đang dùng port 3000
2. Hoặc chạy: `npm run dev -- -p 3001`

### ❌ Lỗi: "Cannot find module"
**Nguyên nhân**: Dependencies chưa được cài đặt

**Giải pháp**:
```bash
npm install
npm run dev
```

### ❌ Lỗi: "EADDRINUSE"
**Nguyên nhân**: Port đang được sử dụng

**Giải pháp**: Dừng process cũ (xem Cách 2 - Bước 1)

## Quy trình khởi động đúng

1. **Mở terminal** trong thư mục dự án
2. **Chạy lệnh**: `npm run dev`
3. **Đợi thông báo**: "ready started server..."
4. **Mở trình duyệt**: http://localhost:3000
5. **Giữ terminal mở** - Đóng terminal sẽ dừng server

## Lưu ý quan trọng

- ✅ **Luôn giữ terminal mở** khi đang chạy server
- ✅ **Đợi server khởi động xong** trước khi mở trình duyệt
- ✅ **Kiểm tra port** nếu không kết nối được
- ✅ **Dừng process cũ** trước khi khởi động lại
- ❌ **Không đóng terminal** khi server đang chạy

## Script hỗ trợ

- `restart-server.bat` - Khởi động lại server tự động
- `chay-du-an.bat` - Chạy dự án (nếu chưa chạy)
- `chay-bang-cmd.bat` - Chạy bằng Command Prompt

