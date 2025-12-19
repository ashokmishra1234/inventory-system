@echo off
echo.
echo ======================================
echo   Stopping All Servers
echo ======================================
echo.

echo [1/2] Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% EQU 0 (
    echo       ✅ All Node.js servers stopped
) else (
    echo       ℹ️  No Node.js servers were running
)

echo [2/2] Checking ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo       Killing process on port 5000 (PID %%a)
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo       Killing process on port 5173 (PID %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo       ✅ All ports cleared
echo.
echo ======================================
echo   All servers stopped successfully!
echo ======================================
echo.
pause
