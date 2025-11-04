@echo off
echo ========================================
echo ConnectSphere - Установка (Windows)
echo ========================================
echo.

REM Проверка Python
echo Проверка Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python не найден. Установите Python 3.9+
    pause
    exit /b 1
)
echo [OK] Python найден

REM Проверка Node.js
echo Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js не найден. Mobile app не будет работать.
) else (
    echo [OK] Node.js найден
)

REM Установка backend
echo.
echo Установка Backend зависимостей...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Ошибка установки backend зависимостей
    pause
    exit /b 1
)
echo [OK] Backend зависимости установлены

REM Создание .env
if not exist .env (
    echo [INFO] Создаю .env файл...
    echo SUPABASE_URL=your_url> .env
    echo SUPABASE_KEY=your_key>> .env
    echo SUPABASE_SERVICE_KEY=your_service_key>> .env
    echo SECRET_KEY=change_this_secret_key>> .env
    echo [WARNING] Настройте backend\.env с вашими credentials!
)

cd ..

REM Установка mobile
node --version >nul 2>&1
if not errorlevel 1 (
    echo.
    echo Установка Mobile зависимостей...
    cd mobile
    
    where yarn >nul 2>&1
    if errorlevel 1 (
        npm install
    ) else (
        yarn install
    )
    
    if errorlevel 1 (
        echo [ERROR] Ошибка установки mobile зависимостей
    ) else (
        echo [OK] Mobile зависимости установлены
    )
    
    if not exist .env (
        echo [INFO] Создаю .env файл...
        echo API_URL=http://192.168.1.100:8001/api> .env
        echo [WARNING] Измените IP адрес в mobile\.env!
    )
    
    cd ..
)

echo.
echo ========================================
echo Установка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Настройте backend\.env
echo 2. Настройте mobile\.env
echo 3. Запустите: start.bat
echo.
pause
