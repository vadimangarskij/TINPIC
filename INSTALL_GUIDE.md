# 🚀 ConnectSphere - Простая установка

## Быстрый старт (5 минут)

### Шаг 1: Автоматическая установка

**Linux/macOS:**
```bash
cd /app
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
cd \app
install.bat
```

Это автоматически:
- ✅ Установит все backend зависимости
- ✅ Установит все mobile зависимости
- ✅ Создаст .env файлы

---

### Шаг 2: Настройка Supabase

1. Откройте `backend/.env`
2. Добавьте ваши Supabase credentials:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

**Где найти:**
- Зайдите в Supabase Dashboard
- Settings → API
- Скопируйте Project URL, anon public key, service_role key

---

### Шаг 3: Настройка Mobile App

1. **Найдите ваш IP адрес:**

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Или
ip addr show
```

**Windows:**
```cmd
ipconfig
# Ищите IPv4 Address
```

2. **Откройте `mobile/.env`:**

```env
API_URL=http://YOUR_IP:8001/api
```

Пример:
```env
API_URL=http://192.168.1.100:8001/api
```

⚠️ **ВАЖНО:** Не используйте `localhost` или `127.0.0.1`!

---

### Шаг 4: Запуск

**Linux/macOS:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

Это запустит:
- ✅ Backend на http://localhost:8001
- ✅ API Docs на http://localhost:8001/docs

Для Mobile App:
```bash
cd mobile
npx expo start
```

Затем сканируйте QR код в Expo Go!

---

## 🔧 Ручная установка

Если автоматическая установка не работает:

### Backend
```bash
cd backend

# Python 3.9+
pip3 install fastapi uvicorn pydantic python-jose passlib python-dotenv supabase bcrypt aiohttp email-validator python-multipart pydantic-settings

# Копируйте .env.example в .env
cp .env.example .env

# Настройте .env
nano .env

# Запуск
python3 server.py
```

### Mobile
```bash
cd mobile

# Node.js 16+
yarn install
# или
npm install

# Копируйте .env.example в .env
cp .env.example .env

# Настройте .env
nano .env

# Запуск
npx expo start
```

---

## ✅ Проверка

### 1. Проверьте Backend:
```bash
curl http://localhost:8001/api/health
```

Должно вернуть:
```json
{
  "status": "healthy",
  "supabase_connected": true
}
```

### 2. Проверьте API Docs:
Откройте http://localhost:8001/docs

### 3. Проверьте Mobile:
- Откройте Expo Go
- Сканируйте QR код
- Вы должны увидеть Welcome Screen

---

## 🚫 Остановка

**Linux/macOS:**
```bash
./stop.sh
```

**Windows:**
```cmd
stop.bat
```

---

## 🐛 Решение проблем

### Backend не запускается

1. **Проверьте .env:**
```bash
cat backend/.env
```

2. **Проверьте логи:**
```bash
tail -f backend.log
```

3. **Переустановите зависимости:**
```bash
cd backend
pip3 install --force-reinstall -r requirements.txt
```

### Mobile не подключается

1. **Проверьте IP в .env:**
```bash
cat mobile/.env
```

2. **Проверьте backend:**
```bash
curl http://YOUR_IP:8001/api/health
```

3. **Проверьте firewall:**
- Откройте порт 8001
- Или отключите firewall временно

4. **Проверьте Wi-Fi:**
- Устройство и компьютер в одной сети?

### Ошибки установки зависимостей

**Python:**
```bash
# Обновите pip
pip3 install --upgrade pip

# Установите по одной
pip3 install fastapi
pip3 install uvicorn
pip3 install supabase
```

**Node.js:**
```bash
# Очистите кеш
cd mobile
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## 📚 Дополнительно

- 📖 [QUICKSTART.md](QUICKSTART.md) - Быстрый старт
- 📘 [docs/SETUP.md](docs/SETUP.md) - Полная инструкция
- 🔌 [docs/API_REFERENCE.md](docs/API_REFERENCE.md) - API документация

---

## ✅ Готово!

Теперь вы можете:
1. ✅ Создать тестовый аккаунт
2. ✅ Пройти онбординг
3. ✅ Начать свайпинг
4. ✅ Чатиться с матчами

**Удачи! 🚀💕**
