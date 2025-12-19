@echo off
echo.
echo ======================================
echo   Inventory System Startup Script
echo ======================================
echo.

REM Kill any existing processes on port 5000
echo [1/3] Checking for existing processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo       Found process %%a - Terminating...
    taskkill /F /PID %%a >nul 2>&1
)
echo       Done

REM Wait a moment
echo [2/3] Waiting for port to be released...
timeout /t 2 /nobreak >nul
echo       Done

REM Start the server
echo [3/3] Starting backend server...
echo.
echo ======================================
echo   Server Starting...
echo ======================================
echo.

pnpm start
