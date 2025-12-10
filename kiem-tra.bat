@echo off
chcp 65001 >nul
echo ========================================
echo KIỂM TRA MÔI TRƯỜNG PHÁT TRIỂN
echo ========================================
echo.

echo [1/3] Kiểm tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js CHƯA được cài đặt!
    echo.
    echo 📥 Vui lòng cài đặt Node.js từ: https://nodejs.org/
    echo    Chọn phiên bản LTS và đảm bảo tích chọn "Add to PATH"
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js đã được cài đặt
    node --version
)

echo.
echo [2/3] Kiểm tra npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm CHƯA được cài đặt!
    echo    npm thường đi kèm với Node.js, vui lòng cài đặt lại Node.js
    pause
    exit /b 1
) else (
    echo ✅ npm đã được cài đặt
    npm --version
)

echo.
echo [3/3] Kiểm tra dependencies...
if exist "node_modules" (
    echo ✅ Dependencies đã được cài đặt
) else (
    echo ⚠️  Dependencies CHƯA được cài đặt
    echo.
    echo 📦 Đang cài đặt dependencies...
    echo    (Quá trình này có thể mất 2-5 phút)
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Cài đặt dependencies thất bại!
        echo    Vui lòng kiểm tra kết nối internet và thử lại
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo ✅ TẤT CẢ ĐÃ SẴN SÀNG!
echo ========================================
echo.
echo Để chạy dự án, sử dụng lệnh:
echo    npm run dev
echo.
echo Sau đó mở trình duyệt tại: http://localhost:3000
echo.
pause

