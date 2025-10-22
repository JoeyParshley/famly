package com.famly.backend.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="users")
public class User {
    @Id @Column(columnDefinition="uuid") private UUID id = UUID.randomUUID();
    @Column(nullable=false, unique=true) private String email;
    @Column(name="password_hash", nullable=false) private String passwordHash;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();

    public User() {}
    public User(String email, String passwordHash) { this.email=email; this.passwordHash=passwordHash; }
    // getters/setters
}
