@echo off
echo ========================================
echo   Deploying Reflect V4 to Vercel
echo ========================================
echo.

echo Step 1: Building V4...
call npm run build:v4

echo.
echo Step 2: Deploying to Vercel...
echo.
echo When prompted, use these settings:
echo   - Build Command: npm run build:v4
echo   - Output Directory: dist-v4
echo.

vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
pause
