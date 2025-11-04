# ConnectSphere API Reference

Базовый URL: `http://localhost:8001/api`

## Аутентификация

Все защищенные endpoints требуют JWT токен в header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 🔐 Authentication

#### POST /auth/register
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "full_name": "John Doe",
  "gender": "male",
  "date_of_birth": "1995-05-15"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1Qi...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "is_approved": false
  }
}
```

#### POST /auth/login
Вход в систему

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1Qi...",
  "token_type": "bearer",
  "user": {...}
}
```

---

### 👤 User Profile

#### GET /users/me
Получить профиль текущего пользователя

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "age": 28,
  "gender": "male",
  "bio": "Love hiking and photography",
  "photos": [{"url": "...", "verified": true}],
  "interests": ["Travel", "Music", "Fitness"],
  "is_premium": false,
  "coins": 100,
  "total_matches": 5
}
```

#### PUT /users/me
Обновить профиль

**Request:**
```json
{
  "bio": "Updated bio",
  "interests": ["Travel", "Music"],
  "job_title": "Software Engineer"
}
```

#### POST /users/location
Обновить геолокацию

**Request:**
```json
{
  "latitude": 55.7558,
  "longitude": 37.6173,
  "city": "Moscow"
}
```

---

### 💕 Discovery & Swiping

#### GET /discovery?limit=10
Получить карточки для свайпинга

**Query Parameters:**
- `limit`: количество карточек (1-50)

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "janedoe",
    "full_name": "Jane Doe",
    "age": 26,
    "bio": "...",
    "photos": [...],
    "interests": ["Travel", "Art"],
    "distance": 5.2,
    "compatibility_score": 85,
    "is_verified": true,
    "is_premium": false
  }
]
```

#### POST /swipe
Выполнить свайп

**Request:**
```json
{
  "swiped_user_id": "uuid",
  "action": "like"  // "like", "pass", "super_like"
}
```

**Response:**
```json
{
  "action": "like",
  "match": true,
  "message": "It's a match! 🎉"
}
```

#### POST /swipe/undo
Отменить последний свайп (Premium)

**Response:**
```json
{
  "success": true,
  "message": "Swipe undone"
}
```

---

### 💬 Matches & Messages

#### GET /matches
Получить все матчи

**Response:**
```json
[
  {
    "match_id": "uuid",
    "matched_user": {
      "id": "uuid",
      "username": "janedoe",
      "full_name": "Jane Doe",
      "photos": [...]
    },
    "created_at": "2024-01-15T10:00:00Z",
    "last_message": {
      "content": "Hi there!",
      "sent_at": "2024-01-15T10:05:00Z"
    },
    "unread_count": 2
  }
]
```

#### GET /messages/{match_id}?limit=50
Получить сообщения

**Response:**
```json
[
  {
    "id": "uuid",
    "match_id": "uuid",
    "sender_id": "uuid",
    "content": "Hey, how are you?",
    "message_type": "text",
    "is_read": true,
    "sent_at": "2024-01-15T10:00:00Z"
  }
]
```

#### POST /messages
Отправить сообщение

**Request:**
```json
{
  "match_id": "uuid",
  "content": "Hello!",
  "message_type": "text"
}
```

#### GET /messages/icebreaker/{match_id}
Получить AI ice-breaker

**Response:**
```json
{
  "icebreaker": "I noticed you love hiking! What's your favorite trail?"
}
```

---

### 👑 Premium & Coins

#### POST /premium/subscribe
Оформить подписку

**Request:**
```json
{
  "plan_type": "premium_monthly",
  "payment_method": "yoomoney"
}
```

**Response:**
```json
{
  "success": true,
  "payment_id": "yoomoney_xxx",
  "payment_url": "https://yoomoney.ru/checkout/xxx",
  "amount": 499,
  "currency": "RUB"
}
```

#### POST /coins/purchase
Купить монеты

**Request:**
```json
{
  "package": "medium",  // small, medium, large, mega
  "payment_method": "qiwi"
}
```

#### GET /coins/balance
Получить баланс монет

**Response:**
```json
{
  "coins": 250
}
```

---

### 🛡️ Admin

#### GET /admin/stats
Получить статистику

**Response:**
```json
{
  "total_users": 10000,
  "active_users": 2500,
  "total_matches": 5000,
  "premium_users": 500,
  "pending_approvals": 50
}
```

#### GET /admin/users/pending
Пользователи на модерации

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "newuser",
    "photos": [...],
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

#### POST /admin/users/{user_id}/approve
Одобрить пользователя

#### POST /admin/users/{user_id}/reject
Отклонить пользователя

**Request:**
```json
{
  "reason": "Inappropriate content"
}
```

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Bad Request - неверные данные |
| 401 | Unauthorized - требуется авторизация |
| 403 | Forbidden - доступ запрещен |
| 404 | Not Found - ресурс не найден |
| 429 | Too Many Requests - превышен лимит |
| 500 | Internal Server Error |

---

## Rate Limits

- **Free users:** 100 запросов/час
- **Premium users:** 1000 запросов/час
- **Admin:** без ограничений

---

## Webhooks

### Payment Success
```json
{
  "event": "payment.success",
  "payment_id": "xxx",
  "user_id": "uuid",
  "amount": 499,
  "plan_type": "premium_monthly"
}
```

---

## SDK Examples

### JavaScript/React Native
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get discovery cards
const cards = await api.get('/discovery?limit=10');

// Swipe
await api.post('/swipe', {
  swiped_user_id: 'uuid',
  action: 'like'
});
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}

# Get profile
response = requests.get(
    'http://localhost:8001/api/users/me',
    headers=headers
)
profile = response.json()
```
