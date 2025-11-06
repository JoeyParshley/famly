# Flyway and Migrations
Flyway scans `classpath:db/migration` by default. This normally maps to `

`backend/src/main/resources/db/migration`

## What is Flyway
Flyway is a Database migration tool used to manage version-controlled schema changes. It integrates with Spring Boot and
runs migrations automatically when the application starts.

## Migration File Structure

- All SQL Migration files should live in `backend/src/main/resources/db/migration`
- Filenames follow the convention: V<version>__<description>.sql 
  - Examples:
    - V1__init.sql
    - V2__add_users_table.sql

## How Flyway Works

- On application start up, Flyway looks at the migration folder and compares available migrations with the flyway_schema_history table in the table
- It applies new migratios in version order (V1, V2, ...)
- Each migration is recorded so it will not run again

## When to add a new Migration

- Anytime the databse schema changes: new tables, columns, constraints, indexes, or seed dates,
- Do not modify old migration files after they have been applied in any environment. create new versioned ones instead

## Testing Migrations

Migrations can be verified that they have been run by:

- inspecting the flyway_schema_history_table:
`docker exec -it famly_db psql -U famly -d famly c "SELECT * FROM flyway_schema_history;"`
- Checking for schema/data updates in pdAdmin or via psql:
`docker exec -it famly_db psql -U famly -d famly -c "\dt"`
`docker exec -it famly_db psql -U famly -d famly -c "SELECT * FROM <table_name>;"`

## Best Practices
- Write migrations in pure SQL (not Java based migrations)
- Use descriptive names: V3__create_auth_tables_.sql is beter than V3__update1.sql
- Keep migrations idempotent when possible (avoid DROP of CREATE IF NOT EXISTS unless you understand implications)
- avoid midifying old migrations -- add new ones instead

## Warnings

- Flyway does not reverse migrations; if you delete a migration file or change its version / content after its been run, it will cause problems
- Always test migrations locally in Docker before pushing

## Making sure Spring Boot is configured to auto-run Flyway migrations on startup
- This usually true by default but check `application.properties` or `application.yml`

```properties
# src/main/resources/applications.properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
```


