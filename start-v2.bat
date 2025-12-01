@echo off
echo ========================================
echo   Reflect PWA V2 - Enhanced Edition
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
)

echo Starting V2 development server...
echo.
echo The app will open at: http://localhost:3001
echo.
echo V2 Features:
echo - Voice Input/Output
echo - Mood Analytics
echo - AI Journal
echo - CBT Exercises
echo - Coping Toolkit
echo - Achievements
echo - Dark Mode
echo - And more!
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev:v2
