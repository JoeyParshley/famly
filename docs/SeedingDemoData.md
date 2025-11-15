# Seeding Demo Data
Here are the steps needed to seed sample data into the PostgeSQL database using Flyway migration (e.g `V2__seed_data.sql`)
`Homer` and `Marge` are the users.

1. 🗂️Create the Flyway migration fly `V2__seed_data.sql` in `src/main/resources/db/migration`
2. 🧑‍🤝‍🧑Add the SQL statements to teh migration file
```sql
-- Home Simpson
INSERT INTO users (id, name, email, created_at)
VALUES (gen_random_uuid(), 'Homer Simpson', 'homer@famly.com', now());

-- Marge Simpson
INSERT INTO users (id, name, email, created_at)
VALUES (gen_random_uuid(), 'Marge Simpson', 'marge@famly.com', now());
```
3. 🏡Insert Household
```sql
INSERT INTO households (id, name, created_at)
VALUES (gen_random_uuid(), 'The Simpsons', now());
```
4. Link users to households via household_members
```sql
-- Homer
INSERT INTO household_members (id, household_id, user_id, created_at)
SELECT gen_random_uuid(), h.id, u.id, now()
FROM households h, users u
WHERE h.name = 'The Simpsons' AND u.email = 'homer@famly.com';

-- Marge
INSERT INTO household_members (id, household_id, user_id, created_at)
SELECT gen_random_uuid(), h.id, u.id, now()
FROM households h, users u
WHERE h.name = 'The Simpsons' AND u.email = 'marge@famly.com';
```
6. Build the Backend with Flyway migration included
```bash
cd ../backend
./mvnw clean package -DskipTests
```
7. Restart your Containers to apply `V2`
```bash
cd ../infra
docker compose down 
docker compose up -- build
```