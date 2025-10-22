# Entity's And Repository's

## Entities -- What your Data Looks Like
Am **entity** is a Java class that represents a table in your database.
Each instance of that class corresponds to a row in the table.

Spring (through **JPA** the Java Persistence API) takes care of mapping between your class and the SQL table.

### Example: `User` entity

```java
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity                         // Marks this class as a JPA entity (a DB table)
@Table(name = "users")          // Optional: specify table name
public class User {

    @Id                         // Marks the primary key column
    @Column(columnDefinition="uuid")
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public User() {}            // JPA needs a no-arg constructor
    public User(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Getters/setters...
}

```
### How it Maps

| **Java Field** | **SQL Column** | **Type**     | **Notes**          |
|----------------|----------------|--------------|--------------------|
| `id`           | `id`           | `uuid`       | Primary Key        |
| `email`        | `email`        | `text`       | Unique             |
| `passwordHash` | `password_Hash` | `text`       | Encrypted password |
| `createdAt`     | `created_at`    | `timestamptz` | Default `now()`     |

When you run your app, JPA will automatically map queries, inserts and updates to this table

## Repositorys -- How you talk to the database
A **repository** is a Spring Data interface that gives you CRUD to an entity **without writing any SQL**

Repository = Database Access layer

You extend one of Spring's base interfaces (like `JpaRepository`) and it automatically generates SQL

### Example: `UserRepository`

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public  interface  UserRepository extends JpaRepository<User, UUID> {
    
    // Spring will automatically implement these for you
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### What it Gives You Automatically

| *Method*                    | *Description*         | *SQL Equivalent*                        |
|-----------------------------|-----------------------|-----------------------------------------|
| `save(user)`                | insert or udate a row | `INSERT INTO users ...` or `UPDATE ...` |
| `findById(id)`              | get one user by id    | `SELECT * FROM users WHERE id = ...`    |
| `findAll()`                 | list all users        | `SELECT * FROM users`                   |
| `deleteById(id)`            | remove one user       | `DELETE FROM users WHERE id = ...`      |
| `findByEmail("foo@bar.com")` | your custom finder    | `SELECT * FROM users WHERE email = ...`  |

All of this happens automatically -- Spring builds the queries based on the method names.

## How Entities and Repositorys Work Together
1. You define your **Entity** -> maps to your table
2. You define your **Repository** -> handles db acces for that entity
3. You inject the repository intor your **service** or **controller**

### Example:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;
    
    public UserController(UserRepository users) {
        this.users = users;
    }
    
    @GetMapping
    public List<User> allUsers() {
        return users.findAll();
    }
}
```
Now `/api/users` will return all rows from your `users` table -- with **no SQL* written.