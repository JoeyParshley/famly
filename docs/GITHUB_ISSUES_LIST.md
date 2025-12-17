# 📋 GitHub Issues for Spring Boot to NestJS Conversion

This document contains all the issues you should create in GitHub to track the conversion work. Each issue is structured with title, description, labels, and acceptance criteria.

## 🏷️ Recommended Labels

Create these labels first:
- `backend` - Backend work
- `frontend` - Frontend work
- `nestjs` - NestJS related
- `nodejs` - Node.js related
- `typescript` - TypeScript related
- `setup` - Initial setup tasks
- `entity` - Database entity work
- `api` - API endpoint work
- `docker` - Docker/containerization
- `documentation` - Documentation updates

## 📦 Phase 1: Backend Setup & Configuration

### Issue 1: Install and Set Up NestJS Project
**Title:** `[SETUP] Install NestJS CLI and create project structure`

**Description:**
```markdown
## Goal
Set up the NestJS project in the `backend/` directory.

## Tasks
- [ ] Install NestJS CLI globally: `npm install -g @nestjs/cli`
- [ ] Create NestJS project: `cd backend && nest new . --skip-git`
- [ ] Verify project structure is created correctly
- [ ] Test that `npm run start:dev` works

## Acceptance Criteria
- [ ] NestJS project is initialized in `backend/` directory
- [ ] `package.json`, `tsconfig.json`, and `nest-cli.json` exist
- [ ] Application starts without errors
- [ ] Basic "Hello World" endpoint is accessible

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 2, Step 1-2
```

**Labels:** `backend`, `nestjs`, `setup`

---

### Issue 2: Install Required Dependencies
**Title:** `[SETUP] Install TypeORM, Config, and Validation Dependencies`

**Description:**
```markdown
## Goal
Install all necessary npm packages for the NestJS backend.

## Tasks
- [ ] Install database packages: `@nestjs/typeorm`, `typeorm`, `pg`
- [ ] Install configuration: `@nestjs/config`
- [ ] Install validation: `class-validator`, `class-transformer`
- [ ] Install dev dependencies: `@types/node`

## Acceptance Criteria
- [ ] All packages are listed in `package.json`
- [ ] `npm install` completes without errors
- [ ] No dependency conflicts

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 2, Step 3
```

**Labels:** `backend`, `nestjs`, `setup`

---

### Issue 3: Configure TypeORM with PostgreSQL
**Title:** `[CONFIG] Set up TypeORM connection to PostgreSQL`

**Description:**
```markdown
## Goal
Configure TypeORM to connect to the existing PostgreSQL database.

## Tasks
- [ ] Configure `ConfigModule` in `app.module.ts`
- [ ] Configure `TypeOrmModule` with PostgreSQL connection
- [ ] Use environment variables from `infra/.env`
- [ ] Set `synchronize: false` (we use migrations)
- [ ] Enable SQL logging in development

## Acceptance Criteria
- [ ] Backend connects to database successfully
- [ ] Environment variables are loaded correctly
- [ ] TypeORM can query the database
- [ ] No connection errors in logs

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 2, Step 4
- Database connection details in `infra/.env`
```

**Labels:** `backend`, `nestjs`, `database`

---

### Issue 4: Configure Application Settings
**Title:** `[CONFIG] Set up CORS, validation, and API prefix`

**Description:**
```markdown
## Goal
Configure global application settings in `main.ts`.

## Tasks
- [ ] Enable CORS for frontend (localhost:5173)
- [ ] Set up global validation pipe
- [ ] Set global API prefix to `/api`
- [ ] Configure port (8080) from environment variable

## Acceptance Criteria
- [ ] CORS allows requests from frontend
- [ ] Validation pipe is active
- [ ] All routes are prefixed with `/api`
- [ ] Application starts on port 8080

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 5, Step 10
```

**Labels:** `backend`, `nestjs`, `config`

---

## 🗄️ Phase 2: Database Entities

### Issue 5: Create User Entity
**Title:** `[ENTITY] Create User entity with TypeORM`

**Description:**
```markdown
## Goal
Create the User entity matching the existing database schema.

## Tasks
- [ ] Create `src/users/entities/user.entity.ts`
- [ ] Map all columns from `users` table
- [ ] Set up relationships (OneToMany with HouseholdMember)
- [ ] Use UUID primary key
- [ ] Add `@CreateDateColumn` for timestamps

## Acceptance Criteria
- [ ] Entity matches database schema exactly
- [ ] All relationships are defined correctly
- [ ] TypeORM can query User entity
- [ ] Entity compiles without TypeScript errors

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 3, Step 5
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 6: Create Household Entity
**Title:** `[ENTITY] Create Household entity with relationships`

**Description:**
```markdown
## Goal
Create the Household entity with all relationships.

## Tasks
- [ ] Create `src/households/entities/household.entity.ts`
- [ ] Map all columns from `households` table
- [ ] Set up OneToMany relationships:
  - HouseholdMembers
  - Accounts
  - Assets
  - Debts
  - Budgets
