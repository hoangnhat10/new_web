@echo off
chcp 65001 >nul
echo ========================================
echo XÓA CACHE VÀ REBUILD
echo ========================================
echo.

echo [1/3] Đang xóa thư mục .next...
if exist ".next" (
    rmdir /s /q .next
    echo ✅ Đã xóa thư mục .next
) else (
    echo ℹ️  Không tìm thấy thư mục .next
)

echo.
echo [2/3] Đang xóa node_modules/.cache nếu có...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ Đã xóa cache
) else (
    echo ℹ️  Không tìm thấy cache
)

echo.
echo [3/3] Đang rebuild dự án...
call npm.cmd run build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ BUILD THÀNH CÔNG!
    echo ========================================
    echo.
    echo Bây giờ bạn có thể chạy: npm run dev
) else (
    echo.
    echo ========================================
    echo ❌ BUILD THẤT BẠI!
    echo ========================================
    echo.
    echo Vui lòng kiểm tra lỗi ở trên
)

echo.
pause

