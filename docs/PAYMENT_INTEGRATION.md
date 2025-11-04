# Интеграция платежных систем

## ЮMoney

### Настройка
1. Регистрация на https://yoomoney.ru
2. Создание приложения в разделе "Для разработчиков"
3. Получение API ключа

### Интеграция
```python
# В .env
YOOMONEY_API_KEY=your_key

# Создание платежа
response = await payment_service.create_subscription_payment(
    user_id="user123",
    plan_type="premium_monthly",
    payment_method="yoomoney"
)
```

### Webhook
```python
@app.post("/api/webhooks/yoomoney")
async def yoomoney_webhook(data: dict):
    # Обработка уведомления о платеже
    if data["status"] == "success":
        # Активировать подписку
        pass
```

---

## QIWI

### Настройка
1. Регистрация на https://qiwi.com
2. Получение API ключа в разделе API
3. Настройка webhook URL

### Интеграция
```python
# В .env
QIWI_API_KEY=your_key

# Создание платежа
response = await payment_service.create_subscription_payment(
    user_id="user123",
    plan_type="premium_monthly",
    payment_method="qiwi"
)
```

---

## Telegram Stars

### Настройка
1. Создание бота через @BotFather
2. Получение токена
3. Настройка платежей через @BotFather:
   ```
   /mybots → Select Bot → Payments → Connect Payment Provider
   ```

### Интеграция
```python
# В .env
TELEGRAM_BOT_TOKEN=your_token

# Создание invoice
import telegram

bot = telegram.Bot(token=TELEGRAM_BOT_TOKEN)

# Отправка invoice
await bot.send_invoice(
    chat_id=user_telegram_id,
    title="Premium Subscription",
    description="1 month premium access",
    payload="premium_monthly",
    provider_token="",  # Telegram Stars использует внутренний provider
    currency="XTR",  # Telegram Stars
    prices=[telegram.LabeledPrice("Premium", 50)]  # 50 stars
)
```

### Обработка успешного платежа
```python
@bot.message_handler(content_types=['successful_payment'])
async def successful_payment(message):
    user_id = message.from_user.id
    # Активировать подписку
    await activate_premium(user_id)
```

---

## Цены

### Подписки
```python
PRICES = {
    "premium_monthly": 499,   # RUB
    "premium_yearly": 2999,   # RUB
    "vip_monthly": 999        # RUB
}
```

### Монеты
```python
COIN_PACKAGES = {
    "small": {"coins": 100, "price": 99},
    "medium": {"coins": 500, "price": 399},
    "large": {"coins": 1000, "price": 699},
    "mega": {"coins": 2500, "price": 1499}
}
```

---

## Безопасность

### Проверка webhook подписи
```python
import hmac
import hashlib

def verify_webhook_signature(data: str, signature: str, secret: str) -> bool:
    expected_signature = hmac.new(
        secret.encode(),
        data.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```

### Обработка ошибок
```python
try:
    payment = await create_payment()
except PaymentError as e:
    # Логирование
    logger.error(f"Payment failed: {e}")
    # Уведомление пользователя
    await notify_user("Payment failed")
```

---

## Тестирование

### Тестовые карты YooMoney
```
Карта: 5555 5555 5555 4444
Срок: любой будущий
CVC: любой
```

### Тестовый режим QIWI
```python
QIWI_TEST_MODE = True  # В .env для разработки
```

### Telegram Stars в тестовом боте
1. Создайте тестового бота
2. Используйте test payment provider
3. Все платежи будут симулироваться

---

## Продакшен

### Чек-лист перед запуском
- [ ] Все API ключи в продакшене
- [ ] Webhook URLs настроены
- [ ] SSL сертификаты установлены
- [ ] Логирование платежей включено
- [ ] Email уведомления настроены
- [ ] Рефанд процесс определен
- [ ] Поддержка пользователей готова

### Мониторинг
```python
# Логирование всех платежей
import logging

logger = logging.getLogger("payments")
logger.info(f"Payment created: {payment_id}")
logger.info(f"Payment status: {status}")
```

### Метрики
- Общая выручка
- Конверсия платежей
- Средний чек
- Возвраты
- Неудачные платежи
