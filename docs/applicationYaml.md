# Application.yml
`application.yml` is used by **Spring Boot** to configure various aspects of the application, including database connections, server ports, logging and more. Its an alternative to using `application.properties` 

## How to know what to put in `application.yml`
You determin what to put into `application.yml` based on:
1. The dependencies in your Spring Boot Project
2. The configuration keys provided by Spring Boot and libraries used in application
3. The runtime environment (e.g. databse hostname, credentials, ports)

## 📦 Basic Example: application.yml for Connecting to Postgres in Docker

📁 backend/src/main/resources/application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://db:5432/famly
    username: ${POSTGRES_USER}
    password: ${POSTGRES_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration

```
Explanation:
- jdbc:postgresql://db:5432/famly -- db is the Docker Compose service name not local host
- ${POSTGRES_USER} -- resolves from environment variables or application.properties (or .env if injected)
- ddl-auto: validate -- prevents schema auto creation and forces schema match (good for Flyway setups)
- flyway-locations -- looks in src/main/resources/db/resources/migration for Flyway SQL files

## 🛠 How to Find Valid Keys
1. Spring Boot Docs: e.g., spring.datasource., spring.jpa, etc
2. IDE Autocomplete
3. External Libraries you use (like Flyway, Swagger) oftten document their own confug options.
