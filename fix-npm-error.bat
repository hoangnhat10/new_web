@echo off
chcp 65001 >nul
echo ========================================
echo KHẮC PHỤC LỖI NPM - POWERSHELL POLICY
echo ========================================
echo.
echo Nguyên nhân: PowerShell chặn script npm vì chính sách bảo mật
echo.
echo Đang khắc phục...
echo.

REM Chạy PowerShell với quyền Administrator để thay đổi Execution Policy
powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Write-Host \"Đã cài đặt Execution Policy thành công!\" -ForegroundColor Green; pause\"' -Verb RunAs"

echo.
echo ========================================
echo ✅ HOÀN TẤT!
echo ========================================
echo.
echo Bây giờ bạn có thể:
echo 1. Đóng PowerShell hiện tại
echo 2. Mở PowerShell mới
echo 3. Chạy lại: npm --version
echo.
pause

