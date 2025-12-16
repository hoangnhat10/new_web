@echo off
chcp 65001 >nul
title Next.js Development Server
color 0A

echo.
echo ========================================
echo   KHỞI ĐỘNG SERVER
echo ========================================
echo.

REM Dừng process cũ
echo [1/3] Đang dừng process cũ...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Kiểm tra dependencies
echo [2/3] Đang kiểm tra dependencies...
if not exist "node_modules" (
    echo     ⚠️  Dependencies chưa có, đang cài đặt...
    call npm install
    if errorlevel 1 (
        echo     ❌ Cài đặt thất bại!
        pause
        exit /b 1
    )
) else (
    echo     ✅ Dependencies đã có
)

REM Khởi động server
echo [3/3] Đang khởi động server...
echo.
echo ========================================
echo   Server sẽ chạy tại: http://localhost:3000
echo   Nhấn Ctrl+C để dừng server
echo ========================================
echo.

npm run dev

pause