- [ ] Use UUID primary key

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] All relationships are correctly defined
- [ ] Can query household with related entities

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 7: Create HouseholdMember Entity
**Title:** `[ENTITY] Create HouseholdMember join entity`

**Description:**
```markdown
## Goal
Create the HouseholdMember entity (many-to-many join table).

## Tasks
- [ ] Create `src/households/entities/household-member.entity.ts`
- [ ] Set up ManyToOne relationships to Household and User
- [ ] Add unique constraint on (household_id, user_id)
- [ ] Map foreign keys correctly

## Acceptance Criteria
- [ ] Entity represents the join table correctly
- [ ] Unique constraint prevents duplicate memberships
- [ ] Relationships work bidirectionally

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 8: Create Account Entity
**Title:** `[ENTITY] Create Account entity`

**Description:**
```markdown
## Goal
Create the Account entity with relationship to Household.

## Tasks
- [ ] Create `src/accounts/entities/account.entity.ts`
- [ ] Map all columns (id, household_id, name, type, balance)
- [ ] Set up ManyToOne relationship to Household
- [ ] Set up OneToMany relationship to Transactions
- [ ] Use numeric type for balance

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationships are correctly defined
- [ ] Can query account with transactions

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 9: Create Transaction Entity
**Title:** `[ENTITY] Create Transaction entity`

**Description:**
```markdown
## Goal
Create the Transaction entity.

## Tasks
- [ ] Create `src/transactions/entities/transaction.entity.ts`
- [ ] Map all columns (id, account_id, description, amount, category, occurred_on)
- [ ] Set up ManyToOne relationship to Account
- [ ] Use timestamptz for occurred_on

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationship to Account works
- [ ] Can query transactions by account

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 10: Create Asset Entity
**Title:** `[ENTITY] Create Asset entity`

**Description:**
```markdown
## Goal
Create the Asset entity.

## Tasks
- [ ] Create `src/assets/entities/asset.entity.ts`
- [ ] Map all columns (id, household_id, name, value, type)
- [ ] Set up ManyToOne relationship to Household
- [ ] Use numeric type for value

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationship to Household works

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 11: Create Debt Entity
**Title:** `[ENTITY] Create Debt entity`

**Description:**
```markdown
## Goal
Create the Debt entity.

## Tasks
- [ ] Create `src/debts/entities/debt.entity.ts`
- [ ] Map all columns (id, household_id, name, amount, type)
- [ ] Set up ManyToOne relationship to Household
- [ ] Use numeric type for amount

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationship to Household works

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

### Issue 12: Create Budget Entity
**Title:** `[ENTITY] Create Budget entity`

**Description:**
```markdown
## Goal
Create the Budget entity.

## Tasks
- [ ] Create `src/budgets/entities/budget.entity.ts`
- [ ] Map all columns (id, household_id, category, amount)
- [ ] Set up ManyToOne relationship to Household
- [ ] Use numeric type for amount

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationship to Household works

## References
- Database schema: `backend/src/main/resources/db/migration/V1__init.sql`
```

**Labels:** `backend`, `nestjs`, `entity`, `database`

---

## 🧩 Phase 3: Modules

### Issue 13: Create All Feature Modules
**Title:** `[MODULE] Create modules for all entities`

**Description:**
```markdown
## Goal
Create NestJS modules for each entity domain.

## Tasks
- [ ] Create `UsersModule`
- [ ] Create `HouseholdsModule`
- [ ] Create `AccountsModule`
- [ ] Create `TransactionsModule`
- [ ] Create `AssetsModule`
- [ ] Create `DebtsModule`
- [ ] Create `BudgetsModule`
- [ ] Register all modules in `AppModule`

## Acceptance Criteria
- [ ] All modules are created
- [ ] Each module imports `TypeOrmModule.forFeature([Entity])`
- [ ] All modules are registered in `AppModule`
- [ ] Application starts without errors

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 3, Step 6
```

**Labels:** `backend`, `nestjs`, `module`

---

## 🎮 Phase 4: Controllers & Services

### Issue 14: Create Health Check Endpoint
**Title:** `[API] Implement /api/health endpoint`

**Description:**
```markdown
## Goal
Create a health check endpoint to verify the API is running.

## Tasks
- [ ] Create `HealthController` with `@Controller('health')`
- [ ] Add `@Get()` method returning `{ status: 'UP' }`
- [ ] Create `HealthModule`
- [ ] Register `HealthModule` in `AppModule`
- [ ] Test endpoint: `curl http://localhost:8080/api/health`

## Acceptance Criteria
- [ ] GET `/api/health` returns `{"status":"UP"}`
- [ ] Endpoint is accessible without authentication
- [ ] Response is valid JSON

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 4, Step 7-9
```

**Labels:** `backend`, `nestjs`, `api`

---

## 🐳 Phase 5: Docker & Deployment

### Issue 15: Create Dockerfile for Backend
**Title:** `[DOCKER] Create multi-stage Dockerfile for NestJS backend`

**Description:**
```markdown
## Goal
Create a production-ready Dockerfile for the NestJS backend.

## Tasks
- [ ] Create multi-stage Dockerfile
- [ ] Build stage: Install dependencies and compile TypeScript
- [ ] Production stage: Copy only built files and production dependencies
- [ ] Expose port 8080
- [ ] Set CMD to run the application

