# Development Process
Notes for what the steps entail.

## 1

## 2

## 3 Password encoder bean (BCrypt)
created the file
`backend/src/main/java/com/famly/backend/config/PasswordConfig.java`
```java
package com.famly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
  @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}

```
This is an important concept in Sprint Security that ties direclty into the `User` and `AuthController` setup
### What the Password Encoder (BCrypt) is For
When users register or login they provide a **plain-text password** -- but we must **never** store or compare that raw password directly.

Instead we use a **PasswordEncoder** (like `BCryptPasswordEncoder`) to **hash** the password before saving it and later **verify** it safely when the user logs in.

So the Password Encoder bean is the centralized component thant handles:
- **Hashing** passwords before storing them in the database
- **Checking** whether a plain password matches a stored hash

### What BCrypt actually does

BCrypt is a **strong**, **salted**, **adaptive hashing algorithm** designed for passwords:
- **Strong**: One-way function (impossible to reverse)
- **Salted**: Adds random data to each hash  to prevent rainbow-table attacks
- **adaptive**: You can increase the "work factor" (rounds) as hardware gets faster

Each time you call `.encose("password")` BCrypt produces a *different* hash -- even for the same password -- because it uses as different salt each time.

### How it works in your App flow
#### Register
1. User sends email/password -> `/api/auth/register`
2. You hash it: 
```java
encoder.encode(req.password())
```
3. Store hash in DB -> `password_hash` column
#### Login
1. User sends email/password -> `api/auth/login`
2. You look up hash from DB
3. Compare:
```java
encoder.matches(req.password(), storedHash)
```
4. If true -> success; else 401 Unauthorized
## 4

## 5 