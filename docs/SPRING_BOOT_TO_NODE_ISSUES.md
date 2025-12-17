# 🎯 Issues Needed to Convert Spring Boot to Node.js (NestJS)

This document lists all the issues you need to create to complete the migration from Spring Boot to NestJS.

## ✅ Already Completed (Based on Project Status)

- ✅ NestJS project initialization
- ✅ TypeORM entities matching database schema (all 8 entities exist)
- ✅ Module structure (all modules created)
- ✅ Health check endpoint (`/api/health`)
- ✅ Docker configuration
- ✅ Database connection (TypeORM + PostgreSQL)
- ✅ Frontend setup (React + Vite + TypeScript)

---

## 📋 Issues to Create

### 🔐 Phase 1: Authentication & Security

#### Issue 1: Implement JWT Authentication
**Title:** `[AUTH] Implement JWT authentication to replace Spring Security`

**Description:**
```markdown
## Goal
Replace Spring Security with NestJS JWT authentication.

## Current State
- Spring Boot has `SecurityConfig.java` that permits all requests
- No authentication is currently implemented in NestJS

## Tasks
- [ ] Install dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `@types/bcrypt`, `@types/passport-jwt`
- [ ] Create `AuthModule` with JWT configuration
- [ ] Create `AuthService` with:
  - `register()` method (hash password with bcrypt)
  - `login()` method (validate credentials, return JWT)
  - `validateUser()` method
- [ ] Create `JwtStrategy` using `@nestjs/passport`
- [ ] Create `JwtAuthGuard` for protecting routes
- [ ] Create `AuthController` with:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login (returns JWT)
  - `GET /api/auth/me` - Get current user (protected)
- [ ] Add password field to User entity (if not already present)
- [ ] Create DTOs: `RegisterDto`, `LoginDto`, `AuthResponseDto`

## Acceptance Criteria
- [ ] Users can register with email and password
- [ ] Users can login and receive JWT token
- [ ] `/api/auth/me` requires valid JWT token
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Passwords are hashed with bcrypt (never stored in plain text)

## References
- Spring Boot equivalent: `backend/src/main/java/com/famly/config/SecurityConfig.java`
- See `docs/NODEJS_MIGRATION.md` for migration strategy
```

**Labels:** `backend`, `nestjs`, `auth`, `security`, `api`

---

#### Issue 2: Add Password Field to User Entity
**Title:** `[ENTITY] Add password field to User entity for authentication`

**Description:**
```markdown
## Goal
Add password field to User entity to support authentication.

## Tasks
- [ ] Add `password` column to User entity (hashed, not plain text)
- [ ] Create migration to add password column to database (or update V1 if not deployed)
- [ ] Update User entity TypeScript class
- [ ] Ensure password is excluded from JSON responses (use `@Exclude()` decorator)

## Acceptance Criteria
- [ ] User entity has password field
- [ ] Password is never returned in API responses
- [ ] Database migration runs successfully

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`, `auth`

---

### 🎮 Phase 2: Core API Controllers & Services

#### Issue 3: Implement Users API
**Title:** `[API] Implement Users controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Users.

## Tasks
- [ ] Create `UsersService` with:
  - `findAll()` - Get all users (paginated)
  - `findOne(id)` - Get user by ID
  - `findByEmail(email)` - Find user by email
  - `update(id, updateDto)` - Update user
  - `remove(id)` - Delete user
- [ ] Create `UsersController` with:
  - `GET /api/users` - List all users (paginated)
  - `GET /api/users/:id` - Get user by ID
  - `PATCH /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
- [ ] Create DTOs: `CreateUserDto`, `UpdateUserDto`, `UserResponseDto`
- [ ] Add validation using `class-validator`
- [ ] Add error handling (user not found, etc.)

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Validation is applied to all inputs
- [ ] Proper HTTP status codes are returned
- [ ] Error messages are clear and helpful
- [ ] Password is never returned in responses

## References
- Entity: `backend/src/users/entities/user.entity.ts`
- Module: `backend/src/users/users.module.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`

---

