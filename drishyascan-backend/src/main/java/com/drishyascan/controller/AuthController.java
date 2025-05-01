package com.drishyascan.controller;

import com.drishyascan.dto.auth.AuthResponse;
import com.drishyascan.dto.auth.LoginRequest;
import com.drishyascan.dto.auth.RegisterRequest;
import com.drishyascan.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user
     * @param request RegisterRequest containing user details
     * @return JWT token and user information
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            // Return 400 Bad Request for validation errors
            throw e;
        } catch (Exception e) {
            // Return 500 Internal Server Error for unexpected errors
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    /**
     * Authenticate a user
     * @param request LoginRequest containing email and password
     * @return JWT token and user information
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Return 400 Bad Request for validation errors
            throw e;
        } catch (Exception e) {
            // Return 500 Internal Server Error for unexpected errors
            throw new RuntimeException("Failed to authenticate user: " + e.getMessage());
        }
    }
}