package com.drishyascan.controller;

import com.drishyascan.dto.UpdateUserRequest;
import com.drishyascan.dto.UserDto;
import com.drishyascan.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST controller for user-related operations
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Get a user by their ID
     * Only accessible by ADMIN or the user themselves
     *
     * @param id The ID of the user to retrieve
     * @return The user DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        log.info("REST request to get user by ID: {}", id);
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    /**
     * Get the currently authenticated user's profile
     *
     * @return The current user DTO
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        log.info("REST request to get current user profile");
        UserDto userDto = userService.getCurrentUserProfile();
        return ResponseEntity.ok(userDto);
    }

    /**
     * Update the current user's profile
     *
     * @param updateRequest The update request with new user data
     * @return The updated user DTO
     */
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUserProfile(@Valid @RequestBody UpdateUserRequest updateRequest) {
        log.info("REST request to update current user profile");
        UserDto updatedUser = userService.updateCurrentUserProfile(updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Get all users (admin only)
     *
     * @return List of all user DTOs
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("REST request to get all users");
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}