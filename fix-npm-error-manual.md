# Khắc Phục Lỗi NPM - PowerShell Execution Policy

## Lỗi gặp phải

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded. 
The file is not digitally signed. You cannot run this script on the current system.
```

## Nguyên nhân

PowerShell có chính sách bảo mật (Execution Policy) chặn các script không được ký số. npm sử dụng PowerShell script nên bị chặn.

## Giải pháp

### Cách 1: Sử dụng script tự động (Khuyến nghị)

Chạy file `fix-npm-error.bat` - script sẽ tự động khắc phục lỗi.

### Cách 2: Khắc phục thủ công

#### Bước 1: Mở PowerShell với quyền Administrator

1. Nhấn `Windows + X`
2. Chọn "Windows PowerShell (Admin)" hoặc "Terminal (Admin)"

#### Bước 2: Chạy lệnh sau

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Nhấn `Y` khi được hỏi xác nhận.

#### Bước 3: Kiểm tra

Đóng PowerShell và mở lại, sau đó chạy:

```bash
npm --version
```

Nếu hiển thị số phiên bản (ví dụ: 10.2.4) thì đã thành công!

### Cách 3: Sử dụng Command Prompt thay vì PowerShell

Nếu không muốn thay đổi Execution Policy, bạn có thể sử dụng Command Prompt (cmd) thay vì PowerShell:

1. Mở Command Prompt (không cần quyền Admin)
2. Chạy các lệnh npm bình thường:
   ```bash
   npm --version
   npm install
   npm run dev
   ```

### Cách 4: Tạm thời bỏ qua Execution Policy (Chỉ cho phiên hiện tại)

Mở PowerShell và chạy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Sau đó chạy npm. Lưu ý: Cần chạy lại lệnh này mỗi lần mở PowerShell mới.

## Giải thích các Execution Policy

- **Restricted**: Chặn tất cả script (mặc định trên một số hệ thống)
- **RemoteSigned**: Cho phép script local, yêu cầu ký số cho script từ internet (khuyến nghị)
- **Unrestricted**: Cho phép tất cả script (không an toàn)
- **Bypass**: Bỏ qua tất cả (chỉ dùng tạm thời)

## Sau khi khắc phục

Sau khi fix xong, bạn có thể:

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Chạy dự án:
   ```bash
   npm run dev
   ```

## Lưu ý bảo mật

- `RemoteSigned` là lựa chọn an toàn và phù hợp nhất
- Chỉ thay đổi Execution Policy nếu bạn tin tưởng các script bạn chạy
- Không nên đặt `Unrestricted` vì có thể gây rủi ro bảo mật

