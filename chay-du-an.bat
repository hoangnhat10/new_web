@echo off
chcp 65001 >nul
echo ========================================
echo KHỞI ĐỘNG DỰ ÁN
echo ========================================
echo.

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chưa được cài đặt!
    echo    Vui lòng chạy file "kiem-tra.bat" trước
    pause
    exit /b 1
)

REM Kiểm tra dependencies
if not exist "node_modules" (
    echo ⚠️  Dependencies chưa được cài đặt
    echo    Đang cài đặt dependencies...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Cài đặt thất bại!
        pause
        exit /b 1
    )
    echo.
)

REM Dừng process cũ trên port 3000 nếu có
echo Đang kiểm tra và dừng process cũ trên port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo Đang dừng process %%a...
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo ✅ Đang khởi động server...
echo.
echo 📌 Server sẽ chạy tại: http://localhost:3000
echo 📌 Nhấn Ctrl+C để dừng server
echo.
echo ========================================
echo.

npm run dev

