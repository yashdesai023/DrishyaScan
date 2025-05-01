package com.drishyascan.repository;

import com.drishyascan.model.User;
import com.drishyascan.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for handling User entity database operations.
 * Extends JpaRepository to inherit common CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user with the specified email exists.
     *
     * @param email the email to check
     * @return true if a user with the email exists, false otherwise
     */
    Boolean existsByEmail(String email);

    /**
     * Find all users with a specific role.
     *
     * @param role the role to search for
     * @return a list of users with the specified role
     */
    List<User> findByRole(UserRole role);

    /**
     * Find all active users.
     *
     * @return a list of active users
     */
    List<User> findByActiveTrue();

    /**
     * Update a user's last login timestamp.
     *
     * @param userId the ID of the user to update
     * @param lastLoginAt the timestamp to set
     * @return the number of rows affected
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginAt = :lastLoginAt WHERE u.id = :userId")
    int updateLastLoginAt(@Param("userId") Long userId, @Param("lastLoginAt") LocalDateTime lastLoginAt);

    /**
     * Find users who haven't logged in since a specific date.
     *
     * @param date the date to compare against
     * @return a list of users who haven't logged in since the specified date
     */
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :date OR u.lastLoginAt IS NULL")
    List<User> findInactiveUsersSince(@Param("date") LocalDateTime date);
}