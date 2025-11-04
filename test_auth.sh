#!/bin/bash

echo "================================"
echo "🧪 Testing Auth Endpoints"
echo "================================"

# Generate random email
RANDOM_NUM=$RANDOM
TEST_EMAIL="user${RANDOM_NUM}@test.com"
TEST_USERNAME="user${RANDOM_NUM}"
TEST_PASSWORD="Password123!"

echo ""
echo "📝 Test User:"
echo "   Email: $TEST_EMAIL"
echo "   Username: $TEST_USERNAME"
echo "   Password: $TEST_PASSWORD"

echo ""
echo "================================"
echo "1️⃣  Testing Registration..."
echo "================================"

REGISTER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\",
    \"full_name\": \"Test User $RANDOM_NUM\",
    \"gender\": \"male\",
    \"date_of_birth\": \"1995-01-01\"
  }")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$REGISTER_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Registration successful!"
  echo "$BODY" | python3 -m json.tool 2>/dev/null | head -20
  
  # Extract token
  TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
  
  echo ""
  echo "================================"
  echo "2️⃣  Testing Login..."
  echo "================================"
  
  LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:8001/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$TEST_EMAIL\",
      \"password\": \"$TEST_PASSWORD\"
    }")
  
  HTTP_CODE=$(echo "$LOGIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_CODE/d')
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Login successful!"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -20
  else
    echo "❌ Login failed with code: $HTTP_CODE"
    echo "$BODY"
  fi
  
else
  echo "❌ Registration failed with code: $HTTP_CODE"
  echo "$BODY"
fi

echo ""
echo "================================"
echo "3️⃣  Checking Health..."
echo "================================"
curl -s http://localhost:8001/api/health | python3 -m json.tool

echo ""
echo "================================"
echo "✅ Test Complete!"
echo "================================"
