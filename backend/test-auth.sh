#!/bin/bash

# Test script for JWT Authentication
# Make sure the server is running on port 3000

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing JWT Authentication Implementation"
echo "=========================================="
echo ""

# Test 1: Register a new user
echo -e "${YELLOW}Test 1: Register a new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"
if echo "$REGISTER_RESPONSE" | grep -q "email"; then
  echo -e "${GREEN}✓ Registration successful${NC}"
else
  echo -e "${RED}✗ Registration failed${NC}"
fi
echo ""

# Test 2: Login with credentials
echo -e "${YELLOW}Test 2: Login with credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful, token received${NC}"
  echo "Token: ${TOKEN:0:50}..."
else
  echo -e "${RED}✗ Login failed${NC}"
  TOKEN=""
fi
echo ""

# Test 3: Access protected route without token
echo -e "${YELLOW}Test 3: Access protected route without token${NC}"
PROTECTED_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/auth/me")
HTTP_CODE=$(echo "$PROTECTED_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$PROTECTED_RESPONSE" | sed '/HTTP_CODE/d')

echo "Response: $BODY"
if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Protected route correctly returns 401 without token${NC}"
else
  echo -e "${RED}✗ Expected 401, got $HTTP_CODE${NC}"
fi
echo ""

# Test 4: Access protected route with valid token
if [ -n "$TOKEN" ]; then
  echo -e "${YELLOW}Test 4: Access protected route with valid token${NC}"
  ME_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$ME_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  BODY=$(echo "$ME_RESPONSE" | sed '/HTTP_CODE/d')

  echo "Response: $BODY"
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Protected route accessible with valid token${NC}"
  else
    echo -e "${RED}✗ Expected 200, got $HTTP_CODE${NC}"
  fi
  echo ""
else
  echo -e "${YELLOW}Skipping Test 4: No token available${NC}"
  echo ""
fi

# Test 5: Access protected route with invalid token
echo -e "${YELLOW}Test 5: Access protected route with invalid token${NC}"
INVALID_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer invalid-token-12345")
HTTP_CODE=$(echo "$INVALID_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$INVALID_RESPONSE" | sed '/HTTP_CODE/d')

echo "Response: $BODY"
if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Invalid token correctly returns 401${NC}"
else
  echo -e "${RED}✗ Expected 401, got $HTTP_CODE${NC}"
fi
echo ""

# Test 6: Try to register duplicate user
echo -e "${YELLOW}Test 6: Try to register duplicate user${NC}"
DUPLICATE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User 2"
  }')
HTTP_CODE=$(echo "$DUPLICATE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$DUPLICATE_RESPONSE" | sed '/HTTP_CODE/d')

echo "Response: $BODY"
if [ "$HTTP_CODE" = "409" ] || echo "$BODY" | grep -q "already exists"; then
  echo -e "${GREEN}✓ Duplicate registration correctly rejected${NC}"
else
  echo -e "${RED}✗ Expected 409 or error message, got $HTTP_CODE${NC}"
fi
echo ""

# Test 7: Login with wrong password
echo -e "${YELLOW}Test 7: Login with wrong password${NC}"
WRONG_PASS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')
HTTP_CODE=$(echo "$WRONG_PASS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$WRONG_PASS_RESPONSE" | sed '/HTTP_CODE/d')

echo "Response: $BODY"
if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Wrong password correctly returns 401${NC}"
else
  echo -e "${RED}✗ Expected 401, got $HTTP_CODE${NC}"
fi
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="
