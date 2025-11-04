"""
Script to add test users to Supabase database
"""
import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime, date
import random

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Test user data
test_users = [
    {
        "email": "anna.ivanova@test.com",
        "username": "anna_iv",
        "full_name": "Анна Иванова",
        "date_of_birth": "1996-05-15",
        "age": 28,
        "gender": "female",
        "bio": "Люблю путешествия, йогу и хорошее кино. Работаю в IT, мечтаю увидеть Исландию ✨",
        "photos": ["https://i.pravatar.cc/300?img=1"],
        "interests": ["Путешествия", "Йога", "Кино", "Фотография", "Кулинария"],
        "city": "Москва",
        "job_title": "UX Дизайнер",
        "company": "Яндекс",
        "education": "МГУ",
        "height": 168,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "coins": 500
    },
    {
        "email": "dmitry.petrov@test.com",
        "username": "dmitry_p",
        "full_name": "Дмитрий Петров",
        "date_of_birth": "1992-08-20",
        "age": 32,
        "gender": "male",
        "bio": "Программист, любитель спорта и настольных игр. Ищу свою вторую половинку для совместных приключений 🎯",
        "photos": ["https://i.pravatar.cc/300?img=12"],
        "interests": ["Программирование", "Спорт", "Настольные игры", "Путешествия", "Музыка"],
        "city": "Москва",
        "job_title": "Senior Developer",
        "company": "Mail.ru",
        "education": "МФТИ",
        "height": 182,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "coins": 300
    },
    {
        "email": "maria.sokolova@test.com",
        "username": "maria_s",
        "full_name": "Мария Соколова",
        "date_of_birth": "1998-03-10",
        "age": 26,
        "gender": "female",
        "bio": "Танцую сальсу, люблю искусство и вечерние прогулки. Ищу интересного собеседника и надежного партнера 💃",
        "photos": ["https://i.pravatar.cc/300?img=5"],
        "interests": ["Танцы", "Искусство", "Музыка", "Фитнес", "Книги"],
        "city": "Санкт-Петербург",
        "job_title": "HR Менеджер",
        "company": "Сбербанк",
        "education": "СПбГУ",
        "height": 165,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "coins": 200
    },
    {
        "email": "alex.volkov@test.com",
        "username": "alex_v",
        "full_name": "Александр Волков",
        "date_of_birth": "1994-11-05",
        "age": 30,
        "gender": "male",
        "bio": "Предприниматель, увлекаюсь фотографией и горными лыжами. Ценю честность и чувство юмора 📸",
        "photos": ["https://i.pravatar.cc/300?img=15"],
        "interests": ["Бизнес", "Фотография", "Горные лыжи", "Путешествия", "Кулинария"],
        "city": "Москва",
        "job_title": "Основатель стартапа",
        "company": "Own Business",
        "education": "ВШЭ",
        "height": 178,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "is_premium": True,
        "coins": 1000
    },
    {
        "email": "elena.novikova@test.com",
        "username": "elena_n",
        "full_name": "Елена Новикова",
        "date_of_birth": "1997-07-18",
        "age": 27,
        "gender": "female",
        "bio": "Архитектор, обожаю современное искусство и хорошую музыку. Ищу единомышленника для путешествий и новых открытий 🎨",
        "photos": ["https://i.pravatar.cc/300?img=9"],
        "interests": ["Архитектура", "Искусство", "Музыка", "Путешествия", "Дизайн"],
        "city": "Москва",
        "job_title": "Архитектор",
        "company": "АБ Остоженка",
        "education": "МАРХИ",
        "height": 172,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "coins": 400
    },
    {
        "email": "ivan.kuznetsov@test.com",
        "username": "ivan_k",
        "full_name": "Иван Кузнецов",
        "date_of_birth": "1995-12-25",
        "age": 29,
        "gender": "male",
        "bio": "Маркетолог, люблю активный отдых и новые впечатления. Мечтаю найти свою половинку для счастливой жизни 🚀",
        "photos": ["https://i.pravatar.cc/300?img=17"],
        "interests": ["Маркетинг", "Спорт", "Путешествия", "Технологии", "Книги"],
        "city": "Москва",
        "job_title": "Head of Marketing",
        "company": "Ozon",
        "education": "РЭУ им. Плеханова",
        "height": 185,
        "looking_for": "relationship",
        "is_approved": True,
        "is_verified": True,
        "coins": 250
    }
]

def add_test_users():
    """Add test users to database"""
    print("🚀 Adding test users to Supabase...")
    
    added_count = 0
    for user_data in test_users:
        try:
            # Check if user already exists
            existing = supabase.table("users").select("id").eq("email", user_data["email"]).execute()
            
            if existing.data:
                print(f"⚠️  User {user_data['email']} already exists, skipping...")
                continue
            
            # Insert user
            result = supabase.table("users").insert(user_data).execute()
            
            if result.data:
                print(f"✅ Added user: {user_data['full_name']} ({user_data['email']})")
                added_count += 1
            else:
                print(f"❌ Failed to add user: {user_data['email']}")
        
        except Exception as e:
            print(f"❌ Error adding user {user_data.get('email', 'unknown')}: {e}")
    
    print(f"\n✨ Successfully added {added_count} test users!")
    print("\nTest user credentials:")
    print("=" * 50)
    for user in test_users:
        print(f"Email: {user['email']}")
        print(f"Name: {user['full_name']}")
        print(f"Password: test123 (you need to set this manually)")
        print("-" * 50)

if __name__ == "__main__":
    add_test_users()
