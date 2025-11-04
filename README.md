# ConnectSphere 💕

**Современное приложение для знакомств с AI-powered matching и геолокацией**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

## 🌟 Особенности

### 💘 Для пользователей:
- **Умный свайпинг** - интерфейс в стиле Tinder с плавными анимациями
- **AI совместимость** - система подбора на основе интересов и личности
- **Геолокация** - находите людей рядом с вами
- **Реал-тайм чат** - мгновенные сообщения с матчами
- **Премиум функции** - неограниченные лайки, супер-лайки, перемотка
- **Виртуальные подарки** - система монет и подарков
- **Верификация** - подтвержденные профили для безопасности
- **Кастомизация** - темы, бейджи, рамки для премиум пользователей

### 👑 Премиум возможности:
- ⭐ Неограниченные лайки и супер-лайки
- 🔄 Отмена последнего свайпа
- 👀 Просмотр кто вас лайкнул
- 🚀 Буст профиля (топ выдачи на 30 мин)
- 🎨 Кастомные темы и анимации
- 💎 Эксклюзивные бейджи
- 📊 Расширенная аналитика профиля

### 🛡️ Безопасность:
- ✅ Верификация фото
- ✅ Модерация контента с AI
- ✅ Система жалоб и блокировок
- ✅ Приватность настроек
- ✅ Шифрование данных

### 💳 Монетизация:
- **Подписка Premium** - 499₽/месяц или 2999₽/год
- **Виртуальные монеты** - для подарков и бустов
- **Российские платежи** - ЮMoney, QIWI, Telegram Stars

## 🏗️ Архитектура

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Native   │◄────►│   FastAPI       │◄────►│   Supabase      │
│  Mobile App     │      │   Backend       │      │   PostgreSQL    │
│  (iOS/Android)  │      │   + AI Service  │      │   + PostGIS     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                         │                         
        │                         ▼                         
        │                ┌─────────────────┐               
        │                │  Payment APIs   │               
        │                │  ЮMoney, QIWI,  │               
        │                │  Telegram Stars │               
        │                └─────────────────┘               
        │                                                  
        ▼                                                  
┌─────────────────┐                                       
│   React Web     │                                       
│   Admin Panel   │                                       
└─────────────────┘                                       
```

## 🚀 Быстрый старт

### Требования:
- Python 3.9+
- Node.js 16+
- Expo CLI
- Supabase аккаунт

### Установка:

```bash
# 1. Клонируйте репозиторий
git clone <your-repo-url>
cd ConnectSphere

# 2. Настройте Supabase
# - Создайте проект на supabase.com
# - Выполните SQL из /app/supabase/migrations.sql
# - Получите API credentials

# 3. Backend
cd backend
pip install -r requirements.txt
# Настройте .env (см. docs/SETUP.md)
python server.py

