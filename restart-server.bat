@echo off
chcp 65001 >nul
echo ========================================
echo KHỞI ĐỘNG LẠI SERVER
echo ========================================
echo.

echo [1/3] Đang dừng các process cũ trên port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Đang dừng process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo [2/3] Kiểm tra dependencies...
if not exist "node_modules" (
    echo Đang cài đặt dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo ❌ Cài đặt thất bại!
        pause
        exit /b 1
    )
)

echo [3/3] Đang khởi động server...
echo.
echo ✅ Server sẽ chạy tại: http://localhost:3000
echo 📌 Nhấn Ctrl+C để dừng server
echo.
echo ========================================
echo.

call npm.cmd run dev

