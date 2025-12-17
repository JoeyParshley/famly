# 🎓 Learning Guide: Converting Spring Boot to Node.js/NestJS

This guide will walk you through converting your Famly project from Spring Boot (Java) to NestJS (Node.js/TypeScript) step by step. Follow along and learn as you go!

## 📚 Prerequisites

Before starting, make sure you understand:
- **JavaScript/TypeScript basics** - Variables, functions, classes, async/await
- **Node.js fundamentals** - npm, package.json, modules
- **REST API concepts** - HTTP methods, status codes, JSON
- **Database basics** - SQL, relationships, migrations

## 🎯 Learning Objectives

By the end of this guide, you'll understand:
1. How to set up a NestJS project from scratch
2. How to configure TypeORM with PostgreSQL
3. How to create entities that match your existing database schema
4. How to structure a NestJS application (modules, controllers, services)
5. How to set up a React frontend with Vite
6. How to connect frontend to backend API

---

## 📋 Part 1: Understanding the Differences

### Spring Boot vs NestJS

| Concept | Spring Boot (Java) | NestJS (TypeScript) |
|---------|-------------------|---------------------|
| **Language** | Java | TypeScript/JavaScript |
| **Framework** | Spring Framework | NestJS |
| **Dependency Injection** | `@Autowired` | Constructor injection |
| **Controllers** | `@RestController` | `@Controller` |
| **Services** | `@Service` | `@Injectable()` |
| **ORM** | Spring Data JPA | TypeORM |
| **Configuration** | `application.yml` | `@nestjs/config` |
| **Validation** | Bean Validation | `class-validator` |

### Key Concepts to Learn

1. **TypeScript** - Type-safe JavaScript
2. **NestJS Modules** - Organize code into modules
3. **TypeORM** - Object-Relational Mapping for TypeScript
4. **Dependency Injection** - NestJS IoC container
5. **Decorators** - TypeScript/JavaScript decorators

---

## 🚀 Part 2: Setting Up NestJS Backend

### Step 1: Install NestJS CLI

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Verify installation
nest --version
```

**What you're learning:** NestJS CLI is a tool that helps scaffold NestJS projects, similar to Spring Initializr for Spring Boot.

### Step 2: Create NestJS Project

```bash
cd backend
nest new . --skip-git
```

**What happens:**
- Creates a new NestJS project structure
- Installs dependencies
- Sets up TypeScript configuration
- Creates basic app structure

**Files created:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `nest-cli.json` - NestJS CLI configuration
- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module

**Learning point:** NestJS uses a modular architecture. Everything is organized into modules, similar to Spring's component scanning.

### Step 3: Install Required Dependencies

```bash
npm install @nestjs/typeorm @nestjs/config typeorm pg
npm install class-validator class-transformer
npm install --save-dev @types/node
```

**What each package does:**
- `@nestjs/typeorm` - TypeORM integration for NestJS
- `@nestjs/config` - Configuration management
- `typeorm` - The ORM itself
- `pg` - PostgreSQL driver
- `class-validator` - Validation decorators
- `class-transformer` - Object transformation

**Learning point:** npm packages are like Maven dependencies in Java. They're declared in `package.json`.

### Step 4: Configure TypeORM

Create `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../infra/.env'],
    }),
    // Configure TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // We use migrations, not auto-sync
        logging: true, // Log SQL queries in development
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

**What you're learning:**
- `ConfigModule` - Loads environment variables (like `application.yml`)
- `TypeOrmModule` - Configures database connection
- `forRootAsync` - Async configuration (waits for ConfigService)
- `entities` - Tells TypeORM where to find entity classes

**Key difference from Spring Boot:**
- Spring Boot uses `application.yml` for configuration
- NestJS uses `@nestjs/config` with environment variables
- Both achieve the same goal: externalized configuration

---

## 🗄️ Part 3: Creating TypeORM Entities

### Step 5: Create Your First Entity (User)

