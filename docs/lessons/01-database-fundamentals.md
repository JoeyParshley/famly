# Module 1: Database Fundamentals

## Learning Objectives

By the end of this module, you will understand:
- Relational database concepts
- PostgreSQL setup and configuration
- Schema design and relationships
- Database migrations
- TypeORM entity mapping
- Monitoring and troubleshooting

---

## Lesson 1.1: Database Basics

### What is a Relational Database?

A relational database stores data in tables with rows and columns. Tables can reference each other through relationships (foreign keys).

### Key Concepts

| Term | Definition | Famly Example |
|------|------------|---------------|
| **Table** | Collection of related data | `users`, `accounts`, `transactions` |
| **Row** | Single record | One user, one transaction |
| **Column** | Attribute/field | `email`, `balance`, `amount` |
| **Primary Key** | Unique identifier | `id` (UUID in our case) |
| **Foreign Key** | Reference to another table | `household_id` in accounts |
| **Index** | Performance optimization | `idx_paydays_household_id` |

### PostgreSQL Data Types Used in Famly

```sql
-- From: backend/src/main/resources/db/migration/V1__init.sql

UUID                    -- Unique identifiers (36-char strings)
VARCHAR(255)            -- Variable-length text with max length
TEXT                    -- Unlimited text (passwords, descriptions)
NUMERIC(12,2)           -- Exact decimal (money: 12 digits, 2 decimal)
NUMERIC(6,4)            -- Interest rates (6 digits, 4 decimal places)
INTEGER                 -- Whole numbers (due day: 1-31)
DATE                    -- Calendar date only (payday next_date)
TIMESTAMPTZ             -- Timestamp with timezone (created_at)
```

### Exercise 1.1

Connect to the database and explore:
```bash
# Connect to PostgreSQL in Docker
docker exec -it famly_db psql -U famly -d famly

# List all tables
\dt

# Describe a table
\d users

# Exit
\q
```

---

## Lesson 1.2: Database Setup with Docker

### Why Docker for Databases?

- Consistent environment across machines
- Easy to reset/recreate
- No system-level installation required
- Version control of configuration

### Docker Compose Configuration

**File:** `infra/docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16
    container_name: famly_db
    environment:
      POSTGRES_DB: famly
      POSTGRES_USER: famly
      POSTGRES_PASSWORD: famly
    ports:
      - "5432:5432"      # host:container
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persist data
```

### Key Docker Commands

```bash
# Start database
docker-compose up -d db

# View logs
docker-compose logs -f db

# Stop database
docker-compose down

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d db
```

### Environment Configuration

**File:** `backend/.env`

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=famly
POSTGRES_USER=famly
POSTGRES_PASSWORD=famly
```

### Exercise 1.2

1. Start the database: `docker-compose up -d db`
2. Check it's running: `docker ps`
3. View connection logs: `docker-compose logs db`

---

## Lesson 1.3: Schema Design

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   users     │───────│ household_members│───────│  households │
└─────────────┘  1:M  └──────────────────┘  M:1  └─────────────┘
                              │                         │
                              │                    1:M  │
                              │                         ▼
┌─────────────────┐           │              ┌─────────────────┐
│ user_preferences│           │              │    accounts     │
└─────────────────┘           │              └─────────────────┘
       │ 1:1                  │                      │ 1:M
       ▼                      │                      ▼
┌─────────────┐               │              ┌─────────────────┐
│   users     │               │              │  transactions   │
└─────────────┘               │              └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   budgets   │       │    debts    │       │   paydays   │
└─────────────┘       └─────────────┘       └─────────────┘
```

### Relationship Types

**One-to-Many (1:M)**

A household has many accounts:

```sql
-- From V1__init.sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0
);
```

**Many-to-Many (M:N) via Junction Table**

Users can belong to multiple households, households have multiple users:

```sql
-- Junction table pattern
CREATE TABLE household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'view',
    UNIQUE(household_id, user_id)  -- Prevent duplicates
);
```

