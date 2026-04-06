# Module 7: Real-World Application

## Learning Objectives

By the end of this module, you will understand:
- How all the pieces fit together
- Development workflow
- Debugging techniques
- Deployment considerations
- Extending the application

---

## Lesson 7.1: Full-Stack Architecture

### How Famly Works

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌─────────┐    ┌──────────┐    ┌─────────────────────┐   │
│  │ Next.js │ ─► │  React   │ ─► │  Apollo Client      │   │
│  │  Pages  │    │Components│    │  (GraphQL queries)  │   │
│  └─────────┘    └──────────┘    └──────────┬──────────┘   │
└────────────────────────────────────────────┼───────────────┘
                                             │
                        HTTP (GraphQL) ──────┘
                                             │
┌────────────────────────────────────────────▼───────────────┐
│                        BACKEND                              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐   │
│  │   NestJS    │ ─► │   GraphQL    │ ─► │  Services   │   │
│  │   Server    │    │   Resolvers  │    │  (Business) │   │
│  └─────────────┘    └──────────────┘    └──────┬──────┘   │
│                                                 │          │
│                              ┌──────────────────┘          │
│                              ▼                             │
│                     ┌────────────────┐                     │
│                     │    TypeORM     │                     │
│                     │  (Entities)    │                     │
│                     └───────┬────────┘                     │
└─────────────────────────────┼──────────────────────────────┘
                              │
                         SQL Queries
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                      PostgreSQL                             │
│        (Tables: users, households, accounts, ...)          │
└────────────────────────────────────────────────────────────┘
```

### Request Flow Example

**User views dashboard:**

```
1. Browser loads /dashboard
2. Next.js renders DashboardPage component
3. useGetDashboardSummaryQuery executes
4. Apollo sends GraphQL query to /graphql
5. NestJS receives request
6. GqlAuthGuard validates JWT token
7. DashboardResolver.dashboardSummary() called
8. AnalyticsService aggregates data from:
   - AccountsService.findAll()
   - TransactionsService.findAll()
9. TypeORM executes SQL queries
10. PostgreSQL returns data
11. Data flows back up the stack
12. Apollo caches response
13. React renders UI
```

---

## Lesson 7.2: Development Workflow

### Starting the Project

```bash
# Terminal 1: Start database
cd famly/infra
docker-compose up -d db

# Terminal 2: Start backend
cd famly/backend
npm install
npm run start:dev  # http://localhost:3000

# Terminal 3: Start frontend
cd famly/frontend
npm install
npm run dev        # http://localhost:3001
```

### Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| GraphQL Playground | http://localhost:3000/graphql |
| Database | localhost:5432 |

### Making Changes

**Adding a new feature:**

1. **Database** - Create migration if needed
   ```bash
   # Write V6__add_goals.sql
   docker exec -i famly_db psql -U famly -d famly < migration.sql
   ```

2. **Backend Entity** - Define TypeORM entity
   ```typescript
   // backend/src/goals/entities/goal.entity.ts
   @Entity('goals')
   export class Goal { ... }
   ```

3. **Backend Service** - Add business logic
   ```typescript
   // backend/src/goals/goals.service.ts
   @Injectable()
   export class GoalsService { ... }
   ```

4. **Backend GraphQL** - Add types and resolver
   ```typescript
   // backend/src/goals/graphql/goal.model.ts
   // backend/src/goals/graphql/goals.resolver.ts
   ```

5. **Frontend Operations** - Write GraphQL queries
   ```graphql
   # frontend/src/graphql/goals.graphql
   query GetGoals { ... }
   ```

6. **Frontend Codegen** - Generate hooks
   ```bash
   npm run codegen
   ```

7. **Frontend Components** - Build UI
   ```tsx
   // frontend/src/app/(dashboard)/goals/page.tsx
   ```

---

## Lesson 7.3: Debugging

### Backend Debugging

**NestJS Logging:**
```typescript
// Enable in development
logging: process.env.NODE_ENV === 'development',

// Manual logging
console.log('Creating transaction:', createDto);
```

**GraphQL Playground:**
```graphql
# Test queries directly
query {
  accounts(householdId: "d0000001-...") {
    id
    name
  }
}

# With auth header
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Database Queries:**
```bash
docker exec -it famly_db psql -U famly -d famly

# View recent transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;

# Check account balances
SELECT name, balance FROM accounts;
```

### Frontend Debugging

**Apollo DevTools:**
1. Install Apollo Client Devtools browser extension
2. Open browser DevTools > Apollo tab
3. View cache, queries, mutations

**React DevTools:**
1. Install React Developer Tools extension
2. Inspect component tree
3. View props and state

**Network Tab:**
1. Open DevTools > Network
2. Filter by "graphql"
3. Inspect request/response payloads

### Common Issues

**CORS Error:**
```
Access to fetch at 'http://localhost:3000/graphql' blocked by CORS
```
**Fix:** Ensure backend CORS is configured for frontend URL.

**401 Unauthorized:**
```
GraphQL error: Unauthorized
```
**Fix:** Check JWT token exists and isn't expired.

**Database Column Missing:**
```
QueryFailedError: column "is_demo" does not exist
```
**Fix:** Run the migration that adds the column.

**TypeScript Error After Schema Change:**
```
Property 'newField' does not exist on type 'Account'
```
**Fix:** Regenerate GraphQL types with `npm run codegen`.

---

## Lesson 7.4: Testing

### Backend Unit Tests

