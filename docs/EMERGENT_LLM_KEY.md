# Получение Emergent LLM Key

Emergent LLM Key - это универсальный ключ для доступа к AI функциям в ConnectSphere.

## 🔑 Что такое Emergent LLM Key?

Это единый API ключ, который позволяет использовать:
- **OpenAI GPT-4** - для генерации ice-breakers
- **Anthropic Claude** - для модерации контента
- **Google Gemini** - для расчета совместимости

## 📝 Как получить ключ

### Автоматическое получение

Ключ будет получен автоматически при запуске backend:

```python
# В backend/services/ai_service.py
from emergentintegrations import LLMClient

# Ключ загружается автоматически из окружения
llm_key = os.getenv("EMERGENT_LLM_KEY")
client = LLMClient(api_key=llm_key)
```

### Ручное получение

Если нужно получить ключ вручную:

```python
# Запустите в Python
from emergentintegrations import get_llm_key

key = get_llm_key()
print(key)
```

Скопируйте полученный ключ в `.env` файл:

```env
EMERGENT_LLM_KEY=your_key_here
```

## 🚀 Использование

### AI Совместимость

```python
from services.ai_service import ai_service

# Расчет совместимости между пользователями
compatibility = await ai_service.calculate_compatibility(
    user1_interests=["Travel", "Music"],
    user2_interests=["Travel", "Art"],
    user1_bio="Love exploring new places",
    user2_bio="Artist and traveler"
)
# Результат: 0-100 (процент совместимости)
```

### AI Ice-breakers

```python
# Генерация начала разговора
icebreaker = await ai_service.generate_icebreaker({
    "interests": ["Travel", "Music"],
    "bio": "Love hiking and concerts",
    "job_title": "Software Engineer"
})
# Результат: "I noticed you love hiking! What's your favorite trail?"
```

### Модерация контента

```python
# Проверка сообщения на неприемлемый контент
result = await ai_service.moderate_content(
    content="Hey, want to connect?",
    content_type="text"
)
# Результат: {"is_safe": True, "reason": "..."}
```

## 💰 Стоимость

Emergent LLM Key **бесплатен** для пользователей платформы Emergent.

### Лимиты:
- **Текстовая генерация**: включена
- **Изображения**: только OpenAI (gpt-image-1)
- **Аудио**: не поддерживается

### Топ-ап баланса:

Если баланс заканчивается:
1. Перейдите в Profile → Universal Key → Add Balance
2. Или настройте автоматический топ-ап

## 🔧 Конфигурация

В `backend/.env`:

```env
# AI Configuration
EMERGENT_LLM_KEY=your_key_here

# Или оставьте пустым для автоматического получения
EMERGENT_LLM_KEY=
```

## 🧪 Тестирование

Проверьте работу AI:

```bash
# Запустите backend
cd /app/backend
python server.py

# Тестовый запрос
curl -X POST http://localhost:8001/api/messages/icebreaker/test_match_id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⚠️ Важно

### Безопасность:
- ✅ Никогда не коммитьте ключ в git
- ✅ Используйте .env файлы
- ✅ Не передавайте ключ клиенту
- ✅ Храните в безопасном месте

### Ограничения:
- ❌ Не работает для других AI сервисов (кроме OpenAI, Claude, Gemini)
- ❌ Не для fal.ai, Stability AI и т.д.
- ❌ Только текстовая генерация и OpenAI изображения

## 🐛 Решение проблем

### Ключ не работает
```python
# Проверьте инициализацию
print(ai_service.client)  # Должен быть объект, не None

# Проверьте .env
print(os.getenv("EMERGENT_LLM_KEY"))
```

### AI функции не работают
```python
# Fallback без AI
# Приложение продолжит работать с базовыми функциями:
# - Совместимость по общим интересам (без AI)
# - Стандартные ice-breakers
# - Простая модерация по ключевым словам
```

### Закончился баланс
1. Зайдите в Profile → Universal Key
2. Нажмите Add Balance
3. Пополните баланс
4. Или включите Auto Top-up

## 📊 Использование в приложении

ConnectSphere использует AI для:

1. **Расчет совместимости** (Discovery Screen)
   - 60% на основе общих интересов
   - 40% AI-анализ био и личности

2. **Ice-breakers** (Chat Screen)
   - Персонализированные начала разговора
   - На основе профиля собеседника

3. **Модерация** (Admin Panel)
   - Автоматическая проверка сообщений
   - Флагирование неприемлемого контента

## 🎯 Best Practices

### Кеширование
```python
# Кешируйте результаты AI для экономии
compatibility_cache = {}

def get_cached_compatibility(user1_id, user2_id):
    key = f"{user1_id}_{user2_id}"
    if key not in compatibility_cache:
        compatibility_cache[key] = await calculate_compatibility(...)
    return compatibility_cache[key]
```

### Rate Limiting
```python
# Ограничьте частоту AI запросов
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_icebreaker_cached(profile_hash):
    return await generate_icebreaker(...)
```

### Fallback стратегия
```python
try:
    result = await ai_service.calculate_compatibility(...)
except Exception as e:
    # Fallback к базовому расчету
    result = calculate_basic_compatibility(...)
```

## 📚 Дополнительные ресурсы

- [Emergent Integrations Docs](https://docs.emergent.com/integrations)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com)
- [Google Gemini Docs](https://ai.google.dev/docs)

---

**Готово!** Теперь у вас есть доступ к AI функциям ConnectSphere 🚀