**One-to-One (1:1)**

Each user has one preference record:

```sql
-- From V4__roles_and_enhancements.sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'light'
);
```

### Exercise 1.3

Draw the relationship between `accounts` and `transactions`. What type is it?

---

## Lesson 1.4: Database Migrations

### What Are Migrations?

Migrations are versioned SQL scripts that evolve your database schema over time. They enable:
- Reproducible database setup
- Team collaboration
- Rollback capability
- Production deployments

### Migration Naming Convention

```
V{number}__{description}.sql

V1__init.sql                    # Initial schema
V2__seed_data.sql               # Demo data
V3__add_password_hash.sql       # Add column
V4__roles_and_enhancements.sql  # Feature expansion
V5__family_guy_demo.sql         # More demo data
```

### Migration Patterns

**Pattern 1: Create Tables (V1)**

```sql
-- backend/src/main/resources/db/migration/V1__init.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Pattern 2: Add Columns (V3, V4)**

```sql
-- backend/src/main/resources/db/migration/V3__add_password_hash.sql
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- V4 adds multiple columns
ALTER TABLE users ADD COLUMN is_demo BOOLEAN DEFAULT false;
ALTER TABLE accounts ADD COLUMN interest_rate NUMERIC(6,4) DEFAULT 0;
```

**Pattern 3: Add Constraints (V4)**

```sql
-- Add check constraint for valid roles
ALTER TABLE household_members
ADD CONSTRAINT chk_role CHECK (role IN ('view', 'edit', 'admin'));
```

**Pattern 4: Create Indexes (V4)**

```sql
-- Optimize queries by household
CREATE INDEX idx_paydays_household_id ON paydays(household_id);

-- Optimize date range queries
CREATE INDEX idx_paydays_next_date ON paydays(next_date);
```

**Pattern 5: Seed Data (V2, V5)**

```sql
-- backend/src/main/resources/db/migration/V5__family_guy_demo.sql

-- Insert with fixed UUIDs for testing
INSERT INTO users (id, email, name, password_hash, is_demo) VALUES
('d0000001-0000-0000-0000-000000000001', 'peter@famly-demo.com', 'Peter Griffin',
 '$2b$10$...', true)
ON CONFLICT DO NOTHING;  -- Idempotent: safe to run multiple times
```

### Running Migrations

```bash
# Run migration manually
docker exec -i famly_db psql -U famly -d famly < backend/src/main/resources/db/migration/V4__roles_and_enhancements.sql

# Check current schema
docker exec -it famly_db psql -U famly -d famly -c "\dt"
```

### Exercise 1.4

Create a new migration `V6__add_notes_to_transactions.sql` that adds a `notes` column to the transactions table.

---

## Lesson 1.5: TypeORM Entity Mapping

### What is an ORM?

Object-Relational Mapping (ORM) bridges the gap between database tables and programming objects. TypeORM is the ORM we use with NestJS.

### Entity Decorators

**File:** `backend/src/accounts/entities/account.entity.ts`

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('accounts')  // Maps to 'accounts' table
export class Account {
  @PrimaryGeneratedColumn('uuid')  // Auto-generated UUID
  id: string;

  @Column()  // VARCHAR(255) by default
  name: string;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ nullable: true })  // Optional field
  institution?: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })  // Foreign key column name
  household: Household;

  @CreateDateColumn({ name: 'created_at' })  // Auto-set on insert
  createdAt: Date;
}
```

### Relationship Decorators

```typescript
// One-to-Many: Household -> Accounts
@Entity('households')
export class Household {
  @OneToMany(() => Account, account => account.household)
  accounts: Account[];
}

// Many-to-One: Account -> Household
@Entity('accounts')
export class Account {
  @ManyToOne(() => Household)
  @JoinColumn({ name: 'household_id' })
  household: Household;
}

// One-to-One: User -> UserPreference
@Entity('user_preferences')
export class UserPreference {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### TypeORM Configuration

**File:** `backend/src/app.module.ts`

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Auto-discover
    synchronize: false,  // Use migrations, not auto-sync
    logging: process.env.NODE_ENV === 'development',
  }),
}),
```

