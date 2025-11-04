# ConnectSphere Mobile App

## Установка

```bash
npm install
# или
yarn install
```

## Запуск

```bash
# Развернуть Expo
npx expo start

# Для конкретной платформы
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Конфигурация

1. Создайте `.env` файл:
```env
API_URL=http://YOUR_IP:8001/api
```

2. Замените YOUR_IP на IP вашего компьютера

## Сборка

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

Подробнее в `/docs/SETUP.md`
