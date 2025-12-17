# 🧭 Famly Project Roadmap & Progress Tracker
> **Project Board Link (replace once created):**
> https://github.com/users/JoeyParshley/projects/1

**Goal:** Build a full-stack household budgeting app (Famly) using  
🧩 **NestJS (Node.js)** + PostgreSQL (backend)  
⚛️ React + MUI + TanStack Query/Table + React Hook Form (frontend)  
🔐 with secure user auth, bank/debt integration stubs, and predictive features.

> **Note:** This project was migrated from Spring Boot to NestJS. See [NODEJS_MIGRATION.md](./NODEJS_MIGRATION.md) for details.

---

## 🏁 Phase 0 – Planning & Setup (Pre-Development)
_(Pre-Development: establishes repo + workflow before coding begins)_
**Objective:** Prepare environment and repo.

### ✅ Tasks
- [x] Create GitHub repo `famly`
- [x] Set up local directory structure:
  ```
  famly/
    ├── backend/
    ├── frontend/
    ├── infra/
    ├── docs/
    ├── .github/
    | └── workflows/
    ├── .gitignore
    ├── README.md
    └── LICENSE

    
  ```
- [x] Add `.gitignore` for Java, Node, Docker
- [x] Initialize `README.md` with project overview
- [x] Create a new GitHub project board for tracking tasks

### 🧩 Notes
- Decide on Java version (recommend 21)
- Use Maven wrapper (`./mvnw`)
- Use Docker Compose for PostgreSQL + pgAdmin

⏱️ *Estimated time:* 1–2 hours

---

## 🧱 Phase 1 – Infrastructure Setup
**Objective:** Get your database + environment running.

### ✅ Tasks
- [x] Create `infra/docker-compose.yml`
    - Postgres
    - pgAdmin
- [x] Add `.env` file (POSTGRES_DB, USER, PASSWORD)
- [x] Test with:
  ```bash
  docker compose up -d
  docker exec -it famly_db psql -U famly -d famly -c "select 1;"
  ```
- [x] Connect pgAdmin to verify DB visibility
- [x] Commit as `infra(db): set up Postgres + pgAdmin with Docker Compose`

### 🧩 Notes
- Keep Flyway migrations under `backend/src/main/resources/db/migration`
- Learn about `.env` file and Docker Compose service linking (`db` hostname)

⏱️ *Estimated time:* 1 day

---

## ⚙️ Phase 2 – Backend Initialization
**Objective:** Create a working NestJS API connected to Postgres.

### ✅ Tasks
- [x] Generate NestJS project (`nest new`)
    - Dependencies: `@nestjs/typeorm`, `@nestjs/config`, `pg`, `typeorm`
- [x] Configure TypeORM with PostgreSQL
- [x] Add `V1__init.sql` migration (existing from Spring Boot setup)
- [x] Verify database connection and tables exist
- [x] Add `/api/health` endpoint
- [x] Create TypeORM entities matching database schema
- [x] Set up module structure
- [ ] Add authentication middleware
- [ ] Commit: `feat(api): complete NestJS backend setup`

### 🧩 Notes
- Learn: `@Controller`, `@Module`, `@Entity`, TypeORM basics
- Use `db` hostname in Docker, `localhost` when running locally
- TypeORM entities match existing Flyway migrations

⏱️ *Estimated time:* 1–2 days

---

## 🔐 Phase 3 – Authentication & Security
**Objective:** Secure the backend and support user registration/login.

### ✅ Tasks
- [x] Create `User` entity (TypeORM) - ✅ Already exists
- [ ] Add password hashing (bcrypt)
- [ ] Create `/api/auth/register` and `/api/auth/login` endpoints
- [ ] Add `AuthController` + DTOs (`LoginDto`, `RegisterDto`, etc.)
- [ ] Issue JWT tokens on login using `@nestjs/jwt`
- [ ] Add JWT guard + strategy using `@nestjs/passport`
- [ ] Add protected endpoint `/api/me`
- [ ] Test with curl (no JWT → 401, JWT → 200)
- [ ] Commit: `feat(auth): add JWT authentication and /api/me`

### 🧩 Notes
- Learn: NestJS guards, Passport strategies, JWT basics, bcrypt
- Use Postman or Curl to test token flow
- Similar concepts to Spring Security but NestJS implementation

