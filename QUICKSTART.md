# ConnectSphere - Быстрый старт ⚡

## 🎯 За 10 минут до запуска

### Шаг 1: Supabase (3 минуты)

1. Зайдите на https://supabase.com
2. Создайте новый проект
3. Перейдите в SQL Editor
4. Откройте файл `/app/supabase/migrations.sql`
5. Скопируйте ВЕСЬ код и вставьте в SQL Editor
6. Нажмите RUN
7. ✅ База данных готова!

### Шаг 2: Backend (2 минуты)

```bash
cd /app/backend

# Установите зависимости (если еще не установлены)
pip install -r requirements.txt

# Настройте .env
nano .env

# Добавьте Supabase credentials:
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_KEY=eyJhbG...
# SUPABASE_SERVICE_KEY=eyJhbG...
# (найдите в Supabase: Settings → API)

# Запустите сервер
python server.py
```

✅ Backend работает на http://localhost:8001

### Шаг 3: Mobile App (5 минут)

```bash
cd /app/mobile

# Установите зависимости (если еще не установлены)
yarn install

# Найдите IP вашего компьютера:
# macOS: ifconfig | grep "inet " | grep -v 127.0.0.1
# Windows: ipconfig
# Linux: ip addr show

# Настройте .env
nano .env

# API_URL=http://YOUR_IP:8001/api
# Например: API_URL=http://192.168.1.100:8001/api

# Запустите Expo
npx expo start
```

✅ Сканируйте QR код в Expo Go app!

---

## 🧪 Проверка

### Проверьте Backend:
```bash
curl http://localhost:8001/api/health
```

Должен вернуть:
```json
{
  "status": "healthy",
  "supabase_connected": true,
  "ai_service_ready": true
}
```

### Проверьте Mobile:
1. Откройте приложение в Expo Go
2. Вы должны увидеть Welcome Screen
3. Зарегистрируйте тестовый аккаунт
4. Пройдите онбординг

---

## 📱 Тестирование приложения

### Создайте 2 тестовых аккаунта:

**Аккаунт 1:**
```
Email: test1@example.com
Username: alice
Password: password123
Interests: Travel, Music, Fitness
```

**Аккаунт 2:**
```
Email: test2@example.com
Username: bob
Password: password123
Interests: Travel, Art, Music
```

### Протестируйте функции:

1. ✅ Регистрация
2. ✅ Онбординг (геолокация, интересы, био, фото)
3. ✅ Свайпинг карточек
4. ✅ Лайк → матч
5. ✅ Чат между матчами
6. ✅ Профиль

---

## ⚙️ Опциональная настройка

### AI функции (Emergent LLM Key):

Backend автоматически получит ключ. Если нет:

```python
from emergentintegrations import get_llm_key
key = get_llm_key()
print(key)
```

Добавьте в `backend/.env`:
```
EMERGENT_LLM_KEY=your_key
```

### Платежные системы:

В `backend/.env`:
```
YOOMONEY_API_KEY=your_key
QIWI_API_KEY=your_key
TELEGRAM_BOT_TOKEN=your_token
```

---

## 🚀 Продакшен деплой

### Backend → Railway/Heroku:
```bash
# Railway
railway init
railway up

# Heroku
heroku create connectsphere-api
git push heroku main
```

### Mobile → Expo Build:
```bash
# Android APK
eas build --platform android --profile preview

# iOS IPA
eas build --platform ios --profile preview
```

---

## 📚 Документация

- 📖 [Полная установка](docs/SETUP.md)
- 🔌 [API Reference](docs/API_REFERENCE.md)
- 💰 [Платежи](docs/PAYMENT_INTEGRATION.md)
- 📊 [Обзор проекта](docs/PROJECT_OVERVIEW.md)
- 🤖 [AI функции](docs/EMERGENT_LLM_KEY.md)

---

## 🆘 Помощь

### Backend не запускается?
```bash
# Проверьте логи
tail -f /var/log/backend.log

# Проверьте Supabase credentials
python -c "from utils.supabase_client import supabase; print(supabase)"
```

### Mobile не подключается?
- ✅ Используете IP (не localhost)?
- ✅ Backend запущен?
- ✅ Один Wi-Fi с устройством?
- ✅ Firewall отключен для порта 8001?

### Expo не запускается?
```bash
# Очистите кеш
npx expo start -c

# Переустановите
rm -rf node_modules && yarn install
```

---

## ✅ Чек-лист готовности

- [ ] Supabase проект создан
- [ ] SQL миграции выполнены
- [ ] Backend .env настроен
- [ ] Backend запущен (health check OK)
- [ ] Mobile .env настроен
- [ ] Mobile запущен в Expo Go
- [ ] Тестовый аккаунт создан
- [ ] Свайпинг работает
- [ ] Чат работает

---

## 🎉 Готово!

**ConnectSphere запущен и готов к использованию!**

Следующие шаги:
1. Создайте несколько тестовых профилей
2. Протестируйте все функции
3. Настройте OAuth (опционально)
4. Добавьте реальные платежи
5. Деплойте в продакшен!

**Удачи! 🚀💕**
