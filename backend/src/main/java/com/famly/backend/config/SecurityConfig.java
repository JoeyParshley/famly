package com.famly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // disable things you don't need yet
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // allow your health endpoint to be public
                        .requestMatchers("/api/health").permitAll()
                        // you can add others here later
                        .anyRequest().permitAll()
                )
                .build();
    }
}