⏱️ *Estimated time:* 2–3 days

---

## 💾 Phase 4 – Core Domain Models
**Objective:** Build main Famly entities and APIs.

### ✅ Entities
- [ ] `Accounts`
- [ ] `Transactions`
- [ ] `Debts`
- [ ] `Budgets`
- [ ] `BudgetRules`

### ✅ Tasks
- [x] Database schema already exists (V1__init.sql) - ✅ Complete
- [x] Create TypeORM entities for all core models - ✅ Complete
- [ ] Create services and controllers for each entity
- [ ] Add CRUD endpoints for Accounts
- [ ] Add `/api/transactions` read endpoint (paginated)
- [ ] Use DTOs to decouple entity from JSON payload
- [ ] Commit: `feat(api): add core domain models and CRUD endpoints`

### 🧩 Notes
- Use DTOs to decouple entity from JSON payload
- Learn pagination with TypeORM `take` and `skip`
- Use `class-validator` for input validation

⏱️ *Estimated time:* 3–5 days

---

## 🧩 Phase 5 – Frontend Setup (React)
**Objective:** Build a working UI and connect to backend.

### ✅ Tasks
- [ ] Create React app with Vite (`pnpm create vite`)
- [ ] Install dependencies:
  ```bash
  @mui/material @emotion/react @emotion/styled
  @tanstack/react-query @tanstack/react-table
  react-hook-form axios react-router-dom
  ```
- [ ] Add `QueryClientProvider`
- [ ] Build `/health` check page
- [ ] Add Register + Login pages
- [ ] Save JWT in memory or localStorage
- [ ] Test `/api/me` authenticated request
- [ ] Commit: `feat(frontend): bootstrap React + MUI + React Query`

### 🧩 Notes
- Learn: React Query basics, controlled forms, JWT storage
- Keep environment variables in `.env` (VITE_API_URL)

⏱️ *Estimated time:* 3–5 days

---

## 💡 Phase 6 – POC Completion
**Objective:** Demonstrate end-to-end functionality.

### ✅ Deliverables
- ✅ Register/login works
- ✅ JWT-protected `/api/me` endpoint works
- ✅ User can create/view accounts
- ✅ DB migrations + data flow work end-to-end
- ✅ Health checks + Swagger docs ready

**Commit:** `release(poc): Famly backend + frontend MVP`

⏱️ *Estimated total time for POC:* ~2–3 weeks (solo dev, part-time)

---

## 📚 Phase 7 – Documentation & Interview Readiness
**Objective:** Turn this into a showcase project.

### ✅ Tasks
- [ ] Write `README.md` with:
    - Project overview
    - Tech stack
    - Architecture diagram
    - Setup instructions
    - Key learning points
- [ ] Add `/docs/Architecture.md` (diagrams, decisions)
- [ ] Add `/docs/Notes.md` (concepts you learned)
- [ ] Create screenshots or screen recording of app in action
- [ ] Commit: `docs: add architecture and learning documentation`

### 🧩 Notes
- Use Mermaid diagrams for architecture
- Practice explaining:
    - Why Flyway
    - Why JWT
    - Why TanStack Query
    - Database relationships

---

# 🗒️ Learning Notes Section

| Date | Topic | Summary / Key Concepts |
|------|--------|------------------------|
| 2025-10-22 | Flyway | How versioned migrations keep schema in sync |
| 2025-10-23 | JWT | Stateless authentication with HMAC-signed tokens |
| … | … | … |

---

# 🧩 Progress Summary

| Area | Status | Notes |
|------|---------|-------|
| Infrastructure | ✅ | DB and Docker running |
| Backend Health Check | ✅ | `/api/health` returns 200 |
| Auth (BCrypt + JWT) | ⬜ | In progress |
| Core Entities | ⬜ | Planned |
| Frontend | ⬜ | Planned |
| Docs | ⬜ | Planned |

---

## 🎯 Target: Proof of Concept (POC)
**Goal:**  
Working backend + minimal frontend that lets a demo user:
- Register/login
- View or create an account
- Add a sample transaction

**Expected duration:** ~2–3 weeks (working 1–2 hrs/day)  
If full-time: ~4–5 days.