## Acceptance Criteria
- [ ] Dockerfile builds successfully
- [ ] Image size is optimized (multi-stage build)
- [ ] Application runs in container
- [ ] Health endpoint works in container

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 7, Step 15
```

**Labels:** `backend`, `docker`, `deployment`

---

### Issue 16: Update Docker Compose Configuration
**Title:** `[DOCKER] Update docker-compose.yml for NestJS backend`

**Description:**
```markdown
## Goal
Update docker-compose.yml to work with NestJS backend.

## Tasks
- [ ] Update backend service to use new Dockerfile
- [ ] Add environment variables:
  - POSTGRES_HOST=db
  - POSTGRES_PORT=5432
  - NODE_ENV=production
  - PORT=8080
- [ ] Test: `docker compose up --build backend`

## Acceptance Criteria
- [ ] Backend container builds successfully
- [ ] Backend connects to database
- [ ] Health endpoint works
- [ ] All environment variables are set correctly

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 7, Step 16
```

**Labels:** `docker`, `infrastructure`

---

## 🎨 Phase 6: Frontend Setup

### Issue 17: Create React Frontend with Vite
**Title:** `[FRONTEND] Set up React + TypeScript + Vite project`

**Description:**
```markdown
## Goal
Create the React frontend application.

## Tasks
- [ ] Create Vite React project: `npm create vite@latest . -- --template react-ts`
- [ ] Install dependencies
- [ ] Verify project structure
- [ ] Test: `npm run dev`

## Acceptance Criteria
- [ ] React app is created in `frontend/` directory
- [ ] TypeScript is configured
- [ ] Development server starts on port 5173
- [ ] Basic "Hello World" renders

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 6, Step 11
```

**Labels:** `frontend`, `react`, `typescript`, `setup`

---

### Issue 18: Install Frontend Dependencies
**Title:** `[FRONTEND] Install Material UI, React Query, and other dependencies`

**Description:**
```markdown
## Goal
Install all necessary packages for the frontend.

## Tasks
- [ ] Install Material UI: `@mui/material`, `@emotion/react`, `@emotion/styled`
- [ ] Install icons: `@mui/icons-material`
- [ ] Install routing: `react-router-dom`
- [ ] Install state management: `@tanstack/react-query`
- [ ] Install HTTP client: `axios`
- [ ] Install forms: `react-hook-form`

## Acceptance Criteria
- [ ] All packages are installed
- [ ] No dependency conflicts
- [ ] `package.json` is updated

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 6, Step 12
```

**Labels:** `frontend`, `react`, `dependencies`

---

### Issue 19: Configure Frontend Application
**Title:** `[FRONTEND] Set up QueryClient, Theme, and API client`

**Description:**
```markdown
## Goal
Configure the frontend application structure.

## Tasks
- [ ] Set up `QueryClientProvider` in `main.tsx`
- [ ] Configure Material UI theme
- [ ] Create API client with Axios
- [ ] Configure Vite proxy for API calls
- [ ] Create basic `App.tsx` component

## Acceptance Criteria
- [ ] React Query is configured
- [ ] Material UI theme is set up
- [ ] API client can make requests to backend
- [ ] Vite proxy forwards `/api` requests to backend

## References
- See `docs/LEARNING_GUIDE_SPRING_TO_NODE.md` Part 6, Step 13-14
```

**Labels:** `frontend`, `react`, `config`

---

## ✅ Phase 7: Testing & Validation

### Issue 20: End-to-End Testing
**Title:** `[TEST] Verify full stack integration`

**Description:**
```markdown
## Goal
Verify that the entire stack works together.

## Tasks
- [ ] Start database: `docker compose up -d db`
- [ ] Start backend: `npm run start:dev` (in backend/)
- [ ] Start frontend: `npm run dev` (in frontend/)
- [ ] Test health endpoint from frontend
- [ ] Verify CORS is working
- [ ] Check browser console for errors

## Acceptance Criteria
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Frontend can call backend API
- [ ] No CORS errors
- [ ] Health endpoint returns correct response

## References
- See `docs/QUICK_START_CHECKLIST.md` Testing Checklist
```

**Labels:** `testing`, `integration`

---

## 📝 How to Use This List

### Option 1: Manual Creation
1. Go to your GitHub repository
2. Click "Issues" → "New Issue"
3. Copy the title and description from each issue above
4. Add the suggested labels
5. Create the issue

### Option 2: Automated Creation
Use the script: `scripts/create_conversion_issues.sh` (see below)

---

## 🎯 Milestones

Consider creating milestones:
- **Phase 1: Setup** - Issues 1-4
- **Phase 2: Entities** - Issues 5-12
- **Phase 3: Modules** - Issue 13
- **Phase 4: API** - Issue 14
- **Phase 5: Docker** - Issues 15-16
- **Phase 6: Frontend** - Issues 17-19
- **Phase 7: Testing** - Issue 20

---

*This list covers the basic conversion. Additional issues can be created for authentication, CRUD operations, and advanced features.*