### Exercise 1.5

Look at `backend/src/transactions/entities/transaction.entity.ts`. Identify:
1. What columns does it have?
2. What relationship does it have?
3. What is the foreign key column name?

---

## Lesson 1.6: Database Monitoring

### Viewing Database Activity

```bash
# Check active connections
docker exec -it famly_db psql -U famly -d famly -c "SELECT * FROM pg_stat_activity WHERE datname = 'famly';"

# Check table sizes
docker exec -it famly_db psql -U famly -d famly -c "
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
"

# Count rows per table
docker exec -it famly_db psql -U famly -d famly -c "
SELECT 'users' as table_name, count(*) FROM users
UNION SELECT 'households', count(*) FROM households
UNION SELECT 'accounts', count(*) FROM accounts
UNION SELECT 'transactions', count(*) FROM transactions;
"
```

### TypeORM Query Logging

Enable in development to see generated SQL:

```typescript
// app.module.ts
logging: process.env.NODE_ENV === 'development',
```

This outputs queries like:
```sql
query: SELECT "account"."id", "account"."name", "account"."balance"
       FROM "accounts" "account"
       WHERE "account"."household_id" = $1
```

---

## Lesson 1.7: Troubleshooting Common Issues

### Problem: Cannot Connect to Database

```bash
# Check if container is running
docker ps | grep famly_db

# Check container logs
docker-compose logs db

# Verify port is available
lsof -i :5432
```

### Problem: Migration Fails

```bash
# Check current tables
docker exec -it famly_db psql -U famly -d famly -c "\dt"

# Check if column already exists
docker exec -it famly_db psql -U famly -d famly -c "\d users"

# Drop and recreate (development only!)
docker-compose down -v
docker-compose up -d db
# Re-run all migrations
```

### Problem: Column Does Not Exist

This usually means migrations haven't been run:

```bash
# Error: column "is_demo" does not exist
# Solution: Run the migration that adds it
docker exec -i famly_db psql -U famly -d famly < backend/src/main/resources/db/migration/V4__roles_and_enhancements.sql
```

### Problem: Unique Constraint Violation

```sql
-- Error: duplicate key value violates unique constraint
-- Solution: Use ON CONFLICT
INSERT INTO users (email, name) VALUES ('test@test.com', 'Test')
ON CONFLICT (email) DO NOTHING;  -- Skip if exists
-- OR
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;  -- Update if exists
```

### Problem: Foreign Key Violation

```sql
-- Error: insert or update violates foreign key constraint
-- Cause: Referenced record doesn't exist
-- Solution: Insert parent record first, or check your IDs
```

---

## Module Summary

### Key Takeaways

1. **Tables store data** - Design them with appropriate columns and types
2. **Relationships connect tables** - Use foreign keys (1:M, M:N, 1:1)
3. **Migrations version your schema** - Never manually modify production databases
4. **TypeORM maps tables to classes** - Decorators define the mapping
5. **Docker simplifies setup** - Consistent environment for development

### Files to Study

| File | Concepts |
|------|----------|
| `infra/docker-compose.yml` | Docker setup |
| `backend/.env` | Connection config |
| `V1__init.sql` | Schema creation |
| `V4__roles_and_enhancements.sql` | Schema evolution |
| `account.entity.ts` | TypeORM mapping |
| `app.module.ts` | TypeORM config |

### Practice Exercises

1. Create a migration to add a `tags` column (array) to transactions
2. Add an index on `transactions.category`
3. Create an entity for a new `goals` table
4. Query all transactions over $100 using psql

---

**Next Module:** [Backend Core with NestJS](./02-backend-core.md)
