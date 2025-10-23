// backend/src/main/java/com/famly/backend/user/User.java
package com.famly.backend.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity @Table(name = "users")
public class User {
    @Id
    @GeneratedValue @UuidGenerator   // let Hibernate create UUIDs
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public User() {}
    public User(String email, String passwordHash) {
        this.email = email; this.passwordHash = passwordHash;
    }

    // getters/setters …
}