# 4. Mobile App
cd ../mobile
npm install
# Настройте .env с API_URL
npx expo start
```

📖 **Полная инструкция:** [`docs/SETUP.md`](docs/SETUP.md)

## 📱 Скриншоты

### Mobile App
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Welcome    │  Discovery  │  Matches    │   Chat      │
│             │             │             │             │
│   💕        │    👤       │    💬       │   💭        │
│ ConnectSphere│ Swipe      │  Your       │  Real-time │
│             │  Cards      │  Matches    │  Messaging │
│ [Sign Up]   │  ❤️ ✕ ⭐   │  [List]     │  [Messages] │
│ [Sign In]   │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## 🛠️ Технологии

### Frontend (Mobile):
- **React Native** - кросс-платформенная разработка
- **Expo** - инструменты разработки и сборки
- **React Navigation** - навигация между экранами
- **Axios** - HTTP клиент
- **AsyncStorage** - локальное хранилище

### Backend:
- **FastAPI** - современный Python web framework
- **Supabase Client** - работа с базой данных
- **JWT** - аутентификация
- **Emergent LLM** - AI функции
- **Bcrypt** - хеширование паролей

### Database:
- **PostgreSQL** (Supabase) - основная база данных
- **PostGIS** - геопространственные данные
- **Row Level Security** - защита данных

### AI/ML:
- **Emergent LLM Key** - бесплатный AI для:
  - Расчет совместимости
  - Генерация ice-breakers
  - Модерация контента

### Платежи:
- **ЮMoney** - российская платежная система
- **QIWI** - электронный кошелек
- **Telegram Stars** - платежи через Telegram

## 📊 База данных

### Основные таблицы:
- `users` - профили пользователей
- `likes` - свайпы (лайки/пропуски)
- `matches` - взаимные матчи
- `messages` - сообщения
- `subscriptions` - премиум подписки
- `coin_transactions` - операции с монетами
- `achievements` - достижения
- `events` - локальные события
- `notifications` - уведомления

### Функции:
- Автоматическое создание матчей при взаимном лайке
- Расчет расстояния через PostGIS
- Уведомления о новых матчах
- Row Level Security для защиты данных

## 🔐 Безопасность

- ✅ JWT токены для аутентификации
- ✅ Bcrypt для хеширования паролей
- ✅ Row Level Security в Supabase
- ✅ HTTPS обязателен в продакшене
- ✅ Rate limiting для API
- ✅ AI модерация контента
- ✅ Верификация фото
- ✅ Система жалоб

## 📈 Масштабирование

Приложение готово к масштабированию:
- Supabase автоматически масштабируется
- FastAPI поддерживает async для высокой нагрузки
- Можно добавить Redis для кеширования
- CDN для статических файлов
- Load balancer для распределения нагрузки

## 🌍 Локализация

Готово для добавления языков:
- Русский (по умолчанию)
- Английский
- Другие языки легко добавить

## 📝 API Documentation

Backend API автоматически документируется через FastAPI:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Основные endpoints:

#### Аутентификация
```
POST /api/auth/register - Регистрация
POST /api/auth/login    - Вход
GET  /api/users/me      - Профиль
PUT  /api/users/me      - Обновление профиля
```

#### Discovery
```
GET  /api/discovery     - Получить карточки
POST /api/swipe         - Свайп действие
POST /api/swipe/undo    - Отменить свайп
```

#### Matches & Chat
```
GET  /api/matches                - Все матчи
GET  /api/messages/{match_id}    - Сообщения
POST /api/messages               - Отправить сообщение
GET  /api/messages/icebreaker/{match_id} - AI ice-breaker
```

#### Premium
```
POST /api/premium/subscribe      - Оформить подписку
POST /api/coins/purchase         - Купить монеты
GET  /api/coins/balance          - Баланс монет
```

#### Admin
```
GET  /api/admin/stats            - Статистика
GET  /api/admin/users/pending    - Ожидающие модерации
POST /api/admin/users/{id}/approve - Одобрить
POST /api/admin/settings         - Настройки OAuth
```

## 🧪 Тестирование

```bash
# Backend tests
cd backend
pytest

# Mobile app
cd mobile
npm test

# E2E testing
npm run test:e2e
```

## 🚢 Деплой

### Backend
- **Heroku** - простой деплой
- **Railway** - современная платформа
- **DigitalOcean** - VPS решение
- **AWS EC2** - полный контроль

### Mobile App
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

### Database
- Supabase - уже hosted
- Бэкапы автоматические

## 📦 Структура файлов

```
/app/
├── backend/              # FastAPI Backend
│   ├── server.py        # Главный файл
│   ├── models/          # Pydantic модели
│   ├── services/        # AI, платежи
│   └── utils/           # Auth, Supabase
│
├── mobile/              # React Native App
│   ├── App.js          # Входная точка
│   └── src/
│       ├── screens/    # Экраны
│       ├── services/   # API
│       └── utils/      # Утилиты
│
├── supabase/           # Database
│   └── migrations.sql  # SQL схема
│
└── docs/               # Документация
    └── SETUP.md        # Инструкция
```

## 🤝 Вклад

Contributions welcome! Пожалуйста:
1. Fork проект
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Откройте Pull Request

## 📄 Лицензия

Этот проект создан для образовательных целей.

## 👥 Авторы

Создано с ❤️ для ConnectSphere

## 📞 Поддержка

- 📧 Email: support@connectsphere.app
- 💬 Telegram: @connectsphere_support
- 📚 Docs: [docs/SETUP.md](docs/SETUP.md)

---

## ⚡ Быстрые команды

```bash
# Backend
cd backend && python server.py

# Mobile
cd mobile && npx expo start

# Admin
cd admin-panel && npm start

# Logs
tail -f /var/log/backend.log
```

## 🎯 Roadmap

- [ ] Video calls между матчами
- [ ] Stories (как в Instagram)
- [ ] Group events (встречи)
- [ ] AI фото верификация
- [ ] Голосовые сообщения
- [ ] Reactions к сообщениям
- [ ] Profile insights & analytics
- [ ] Referral программа
- [ ] Dark mode theme

---

**🚀 Начните знакомиться по-новому с ConnectSphere!**