#### Issue 4: Implement Households API
**Title:** `[API] Implement Households controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Households.

## Tasks
- [ ] Create `HouseholdsService` with:
  - `create(createDto, userId)` - Create household and add creator as member
  - `findAll(userId)` - Get all households for a user
  - `findOne(id, userId)` - Get household by ID (verify user is member)
  - `update(id, updateDto, userId)` - Update household
  - `remove(id, userId)` - Delete household
  - `addMember(householdId, userId, memberUserId)` - Add member to household
  - `removeMember(householdId, userId, memberUserId)` - Remove member
- [ ] Create `HouseholdsController` with:
  - `POST /api/households` - Create household
  - `GET /api/households` - List user's households
  - `GET /api/households/:id` - Get household details
  - `PATCH /api/households/:id` - Update household
  - `DELETE /api/households/:id` - Delete household
  - `POST /api/households/:id/members` - Add member
  - `DELETE /api/households/:id/members/:memberId` - Remove member
- [ ] Create DTOs: `CreateHouseholdDto`, `UpdateHouseholdDto`, `HouseholdResponseDto`
- [ ] Add authorization checks (users can only access their households)

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Users can only access households they're members of
- [ ] Household members are properly managed
- [ ] Validation is applied

## References
- Entity: `backend/src/households/entities/household.entity.ts`
- Join entity: `backend/src/households/entities/household-member.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`, `authorization`

---

#### Issue 5: Implement Accounts API
**Title:** `[API] Implement Accounts controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Accounts.

## Tasks
- [ ] Create `AccountsService` with:
  - `create(createDto, userId)` - Create account (verify user has access to household)
  - `findAll(householdId, userId)` - Get all accounts for a household
  - `findOne(id, userId)` - Get account by ID (verify access)
  - `update(id, updateDto, userId)` - Update account
  - `remove(id, userId)` - Delete account
  - `calculateBalance(accountId)` - Calculate current balance from transactions
- [ ] Create `AccountsController` with:
  - `POST /api/accounts` - Create account
  - `GET /api/accounts` - List accounts (filter by household)
  - `GET /api/accounts/:id` - Get account details
  - `PATCH /api/accounts/:id` - Update account
  - `DELETE /api/accounts/:id` - Delete account
  - `GET /api/accounts/:id/balance` - Get calculated balance
- [ ] Create DTOs: `CreateAccountDto`, `UpdateAccountDto`, `AccountResponseDto`
- [ ] Add validation for account types (bank, credit, investment)

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Users can only access accounts in their households
- [ ] Balance calculation works correctly
- [ ] Account types are validated

## References
- Entity: `backend/src/accounts/entities/account.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`, `authorization`

---

#### Issue 6: Implement Transactions API
**Title:** `[API] Implement Transactions controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Transactions with pagination and filtering.

## Tasks
- [ ] Create `TransactionsService` with:
  - `create(createDto, userId)` - Create transaction (verify account access)
  - `findAll(accountId, filters, pagination, userId)` - Get transactions with filtering
  - `findOne(id, userId)` - Get transaction by ID
  - `update(id, updateDto, userId)` - Update transaction
  - `remove(id, userId)` - Delete transaction
  - `updateAccountBalance(accountId)` - Recalculate account balance after transaction
- [ ] Create `TransactionsController` with:
  - `POST /api/transactions` - Create transaction
  - `GET /api/transactions` - List transactions (with pagination, filtering by account, date range, category)
  - `GET /api/transactions/:id` - Get transaction details
  - `PATCH /api/transactions/:id` - Update transaction
  - `DELETE /api/transactions/:id` - Delete transaction
- [ ] Create DTOs: `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionResponseDto`, `TransactionQueryDto`
- [ ] Add pagination (page, limit)
- [ ] Add filtering (by account, date range, category)
- [ ] Update account balance when transactions are created/updated/deleted

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Pagination works (default: 20 per page)
- [ ] Filtering by account, date range, and category works
- [ ] Account balances are updated automatically
- [ ] Users can only access transactions in their accounts

## References
- Entity: `backend/src/transactions/entities/transaction.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`, `pagination`, `filtering`

---

#### Issue 7: Implement Debts API
**Title:** `[API] Implement Debts controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Debts.

## Tasks
- [ ] Create `DebtsService` with:
  - `create(createDto, userId)` - Create debt
  - `findAll(householdId, userId)` - Get all debts for a household
  - `findOne(id, userId)` - Get debt by ID
  - `update(id, updateDto, userId)` - Update debt
  - `remove(id, userId)` - Delete debt
- [ ] Create `DebtsController` with:
  - `POST /api/debts` - Create debt
  - `GET /api/debts` - List debts (filter by household)
  - `GET /api/debts/:id` - Get debt details
  - `PATCH /api/debts/:id` - Update debt
  - `DELETE /api/debts/:id` - Delete debt
- [ ] Create DTOs: `CreateDebtDto`, `UpdateDebtDto`, `DebtResponseDto`

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Users can only access debts in their households
- [ ] Validation is applied

## References
- Entity: `backend/src/debts/entities/debt.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`

---

