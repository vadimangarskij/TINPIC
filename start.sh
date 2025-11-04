#!/bin/bash

# ConnectSphere - Запуск приложения

echo "🚀 Запуск ConnectSphere..."
echo ""

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Запуск backend
echo "🔧 Запуск Backend на http://localhost:8001..."
cd backend
python3 server.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend запущен (PID: $BACKEND_PID)${NC}"
cd ..

# Ожидание запуска backend
echo "⏳ Ожидание запуска backend..."
sleep 3

# Проверка backend
curl -s http://localhost:8001/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend работает!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend может быть не готов. Проверьте backend.log${NC}"
fi

echo ""
echo "📱 Для запуска Mobile App:"
echo "   cd mobile"
echo "   npx expo start"
echo ""
echo "🌐 Backend API: http://localhost:8001/docs"
echo "📊 Backend Health: http://localhost:8001/api/health"
echo "📝 Backend Logs: tail -f backend.log"
echo ""
echo "⏹️  Для остановки: ./stop.sh"
