# Testing JWT Authentication Implementation

## Setup Complete ✅

The following components have been created:

1. ✅ **Migration**: `V3__add_password_hash.sql` - Adds `password_hash` column to users table
2. ✅ **DTOs**: 
   - `RegisterDto` - For user registration
   - `LoginDto` - For user login
   - `AuthResponseDto` - For JWT token response
3. ✅ **AuthController**: 
   - `POST /api/auth/register` - Public endpoint for registration
   - `POST /api/auth/login` - Public endpoint for login
   - `GET /api/auth/me` - Protected endpoint to get current user
4. ✅ **Validation**: Global validation pipe enabled in `main.ts`

## Prerequisites

Before testing, ensure:

1. **Database is running** (via Docker Compose)
2. **Migrations have run** (password_hash column exists)
3. **Server is running** on port 3000
4. **TypeORM is configured** in AppModule

## Manual Testing Steps

### 1. Start the Database

```bash
cd infra
docker-compose up -d db
```

### 2. Run Migrations

If using Flyway or manual SQL:
```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
```

Or ensure the migration file `V3__add_password_hash.sql` has been executed.

### 3. Start the Server

```bash
cd backend
npm run start:dev
```

The server should start on `http://localhost:3000`

### 4. Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** `passwordHash` should NOT be in the response (excluded via `@Exclude()`)

### 5. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** for next steps:
```bash
TOKEN="your-token-here"
```

### 6. Test Protected Route (Without Token)

```bash
curl http://localhost:3000/api/auth/me
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 7. Test Protected Route (With Valid Token)

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 8. Test Invalid Token

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token-12345"
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 9. Test Duplicate Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User 2"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

### 10. Test Wrong Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

## Automated Testing

A test script is available at `backend/test-auth.sh`:

```bash
cd backend
./test-auth.sh
```

This script runs all the tests above automatically and provides colored output.

## Test Checklist

- [ ] Registration creates user with hashed password
- [ ] Login returns JWT token
- [ ] Protected route requires token (401 without token)
- [ ] Protected route works with valid token (200 with token)
- [ ] Invalid token returns 401
- [ ] Duplicate registration returns 409
- [ ] Wrong password returns 401
- [ ] Password hash is NOT returned in responses
- [ ] User object is attached to request in protected routes

## Troubleshooting

### Issue: "password_hash column does not exist"

**Solution:** Run the migration:
```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
```

### Issue: "Cannot connect to database"

**Solution:** 
1. Check Docker is running: `docker ps`
2. Check database is up: `docker-compose ps`
3. Verify connection settings in environment variables

### Issue: "401 Unauthorized" on login

**Possible causes:**
- User doesn't exist (register first)
- Wrong password
- Password hash not stored correctly

### Issue: "JWT secret not found"

**Solution:** Set `JWT_SECRET` environment variable or it will use default `'secret123'`

## Next Steps

After successful testing:

1. Add validation decorators to DTOs (class-validator)
2. Add rate limiting to prevent brute force attacks
3. Add refresh token mechanism
4. Add password reset functionality
5. Add email verification
