# Инструкция: Исправление RLS и Security Issues в Supabase

## Проблема
Supabase Database Advisor показывает следующие ошибки:
- ❌ RLS не включен на таблицах
- ❌ Security Definer Views
- ⚠️  Function Search Path Mutable
- ⚠️  Extensions in Public schema

## Решение

### Шаг 1: Откройте Supabase Dashboard
1. Перейдите на https://supabase.com/dashboard
2. Выберите ваш проект: `fhdtvadviuvxahsgrqyz`

### Шаг 2: Откройте SQL Editor
1. В левом меню нажмите **SQL Editor**
2. Нажмите **New query**

### Шаг 3: Скопируйте и выполните SQL миграцию

Откройте файл `/app/supabase/fix_rls_and_policies.sql` и скопируйте весь SQL код.

Или используйте готовую команду:

```bash
cat /app/supabase/fix_rls_and_policies.sql
```

### Шаг 4: Вставьте SQL в редактор
1. Вставьте весь SQL код в SQL Editor
2. Нажмите **Run** или `Ctrl+Enter`

### Шаг 5: Проверьте результаты
После выполнения вы должны увидеть сообщения об успешном выполнении.

### Шаг 6: Проверьте Advisor снова
1. Перейдите в **Database** → **Advisors**
2. Все ошибки RLS должны исчезнуть ✅

## Что делает миграция?

### 1. Включает RLS на всех таблицах
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
-- и т.д. для всех таблиц
```

### 2. Создает RLS политики

#### Пользователи могут:
- ✅ Видеть свой профиль
- ✅ Обновлять свой профиль
- ✅ Видеть одобренные профили других
- ✅ Регистрироваться (INSERT)

#### Свайпы:
- ✅ Видеть свои свайпы
- ✅ Создавать новые свайпы

#### Матчи:
- ✅ Видеть свои матчи
- ✅ Service role может создавать матчи

#### Сообщения:
- ✅ Видеть сообщения в своих матчах
- ✅ Отправлять сообщения в своих матчах

#### И так далее для всех таблиц...

### 3. Исправляет функции
- Добавляет `SET search_path = public` ко всем функциям
- Делает их безопасными от SQL injection

### 4. Убирает SECURITY DEFINER Views
- Пересоздает views без SECURITY DEFINER
- Делает их безопасными

## Альтернативный метод (если SQL Editor не работает)

### Используйте Supabase CLI:

```bash
# 1. Установите Supabase CLI
npm install -g supabase

# 2. Залогиньтесь
supabase login

# 3. Свяжите проект
supabase link --project-ref fhdtvadviuvxahsgrqyz

# 4. Примените миграцию
supabase db push /app/supabase/fix_rls_and_policies.sql
```

## После применения миграции

### Проверьте регистрацию:
1. Откройте приложение
2. Нажмите "Создать аккаунт"
3. Заполните форму
4. Регистрация должна работать ✅

### Если всё ещё есть ошибки:

1. **Проверьте логи в Supabase:**
   - Dashboard → Logs → Database
   
2. **Проверьте RLS policies:**
   - Dashboard → Authentication → Policies
   
3. **Убедитесь, что все таблицы созданы:**
   - Dashboard → Table Editor

## Важно!

После применения миграции:
- ✅ Все таблицы будут защищены RLS
- ✅ Пользователи смогут видеть только свои данные
- ✅ Регистрация будет работать
- ✅ Service role (backend) будет иметь полный доступ

## Помощь

Если возникнут проблемы:
1. Проверьте логи backend: `sudo supervisorctl tail -100 backend stderr`
2. Проверьте Supabase Dashboard → Logs
3. Убедитесь, что SUPABASE_SERVICE_KEY корректный в `/app/backend/.env`
