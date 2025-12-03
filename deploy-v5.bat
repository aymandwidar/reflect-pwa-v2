@echo off
echo ========================================
echo   Deploying Reflect V5 to Vercel
echo ========================================
echo.

echo Step 1: Building V5...
call npm run build:v5

echo.
echo Step 2: Deploying to Vercel...
echo.
echo This will create a NEW project called reflect-pwa-v5
echo.

cd dist-v5
vercel --prod --name reflect-pwa-v5

echo.
echo ========================================
echo   V5 Deployment Complete!
echo ========================================
echo.
echo Your V5 URL will be shown above
echo.
pause
