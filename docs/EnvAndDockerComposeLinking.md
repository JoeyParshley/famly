# .env file and Docker Compose service linking

## 🧾 .env file
The `.env file` is used to define environment variables that can loaded into the app or **Docker Compose**
Its commonly used to store secrete and config like:

```bash
POSTGRES_USER=famly
POSTGRES_PASSWORD=secret123
POSTGRES_DB=famly
```

## 🐳 How Docker Compose uses  the `.env`
Docker Compose will automatically load the `.env` in the same directory as your `docker-compose.yml`

Example docker-compose.yml:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```
Can also pass in a different `.env` file
```bash
docker compose --env-file my.env up
```

## 🔗 How Service Linking Works in Compose
When you define multiple services in a Compose file, they are automatically places in the same Docker network. Each sercice can connect to another by using the service name as the hostname.

Example:

```yaml
service:
  backend:
    build: ./backend
    environment:
      DB_HOST: db
      DB_PORT: 5432
    depends_on:
      - db
  db:
    image: postgres:16

```
Your backend can connect to to Postgres using host db (not localhost or 127.0.0.1) because Docker sets up internal DNS

## ✅ Backedn Spring Boot Application (Example)
Your `application.yml` or `application.properties` should use:

application.yml:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://db:5432/famly
    username: ${POSTGRES_USER}
    password: ${POSTGRES_PASSWORD}
```
Or if using .env loaded at runtime, make sure to export the envs  and launch the app.
