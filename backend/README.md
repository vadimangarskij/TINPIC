# ConnectSphere Backend

FastAPI backend с AI-powered функциями и Supabase интеграцией.

## Установка

```bash
pip install -r requirements.txt
```

## Конфигурация

Создайте `.env` файл:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=your_jwt_secret
```

## Запуск

```bash
# Разработка
python server.py

# Продакшен
uvicorn server:app --host 0.0.0.0 --port 8001
```

## API Documentation

- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Тестирование

```bash
curl http://localhost:8001/api/health
```
