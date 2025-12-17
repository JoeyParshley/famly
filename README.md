# 🩵 Famly

> **Smart money for every household.**

Famly is a modern full-stack **household budgeting and debt management** application built with **Spring Boot**, **React**, and **PostgreSQL**.  
It helps families track budgets, connect to financial institutions, and forecast debt payoff dates — all with a sleek, startup-style UI powered by **MUI**, **React Hook Form**, and **TanStack Query/Table**.

## 🗂 Project Board
Track progress and milestones on GitHub Projects:  
👉 [Famly Roadmap](https://github.com/<your-username>/famly/projects)

## 🎓 Converting to Node.js?

**Learning Guide Available!** If you're converting this project from Spring Boot to NestJS, check out:
- **[LEARNING_GUIDE_SPRING_TO_NODE.md](./docs/LEARNING_GUIDE_SPRING_TO_NODE.md)** - Step-by-step tutorial
- **[QUICK_START_CHECKLIST.md](./docs/QUICK_START_CHECKLIST.md)** - Progress tracker


---

## 🧭 Project Overview

Famly brings clarity and collaboration to personal and household finance:

- 📊 **Track your spending** across multiple accounts and categories
- 🧾 **Build monthly budgets** and see planned vs actual progress
- 💳 **Link bank and debt accounts** (via secure third-party providers like Plaid)
- 📈 **Predict debt payoff dates** with snowball or avalanche strategies
- 🔁 **Stay in sync** with real-time data and smart transaction categorization
- 🧑‍💻 **Explore safely** with built-in demo data (no real credentials needed)

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Backend** | Spring Boot 3 (Java 17) | REST API, domain logic |
| | Spring Security + JWT | Auth, token management |
| | Spring Data JPA + Flyway | ORM, migrations |
| | PostgreSQL | Relational data store |
| **Frontend** | React 18 + TypeScript + Vite | UI framework |
| | Material UI (MUI) | Design system |
| | React Hook Form | Form validation & control |
| | TanStack React Query | Server state management |
| | TanStack Table v8 | Data tables & grids |
| **Infra** | Docker Compose | Local orchestration |
| | pgAdmin (optional) | DB UI |
| | Makefile / Scripts | Convenience commands |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- Docker and Docker Compose
- npm or yarn

### Quick Start

1. **Set up environment variables** (if not already done):
   ```bash
   cd infra
   # Create .env file with:
   # POSTGRES_DB=famly
   # POSTGRES_USER=famly
   # POSTGRES_PASSWORD=your_password
   # PGADMIN_DEFAULT_EMAIL=admin@famly.com
   # PGADMIN_DEFAULT_PASSWORD=admin
   ```

2. **Start the database and backend**:
   ```bash
   cd infra
   docker compose up -d db pgadmin
   ```

3. **Set up and run the backend**:
   ```bash
   cd ../backend
   npm install
   npm run start:dev
   ```

4. **Set up and run the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - Health Check: http://localhost:8080/api/health
   - pgAdmin: http://localhost:5050

### Database Migrations

The database schema is managed via Flyway migrations located in `backend/src/main/resources/db/migration/`. These migrations are automatically applied when the database container starts. The existing migrations (V1__init.sql and V2__seed_data.sql) will create the schema and seed demo data.

---

## 🧩 Repository Layout

```
famly/
├── backend/              # NestJS backend API
│   ├── src/
│   │   ├── main.ts       # Application entry point
│   │   ├── app.module.ts # Root module
│   │   └── [modules]/    # Feature modules
│   ├── package.json
│   └── Dockerfile
├── frontend/             # React frontend
│   ├── src/
│   │   ├── app/          # App component and routing
│   │   ├── features/     # Feature modules
│   │   ├── components/   # Reusable components
│   │   └── api/          # API client
│   ├── package.json
│   └── vite.config.ts
├── infra/                # Infrastructure
│   ├── docker-compose.yml
│   └── .env              # Environment variables
├── docs/                 # Documentation
│   ├── PROJECT_STATUS.md # Current project status
│   ├── INTERVIEW_NOTES.md # Interview talking points
│   └── GITHUB_PROJECTS_SETUP.md # Project management guide
└── scripts/              # Utility scripts
```

---

## 📚 Documentation

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current status, completed features, and roadmap
- **[INTERVIEW_NOTES.md](./docs/INTERVIEW_NOTES.md)** - Interview talking points and common questions
- **[GITHUB_PROJECTS_SETUP.md](./docs/GITHUB_PROJECTS_SETUP.md)** - Guide for managing GitHub Projects
- **[NODEJS_MIGRATION.md](./docs/NODEJS_MIGRATION.md)** - Migration notes from Spring Boot to NestJS
- **[Famly_Project_Checklist.md](./docs/Famly_Project_Checklist.md)** - Detailed roadmap and checklist

---

## 🎯 Project Status

**Current Phase:** Backend structure complete, implementing core APIs

**Completed:**
- ✅ Infrastructure setup (Docker, PostgreSQL)
- ✅ NestJS backend structure
- ✅ TypeORM entities matching database schema
- ✅ React frontend setup
- ✅ Health check endpoint

**In Progress:**
- 🔄 Authentication implementation
- 🔄 CRUD operations for core entities

**See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed status.**

---

## 🤝 Contributing

This is a personal project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 🔗 Quick Links

- **Backend README:** [backend/README.md](./backend/README.md)
- **Frontend README:** [frontend/README.md](./frontend/README.md)
- **Project Status:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Interview Guide:** [docs/INTERVIEW_NOTES.md](./docs/INTERVIEW_NOTES.md)

---

*Built with ❤️ for learning and demonstrating full-stack development skills*
