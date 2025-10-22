# Flyway migragtions
**Flyway** is a **database migration** tool that keeps your database schema (tables, constraints, indexes, data, etc) in synch when you code.

It is built into Spring Boot (via the `flyway-core` dependency)

Every time you change teh database, you **record that change in a migration file** instead of manually running SQL commands.

Then Flyway:

1. Applies new migrations in order
2. Tracks which ones have already run, and
3. Ensures all environments (local, staging and production) have the same schema

## How Migrations are Organized
By default migrations live here:
`src/main/resources/db/migrations/`

Each migration follows the naming convention:

`V<version>__<desription>.sql`

for example 
```sql
V1__init.sql
V2__add_budgets_table.sql
V3__add_indexes_to_transactions.sql
```

### Rules
- `V` prefix = Versioned migration
- Double underscores `**` separate version and description
- Versions are applied in order (1, 2, 3, ...)
- Once applied you should _never_ modify and existing file -- always create a new one.

## How Flyway Works Under The Hood
When Spring Boot starts:
1. It connects to your database
2. Checks for a table named `flyway_schema_history`
   - if it doesnt exist Flyway creates it
3. Scans `classpath: db/migration` for migrations that have not run yet
4. Executes them in version order
5. Records each migrations version, checksum and timestamp in `flyway_schema_history`

**Example contents of that table**

| **installed** | **version** | **description**   | **type** | **intalled_on** |
|---------------|-------------|-------------------|----------|-----------------|
| 1             | 1           | init              | SQL      |2025-10-19 11:24:32
| 2             | 2           | add budgets table | SQL      |2025-10-21 08:42:17

**Example Migration File**
`V2__add_budgets_table.sql`
```sql
create table if not exists budgets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  month      date not null,
  category   text not null,
  planned    numeric(14,2) not null default 0,
  notes      text,
  unique (user_id, month, category)
);

```
When you restart your app, Flyway see "V2" hasnt been applied yet, executes and and marks it as complete.



