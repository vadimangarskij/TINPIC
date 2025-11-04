#!/bin/bash

# ConnectSphere - Остановка приложения

echo "🛑 Остановка ConnectSphere..."

# Остановка backend
if pgrep -f "python3 server.py" > /dev/null; then
    pkill -f "python3 server.py"
    echo "✅ Backend остановлен"
else
    echo "⚠️  Backend не запущен"
fi

# Остановка expo
if pgrep -f "expo start" > /dev/null; then
    pkill -f "expo start"
    echo "✅ Expo остановлен"
fi

echo ""
echo "✅ Все процессы остановлены"
