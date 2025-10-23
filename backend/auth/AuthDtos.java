package com.famly.backend.auth;

public record RegisterRequest(String email, String password) {}
public record LoginRequest(String email, String password) {}
public record AuthResponse(String message) {}