Create `src/users/entities/user.entity.ts`:

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { HouseholdMember } from '../../households/entities/household-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => HouseholdMember, (member) => member.user)
  householdMembers: HouseholdMember[];
}
```

**What you're learning:**
- `@Entity('users')` - Maps to `users` table (like `@Entity` in JPA)
- `@PrimaryGeneratedColumn('uuid')` - Auto-generates UUID (like `@Id @GeneratedValue`)
- `@Column` - Maps to database column
- `@OneToMany` - Defines relationship (like `@OneToMany` in JPA)
- `@CreateDateColumn` - Automatically sets timestamp

**Compare to Spring Boot:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;
    
    @Column(unique = true)
    private String email;
    
    private String name;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**Exercise:** Create entities for:
- Household
- HouseholdMember
- Account
- Transaction
- Asset
- Debt
- Budget

**Hint:** Look at your existing `V1__init.sql` migration to understand the schema.

### Step 6: Create a Module for Each Entity

Create `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
```

**What you're learning:**
- `@Module` - Defines a module (like `@Component` in Spring)
- `TypeOrmModule.forFeature([User])` - Makes User repository available
- `exports` - Makes the module's features available to other modules

**Learning point:** NestJS uses modules to organize code. Each feature (Users, Accounts, etc.) has its own module.

---

## 🎮 Part 4: Creating Controllers and Services

### Step 7: Create a Health Check Controller

Create `src/health/health.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'UP' };
  }
}
```

**What you're learning:**
- `@Controller('health')` - Defines a controller with base path (like `@RestController` + `@RequestMapping`)
- `@Get()` - Handles GET requests (like `@GetMapping`)
- Returns JSON automatically (like Spring Boot's `@RestController`)

**Compare to Spring Boot:**
```java
@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping
    public Map<String, String> check() {
        return Map.of("status", "UP");
    }
}
```

### Step 8: Create a Module for Health

Create `src/health/health.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

### Step 9: Register Modules in AppModule

Update `src/app.module.ts`:

```typescript
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
// ... import other modules

@Module({
  imports: [
    // ... existing imports
    HealthModule,
    UsersModule,
    // ... other modules
  ],
})
export class AppModule {}
```

**Learning point:** Just like Spring Boot scans for `@Component`, NestJS requires you to explicitly import modules.

---

## 🚀 Part 5: Setting Up the Application

### Step 10: Configure Main Application

Update `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Automatically transform payloads
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
```

**What you're learning:**
- `NestFactory.create()` - Creates the NestJS application (like `SpringApplication.run()`)
- `enableCors()` - Allows frontend to make requests
- `ValidationPipe` - Validates incoming requests (like `@Valid` in Spring)
- `setGlobalPrefix()` - Adds `/api` to all routes

---

## 🎨 Part 6: Setting Up React Frontend

### Step 11: Create Vite React Project

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

**What happens:**
- Creates a React + TypeScript project
- Sets up Vite (fast build tool)
- Creates basic project structure

**Learning point:** Vite is like Maven/Gradle for frontend - it builds and serves your app, but much faster!

### Step 12: Install Frontend Dependencies

```bash
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install react-hook-form
```

**What each package does:**
- `@mui/material` - Material UI component library
- `react-router-dom` - Routing (like Spring MVC routing)
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client (like RestTemplate in Spring)
- `react-hook-form` - Form handling

### Step 13: Create Basic App Structure

Create `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';

const queryClient = new QueryClient();

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

**What you're learning:**
- `QueryClientProvider` - Provides React Query context (like dependency injection)
- `ThemeProvider` - Provides Material UI theme
- React's component tree structure

### Step 14: Create API Client

Create `src/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
```

**What you're learning:**
- `axios.create()` - Creates a configured HTTP client
- `import.meta.env` - Vite's way of accessing environment variables
- Similar to `RestTemplate` or `WebClient` in Spring Boot

---

## 🐳 Part 7: Docker Configuration

### Step 15: Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main.js"]
```

