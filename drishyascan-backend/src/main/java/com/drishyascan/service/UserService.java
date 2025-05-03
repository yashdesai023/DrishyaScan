package com.drishyascan.service;

import com.drishyascan.dto.UpdateUserRequest;
import com.drishyascan.dto.UserDto;
import com.drishyascan.exception.ResourceNotFoundException;
import com.drishyascan.exception.UnauthorizedException;
import com.drishyascan.model.User;
import com.drishyascan.repository.UserRepository;
import com.drishyascan.util.SecurityUtils;
import com.drishyascan.util.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for user-related operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    /**
     * Get a user by their ID
     *
     * @param id The ID of the user to retrieve
     * @return The user DTO
     * @throws ResourceNotFoundException if the user is not found
     */
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        // Verify the current user has access to this information
        User currentUser = getCurrentUser();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");
        
        if (!isAdmin && !currentUser.getId().equals(id)) {
            log.warn("User {} attempted to access user {} without permission", currentUser.getId(), id);
            throw new UnauthorizedException("You don't have permission to access this user");
        }
        
        return userMapper.toDto(user);
    }

    /**
     * Get the currently authenticated user
     *
     * @return The current user DTO
     */
    @Transactional(readOnly = true)
    public UserDto getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        log.info("Fetching profile for current user: {}", currentUser.getEmail());
        return userMapper.toDto(currentUser);
    }

    /**
     * Update the current user's profile
     *
     * @param updateRequest The update request with new user data
     * @return The updated user DTO
     */
    @Transactional
    public UserDto updateCurrentUserProfile(UpdateUserRequest updateRequest) {
        User currentUser = getCurrentUser();
        log.info("Updating profile for user: {}", currentUser.getEmail());
        
        if (updateRequest.getFirstName() != null) {
            currentUser.setFirstName(updateRequest.getFirstName());
        }
        
        if (updateRequest.getLastName() != null) {
            currentUser.setLastName(updateRequest.getLastName());
        }
        
        if (updateRequest.getProfileImageUrl() != null) {
            currentUser.setProfileImageUrl(updateRequest.getProfileImageUrl());
        }
        
        User savedUser = userRepository.save(currentUser);
        log.info("Successfully updated profile for user: {}", currentUser.getEmail());
        return userMapper.toDto(savedUser);
    }

    /**
     * Get all users (admin only)
     *
     * @return List of all user DTOs
     */
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        log.info("Fetching all users");
        // Double-check that current user is admin
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");
        if (!isAdmin) {
            User currentUser = getCurrentUser();
            log.warn("User {} attempted to access all users without admin permission", currentUser.getId());
            throw new UnauthorizedException("You don't have permission to access all users");
        }
        
        List<User> users = userRepository.findAll();
        return userMapper.toDtoList(users);
    }

    /**
     * Helper method to get the current authenticated user
     *
     * @return The current user entity
     * @throws ResourceNotFoundException if the user is not found
     */
    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUsername();
        if (email == null) {
            throw new UnauthorizedException("No authenticated user found");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}