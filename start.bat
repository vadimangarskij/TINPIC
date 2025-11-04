@echo off
echo ========================================
echo ConnectSphere - Запуск (Windows)
echo ========================================
echo.

REM Запуск backend
echo Запуск Backend...
cd backend
start "ConnectSphere Backend" cmd /k python server.py
echo [OK] Backend запущен
cd ..

timeout /t 3 /nobreak >nul

REM Проверка backend
curl -s http://localhost:8001/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend может быть не готов
) else (
    echo [OK] Backend работает!
)

echo.
echo ========================================
echo Для запуска Mobile App:
echo    cd mobile
echo    npx expo start
echo.
echo Backend API: http://localhost:8001/docs
echo Backend Health: http://localhost:8001/api/health
echo.
echo Для остановки: stop.bat
echo ========================================
echo.
pause
