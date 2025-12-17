# ✅ Quick Start Checklist: Spring Boot to NestJS Conversion

Use this checklist to track your progress as you convert the project.

## 📋 Pre-Conversion Checklist

- [ ] Understand current Spring Boot structure
- [ ] Review database schema (`V1__init.sql`)
- [ ] Understand existing entities and relationships
- [ ] Have Node.js 20+ installed
- [ ] Have npm installed

## 🎯 Backend Conversion Steps

### Setup
- [ ] Install NestJS CLI: `npm install -g @nestjs/cli`
- [ ] Create NestJS project in `backend/` directory
- [ ] Install dependencies: `@nestjs/typeorm`, `@nestjs/config`, `typeorm`, `pg`
- [ ] Install validation: `class-validator`, `class-transformer`

### Configuration
- [ ] Configure `ConfigModule` in `app.module.ts`
- [ ] Configure `TypeOrmModule` with PostgreSQL connection
- [ ] Set up environment variables (use existing `infra/.env`)
- [ ] Configure CORS in `main.ts`
- [ ] Set global API prefix to `/api`

### Entities
- [ ] Create `User` entity
- [ ] Create `Household` entity
- [ ] Create `HouseholdMember` entity
- [ ] Create `Account` entity
- [ ] Create `Transaction` entity
- [ ] Create `Asset` entity
- [ ] Create `Debt` entity
- [ ] Create `Budget` entity
- [ ] Verify all relationships are correct

### Modules
- [ ] Create `UsersModule`
- [ ] Create `HouseholdsModule`
- [ ] Create `AccountsModule`
- [ ] Create `TransactionsModule`
- [ ] Create `AssetsModule`
- [ ] Create `DebtsModule`
- [ ] Create `BudgetsModule`
- [ ] Create `HealthModule`
- [ ] Register all modules in `AppModule`

### Controllers & Services
- [ ] Create `HealthController` with `/health` endpoint
- [ ] Test health endpoint: `curl http://localhost:8080/api/health`

### Docker
- [ ] Create `Dockerfile` for backend
- [ ] Update `docker-compose.yml` backend service
- [ ] Test: `docker compose up --build backend`

## 🎨 Frontend Setup Steps

### Setup
- [ ] Create Vite React project in `frontend/` directory
- [ ] Install dependencies: MUI, React Router, TanStack Query, Axios
- [ ] Configure TypeScript

### Configuration
- [ ] Set up `QueryClientProvider` in `main.tsx`
- [ ] Configure Material UI theme
- [ ] Create API client with Axios
- [ ] Configure Vite proxy for API calls

### Basic Structure
- [ ] Create basic `App.tsx` component
- [ ] Set up React Router
- [ ] Create home page
- [ ] Test frontend: `npm run dev`

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] Health endpoint returns `{"status":"UP"}`
- [ ] Frontend starts without errors
- [ ] Frontend can call backend API
- [ ] CORS is working (no errors in browser console)

## 📝 Next Steps (After Basic Setup)

- [ ] Implement authentication (JWT)
- [ ] Create services for business logic
- [ ] Add CRUD endpoints for each entity
- [ ] Add validation with DTOs
- [ ] Add error handling
- [ ] Add logging
- [ ] Write tests

---

**Tip:** Check off items as you complete them. Don't rush - understanding each step is more important than speed!

