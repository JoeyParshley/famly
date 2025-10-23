// backend/src/main/java/com/famly/backend/auth/AuthController.java
package com.famly.backend.auth;

import com.famly.backend.user.User;
import com.famly.backend.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder;
    public AuthController(UserRepository users, PasswordEncoder encoder) {
        this.users = users; this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.email() == null || req.password() == null || req.password().isBlank())
            return ResponseEntity.badRequest().body(new AuthResponse("invalid_input"));
        if (users.existsByEmail(req.email()))
            return ResponseEntity.badRequest().body(new AuthResponse("email_exists"));
        users.save(new User(req.email(), encoder.encode(req.password())));
        return ResponseEntity.ok(new AuthResponse("registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        var u = users.findByEmail(req.email()).orElse(null);
        if (u == null || !encoder.matches(req.password(), u.getPasswordHash()))
            return ResponseEntity.status(401).body(new AuthResponse("invalid_credentials"));
        return ResponseEntity.ok(new AuthResponse("login_ok")); // JWT next
    }
}