#### Issue 8: Implement Assets API
**Title:** `[API] Implement Assets controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Assets.

## Tasks
- [ ] Create `AssetsService` with:
  - `create(createDto, userId)` - Create asset
  - `findAll(householdId, userId)` - Get all assets for a household
  - `findOne(id, userId)` - Get asset by ID
  - `update(id, updateDto, userId)` - Update asset
  - `remove(id, userId)` - Delete asset
- [ ] Create `AssetsController` with:
  - `POST /api/assets` - Create asset
  - `GET /api/assets` - List assets (filter by household)
  - `GET /api/assets/:id` - Get asset details
  - `PATCH /api/assets/:id` - Update asset
  - `DELETE /api/assets/:id` - Delete asset
- [ ] Create DTOs: `CreateAssetDto`, `UpdateAssetDto`, `AssetResponseDto`

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Users can only access assets in their households
- [ ] Validation is applied

## References
- Entity: `backend/src/assets/entities/asset.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`

---

#### Issue 9: Implement Budgets API
**Title:** `[API] Implement Budgets controller and service with CRUD operations`

**Description:**
```markdown
## Goal
Create full CRUD API for Budgets.

## Tasks
- [ ] Create `BudgetsService` with:
  - `create(createDto, userId)` - Create budget
  - `findAll(householdId, userId)` - Get all budgets for a household
  - `findOne(id, userId)` - Get budget by ID
  - `update(id, updateDto, userId)` - Update budget
  - `remove(id, userId)` - Delete budget
  - `calculateBudgetVsActual(budgetId, month, year)` - Compare budget to actual spending
- [ ] Create `BudgetsController` with:
  - `POST /api/budgets` - Create budget
  - `GET /api/budgets` - List budgets (filter by household)
  - `GET /api/budgets/:id` - Get budget details
  - `GET /api/budgets/:id/analysis` - Get budget vs actual analysis
  - `PATCH /api/budgets/:id` - Update budget
  - `DELETE /api/budgets/:id` - Delete budget
- [ ] Create DTOs: `CreateBudgetDto`, `UpdateBudgetDto`, `BudgetResponseDto`, `BudgetAnalysisDto`

## Acceptance Criteria
- [ ] All CRUD endpoints work correctly
- [ ] Users can only access budgets in their households
- [ ] Budget vs actual calculation works
- [ ] Validation is applied

## References
- Entity: `backend/src/budgets/entities/budget.entity.ts`
```

**Labels:** `backend`, `nestjs`, `api`, `crud`, `calculations`

---

### 🛠️ Phase 3: Infrastructure & Quality

#### Issue 10: Add Global Error Handling
**Title:** `[INFRA] Implement global exception filter and error handling`

**Description:**
```markdown
## Goal
Add consistent error handling across the application.

## Tasks
- [ ] Create `HttpExceptionFilter` using `@Catch()` decorator
- [ ] Handle common exceptions:
  - `NotFoundException` - 404
  - `UnauthorizedException` - 401
  - `ForbiddenException` - 403
  - `BadRequestException` - 400
  - `ValidationException` - 400 (from class-validator)
- [ ] Create consistent error response format:
  ```json
  {
    "statusCode": 404,
    "message": "Resource not found",
    "error": "Not Found",
    "timestamp": "2025-01-15T10:30:00Z"
  }
  ```
- [ ] Register filter globally in `main.ts`
- [ ] Add logging for errors

## Acceptance Criteria
- [ ] All errors return consistent format
- [ ] Proper HTTP status codes are used
- [ ] Validation errors are properly formatted
- [ ] Errors are logged appropriately

## References
- NestJS documentation on exception filters
```

**Labels:** `backend`, `nestjs`, `infrastructure`, `error-handling`

---

#### Issue 11: Add API Documentation with Swagger
**Title:** `[DOCS] Add Swagger/OpenAPI documentation`

**Description:**
```markdown
## Goal
Generate interactive API documentation.

## Tasks
- [ ] Install dependencies: `@nestjs/swagger`, `swagger-ui-express`
- [ ] Configure Swagger in `main.ts`:
  - Title: "Famly API"
  - Description: "Household budgeting and debt management API"
  - Version: "1.0"
  - Add JWT bearer auth
- [ ] Add `@ApiTags()` to all controllers
- [ ] Add `@ApiOperation()`, `@ApiResponse()`, `@ApiParam()` decorators
- [ ] Add `@ApiProperty()` to all DTOs
- [ ] Test Swagger UI at `/api/docs`

## Acceptance Criteria
- [ ] Swagger UI is accessible at `/api/docs`
- [ ] All endpoints are documented
- [ ] Request/response schemas are shown
- [ ] Can test endpoints from Swagger UI
- [ ] JWT authentication works in Swagger

