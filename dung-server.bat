@echo off
chcp 65001 >nul
echo ========================================
echo DỪNG SERVER
echo ========================================
echo.

echo Đang tìm và dừng các process Node.js trên port 3000...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo Đang dừng process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Đã dừng process %%a
    ) else (
        echo ❌ Không thể dừng process %%a
    )
)

echo.
echo Hoặc dừng tất cả Node.js processes:
choice /C YN /M "Bạn có muốn dừng tất cả Node.js processes"
if errorlevel 2 goto end
if errorlevel 1 (
    taskkill /F /IM node.exe >nul 2>&1
    echo ✅ Đã dừng tất cả Node.js processes
)

:end
echo.
echo ========================================
pause

