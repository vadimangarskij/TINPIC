@echo off
echo Остановка ConnectSphere...

REM Остановка Python
taskkill /F /IM python.exe /T >nul 2>&1
if errorlevel 1 (
    echo Backend не запущен
) else (
    echo Backend остановлен
)

REM Остановка Node
taskkill /F /IM node.exe /T >nul 2>&1
if errorlevel 1 (
    echo Expo не запущен
) else (
    echo Expo остановлен
)

echo.
echo Все процессы остановлены
pause
