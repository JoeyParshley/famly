# Famly Project Learning Path

A comprehensive curriculum to learn full-stack development using the Famly Budget App as a practical reference.

## Course Overview

| Module | Topic | Estimated Time |
|--------|-------|----------------|
| 1 | [Database Fundamentals](./01-database-fundamentals.md) | 4-6 hours |
| 2 | [Backend Core with NestJS](./02-backend-core.md) | 4-6 hours |
| 3 | [GraphQL Implementation](./03-graphql-backend.md) | 5-7 hours |
| 4 | [React Fundamentals](./04-react-fundamentals.md) | 4-6 hours |
| 5 | [Next.js App Development](./05-nextjs-frontend.md) | 4-6 hours |
| 6 | [Apollo Client & GraphQL Frontend](./06-apollo-graphql-frontend.md) | 4-6 hours |
| 7 | [Real-World Application](./07-real-world-application.md) | 3-4 hours |

## Prerequisites

- Basic JavaScript/TypeScript knowledge
- Command line familiarity
- Git basics
- Code editor (VS Code recommended)

## How to Use These Lessons

1. **Read the concepts** - Understand the theory
2. **Examine the code** - Look at actual files referenced
3. **Run the examples** - Use Docker and npm commands
4. **Complete exercises** - Practice with suggested tasks
5. **Build something** - Apply knowledge to extend the app

## Project Setup

```bash
# Clone and setup
cd famly
docker-compose up -d db   # Start PostgreSQL
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

## Git History Reference

Use `git log --oneline` to see the progression of commits that built this application.