```typescript
// backend/src/accounts/accounts.service.spec.ts
describe('AccountsService', () => {
  let service: AccountsService;
  let repository: MockRepository<Account>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: getRepositoryToken(Account), useClass: MockRepository },
      ],
    }).compile();

    service = module.get(AccountsService);
    repository = module.get(getRepositoryToken(Account));
  });

  it('should calculate summary correctly', async () => {
    repository.find.mockResolvedValue([
      { type: 'checking', balance: 1000 },
      { type: 'credit', balance: -500 },
    ]);

    const summary = await service.getSummary('household-1');

    expect(summary.totalBalance).toBe(500);
    expect(summary.totalAssets).toBe(1000);
    expect(summary.totalLiabilities).toBe(500);
  });
});
```

### Frontend Component Tests

```tsx
// frontend/src/components/__tests__/AccountCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AccountCard } from '../AccountCard';

describe('AccountCard', () => {
  it('displays account name and balance', () => {
    const account = {
      id: '1',
      name: 'Checking',
      balance: 1234.56,
      type: 'checking',
    };

    render(<AccountCard account={account} />);

    expect(screen.getByText('Checking')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });
});
```

### E2E Testing

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('user can view dashboard', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'peter@famly-demo.com');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  // Verify dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Total Balance')).toBeVisible();
});
```

---

## Lesson 7.5: Deployment

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose Production:**
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: famly
      POSTGRES_USER: famly
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      POSTGRES_HOST: db
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_GRAPHQL_URL: http://backend:3000/graphql
    depends_on:
      - backend
```

### Environment Variables

**Production checklist:**
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `POSTGRES_PASSWORD` to secure password
- [ ] Configure `NODE_ENV=production`
- [ ] Set appropriate `CORS_ORIGIN`
- [ ] Disable GraphQL Playground in production

---

## Lesson 7.6: Extending Famly

### Exercise: Add a Goals Feature

**Requirements:**
- Users can set savings goals with target amounts
- Track progress toward each goal
- Display progress on dashboard

**Steps:**

1. **Create migration:**
```sql
-- V6__add_goals.sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount NUMERIC(12,2) NOT NULL,
    current_amount NUMERIC(12,2) DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

2. **Create entity:**
```typescript
// backend/src/goals/entities/goal.entity.ts
@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('numeric', { precision: 12, scale: 2 })
  targetAmount: number;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'date', nullable: true })
  targetDate?: Date;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

3. **Create GraphQL types:**
```typescript
// backend/src/goals/graphql/goal.model.ts
@ObjectType()
export class GoalModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  targetAmount: number;

  @Field(() => Float)
  currentAmount: number;

  @Field(() => Float)
  progressPercentage: number;

  @Field({ nullable: true })
  targetDate?: Date;
}
```

4. **Create resolver:**
```typescript
// backend/src/goals/graphql/goals.resolver.ts
@Resolver(() => GoalModel)
export class GoalsResolver {
  constructor(private goalsService: GoalsService) {}

  @Query(() => [GoalModel])
  @UseGuards(GqlAuthGuard)
  async goals(
    @Args('householdId', { type: () => ID }) householdId: string,
  ) {
    return this.goalsService.findAll(householdId);
  }

  @Mutation(() => GoalModel)
  @UseGuards(GqlAuthGuard)
  async createGoal(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('input') input: CreateGoalInput,
  ) {
    return this.goalsService.create(householdId, input);
  }
}
```

5. **Create frontend:**
```graphql
# frontend/src/graphql/goals.graphql
query GetGoals($householdId: ID!) {
  goals(householdId: $householdId) {
    id
    name
    targetAmount
    currentAmount
    progressPercentage
    targetDate
  }
}

mutation CreateGoal($householdId: ID!, $input: CreateGoalInput!) {
  createGoal(householdId: $householdId, input: $input) {
    id
    name
  }
}
```

6. **Build the page:**
```tsx
// frontend/src/app/(dashboard)/goals/page.tsx
'use client';

import { useGetGoalsQuery, useCreateGoalMutation } from '@/generated/graphql';

export default function GoalsPage() {
  const { data, loading } = useGetGoalsQuery({ ... });
  // Build UI
}
```

---

## Lesson 7.7: Best Practices Summary

### Database
- Use migrations, never manual changes
- Add indexes for frequently queried columns
- Use appropriate data types (NUMERIC for money)
- Always include created_at timestamps

### Backend
- Keep services focused on single responsibility
- Validate all input with DTOs
- Handle errors with appropriate HTTP/GraphQL codes
- Use guards for authentication/authorization

### GraphQL
- Keep resolvers thin, delegate to services
- Use field resolvers for nested data
- Return appropriate types (connections for lists)
- Document schema with descriptions

### Frontend
- Use generated hooks for type safety
- Handle loading, error, and empty states
- Keep components small and focused
- Use contexts for shared state

### General
- Write tests for critical paths
- Use environment variables for config
- Keep secrets out of code
- Document as you go

---

## Final Project

Build a new feature for Famly:

**Option 1: Recurring Transactions**
- Schedule transactions to repeat
- Auto-create transactions on schedule
- Display upcoming transactions

**Option 2: Budget Alerts**
- Set spending thresholds per category
- Send notifications when approaching limit
- Dashboard widget for budget status

**Option 3: Family Sharing**
- Invite family members via email
- Role-based permissions
- Activity feed of changes

---

## Conclusion

You've learned the complete stack:

1. **Database** - PostgreSQL, migrations, TypeORM
2. **Backend** - NestJS, services, validation
3. **GraphQL** - Types, resolvers, authentication
4. **React** - Components, hooks, context
5. **Next.js** - Routing, layouts, SSR
6. **Apollo** - Queries, mutations, caching

The Famly codebase is your reference implementation. Study it, modify it, and build upon it. The patterns you've learned here apply to any modern full-stack application.

Happy coding!
