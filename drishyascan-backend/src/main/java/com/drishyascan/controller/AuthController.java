package com.drishyascan.controller;

import com.drishyascan.dto.auth.AuthResponse;
import com.drishyascan.dto.auth.LoginRequest;
import com.drishyascan.dto.auth.RegisterRequest;
import com.drishyascan.service.auth.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")  // Keep this as /auth based on your URL patterns
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
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
        logger.info("Registration request received for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        logger.info("Registration successful for user: {}", response.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate a user
     * @param request LoginRequest containing email and password
     * @return JWT token and user information
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        logger.info("Login successful for user: {}", response.getEmail());
        return ResponseEntity.ok(response);
    }
}