**What you're learning:**
- Multi-stage build - Reduces final image size
- `npm ci` - Clean install (faster, more reliable than `npm install`)
- `npm run build` - Compiles TypeScript to JavaScript
- Production dependencies only - Smaller image

**Compare to Spring Boot Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 16: Update docker-compose.yml

Update `infra/docker-compose.yml` backend service:

```yaml
backend:
  build:
    context: ../backend
  container_name: famly_backend
  depends_on:
    db:
      condition: service_healthy
  ports:
    - "8080:8080"
  environment:
    - POSTGRES_HOST=db
    - POSTGRES_PORT=5432
    - POSTGRES_USER=${POSTGRES_USER}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - POSTGRES_DB=${POSTGRES_DB}
    - NODE_ENV=production
    - PORT=8080
  networks:
    - famly_net
```

**What you're learning:**
- `POSTGRES_HOST=db` - Service name in Docker network
- Environment variables passed to container
- Same concept as Spring Boot, different variable names

---

## ✅ Part 8: Testing Your Setup

### Step 17: Test the Backend

```bash
# Start database
cd infra
docker compose up -d db pgadmin

# Start backend (in another terminal)
cd backend
npm install
npm run start:dev

# Test health endpoint
curl http://localhost:8080/api/health
# Should return: {"status":"UP"}
```

**What you're learning:**
- `npm run start:dev` - Starts in development mode with hot reload
- Similar to `./mvnw spring-boot:run` in Spring Boot

### Step 18: Test the Frontend

```bash
# Start frontend
cd frontend
npm install
npm run dev

# Open http://localhost:5173
```

---

## 📝 Part 9: Next Steps

### What to Build Next

1. **Create Services** - Business logic layer (like `@Service` in Spring)
2. **Add Controllers** - REST endpoints for each entity
3. **Implement Authentication** - JWT tokens (like Spring Security)
4. **Add Validation** - DTOs with `class-validator`
5. **Error Handling** - Global exception filters
6. **Testing** - Unit and integration tests

### Learning Resources

- **NestJS Docs:** https://docs.nestjs.com
- **TypeORM Docs:** https://typeorm.io
- **React Query Docs:** https://tanstack.com/query
- **Material UI Docs:** https://mui.com

### Common Patterns to Learn

1. **Repository Pattern** - TypeORM repositories
2. **DTO Pattern** - Data Transfer Objects
3. **Guards** - Authentication/authorization (like Spring Security)
4. **Interceptors** - Request/response transformation
5. **Pipes** - Input validation and transformation

---

## 🎓 Reflection Questions

After completing each step, ask yourself:

1. **How does this compare to Spring Boot?**
   - What's similar?
   - What's different?
   - Why might NestJS do it this way?

2. **What problems does this solve?**
   - Why use TypeORM instead of raw SQL?
   - Why use modules instead of flat structure?
   - Why use TypeScript instead of JavaScript?

3. **How would you explain this to someone?**
   - Can you explain dependency injection?
   - Can you explain the module system?
   - Can you explain TypeORM entities?

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Cannot find module '@nestjs/core'"
- **Solution:** Run `npm install` in the backend directory

**Issue:** "Database connection failed"
- **Solution:** Check that database is running: `docker compose ps`
- **Solution:** Verify environment variables in `infra/.env`

**Issue:** "Port 8080 already in use"
- **Solution:** Change port in `src/main.ts` or stop other services

**Issue:** "TypeORM entity not found"
- **Solution:** Check that entities are in the `entities` path in `app.module.ts`

---

## 📚 Additional Exercises

1. **Create a Users Service** - Add business logic for user operations
2. **Create a Users Controller** - Add CRUD endpoints
3. **Add Validation** - Use `class-validator` to validate DTOs
4. **Add Error Handling** - Create a global exception filter
5. **Add Logging** - Use NestJS logger
6. **Add Swagger** - API documentation with `@nestjs/swagger`

---

*Remember: The goal is to learn, not to finish quickly. Take your time, experiment, and understand each concept before moving on!*