## References
- NestJS Swagger documentation
```

**Labels:** `backend`, `nestjs`, `documentation`, `swagger`, `api`

---

#### Issue 12: Add Input Validation
**Title:** `[INFRA] Add comprehensive input validation using class-validator`

**Description:**
```markdown
## Goal
Ensure all API inputs are properly validated.

## Tasks
- [ ] Add validation decorators to all DTOs:
  - `@IsEmail()`, `@IsNotEmpty()`, `@IsString()`, `@IsNumber()`, `@IsUUID()`, `@IsEnum()`, etc.
  - `@Min()`, `@Max()`, `@Length()` for constraints
- [ ] Ensure global validation pipe is configured in `main.ts`
- [ ] Create custom validators if needed (e.g., unique email)
- [ ] Test validation with invalid inputs

## Acceptance Criteria
- [ ] All DTOs have appropriate validation
- [ ] Invalid inputs return 400 with clear error messages
- [ ] Validation errors are formatted consistently

## References
- class-validator documentation
```

**Labels:** `backend`, `nestjs`, `validation`, `infrastructure`

---

#### Issue 13: Add Integration Tests
**Title:** `[TEST] Write integration tests for API endpoints`

**Description:**
```markdown
## Goal
Add integration tests to verify API functionality.

## Tasks
- [ ] Set up test database configuration
- [ ] Create test utilities (test user creation, JWT token generation)
- [ ] Write tests for:
  - Authentication endpoints (register, login)
  - Users CRUD
  - Households CRUD
  - Accounts CRUD
  - Transactions CRUD
  - Authorization checks (users can't access others' data)
- [ ] Use `@nestjs/testing` and `supertest`
- [ ] Set up test database migrations

## Acceptance Criteria
- [ ] All major endpoints have integration tests
- [ ] Tests verify both success and error cases
- [ ] Authorization is tested
- [ ] Tests run in CI/CD pipeline

## References
- NestJS testing documentation
```

**Labels:** `backend`, `nestjs`, `testing`, `integration-tests`

---

### 🧹 Phase 4: Cleanup & Migration Completion

#### Issue 14: Remove Spring Boot Code
**Title:** `[CLEANUP] Remove Spring Boot files after migration is complete`

**Description:**
```markdown
## Goal
Remove all Spring Boot code once NestJS migration is verified complete.

## Tasks
- [ ] Verify all Spring Boot functionality is implemented in NestJS
- [ ] Remove Spring Boot files:
  - `backend/pom.xml`
  - `backend/mvnw`, `backend/mvnw.cmd`
  - `backend/.mvn/` directory
  - `backend/src/main/java/` (all Java files)
  - `backend/src/test/java/` (Java test files)
  - `backend/src/main/resources/application.properties`
  - `backend/src/main/resources/application.yml` (if not needed)
- [ ] Update `.gitignore` to remove Java-specific ignores
- [ ] Update `README.md` to remove Spring Boot references
- [ ] Commit: `chore: remove Spring Boot code after NestJS migration`

## Acceptance Criteria
- [ ] All Spring Boot files are removed
- [ ] NestJS backend still works correctly
- [ ] Documentation is updated
- [ ] No references to Spring Boot remain in codebase

## References
- See `docs/NODEJS_MIGRATION.md` for files to remove
```

**Labels:** `backend`, `cleanup`, `migration`

---

## 📊 Summary

**Total Issues:** 14

**By Phase:**
- Phase 1 (Authentication): 2 issues
- Phase 2 (Core APIs): 7 issues
- Phase 3 (Infrastructure): 4 issues
- Phase 4 (Cleanup): 1 issue

**Priority Order:**
1. **High Priority** (Must have for MVP):
   - Issue 1: JWT Authentication
   - Issue 2: Password field
   - Issue 3-6: Core APIs (Users, Households, Accounts, Transactions)
   - Issue 10: Error handling

2. **Medium Priority** (Important for production):
   - Issue 7-9: Remaining APIs (Debts, Assets, Budgets)
   - Issue 11: Swagger documentation
   - Issue 12: Input validation

3. **Lower Priority** (Nice to have):
   - Issue 13: Integration tests
   - Issue 14: Cleanup

---

## 🚀 How to Create These Issues

### Option 1: Manual Creation
Copy each issue title and description into GitHub Issues.

### Option 2: Use GitHub CLI
You can use the existing script pattern from `scripts/create_conversion_issues.sh` to automate creation.

### Option 3: Bulk Creation Script
I can create a script to generate all these issues automatically. Would you like me to create that?

---

*This list focuses on what's actually needed to complete the migration, based on the current project state.*
