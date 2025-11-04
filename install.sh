#!/bin/bash

# ConnectSphere - Автоматическая установка

echo "🚀 Установка ConnectSphere..."
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка Python
echo "📦 Проверка Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 не найден. Установите Python 3.9+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python найден: $(python3 --version)${NC}"

# Проверка Node.js
echo "📦 Проверка Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js не найден. Mobile app не будет работать.${NC}"
else
    echo -e "${GREEN}✅ Node.js найден: $(node --version)${NC}"
fi

# Установка backend зависимостей
echo ""
echo "📦 Установка Backend зависимостей..."
cd backend
pip3 install -r requirements.txt
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend зависимости установлены${NC}"
else
    echo -e "${RED}❌ Ошибка установки backend зависимостей${NC}"
    exit 1
fi

# Проверка .env для backend
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Создаю .env файл для backend...${NC}"
    cp .env.example .env 2>/dev/null || echo "SUPABASE_URL=your_url\nSUPABASE_KEY=your_key\nSUPABASE_SERVICE_KEY=your_service_key\nSECRET_KEY=change_this_secret_key_in_production" > .env
    echo -e "${YELLOW}📝 Не забудьте настроить backend/.env с вашими Supabase credentials!${NC}"
fi

cd ..

# Установка mobile зависимостей
if command -v node &> /dev/null; then
    echo ""
    echo "📦 Установка Mobile зависимостей..."
    cd mobile
    
    if command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Mobile зависимости установлены${NC}"
    else
        echo -e "${RED}❌ Ошибка установки mobile зависимостей${NC}"
    fi
    
    # Проверка .env для mobile
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  Создаю .env файл для mobile...${NC}"
        echo "API_URL=http://192.168.1.100:8001/api" > .env
        echo -e "${YELLOW}📝 Не забудьте изменить IP адрес в mobile/.env!${NC}"
    fi
    
    cd ..
fi

echo ""
echo -e "${GREEN}✅ Установка завершена!${NC}"
echo ""
echo "📚 Следующие шаги:"
echo "1. Настройте backend/.env с вашими Supabase credentials"
echo "2. Настройте mobile/.env с вашим IP адресом"
echo "3. Запустите: ./start.sh"
echo ""
echo "📖 Подробности в docs/QUICKSTART.md"
