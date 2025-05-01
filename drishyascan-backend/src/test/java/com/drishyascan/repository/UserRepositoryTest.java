package com.drishyascan.repository;
import com.drishyascan.repository.UserRepository;
import com.drishyascan.model.User;
import com.drishyascan.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;


/**
 * Unit tests for UserRepository.
 * Uses @DataJpaTest to set up an in-memory database for testing.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByEmail_thenReturnUser() {
        // Given
        User user = User.builder()
                .email("test@drishyascan.com")
                .passwordHash("$2a$10$GVvNmYUYxEudHmAEfW5t8O2kvI3N6OjbdS3Lt2iv4Iirh9.VJo0XO") // hashed "password"
                .firstName("Test")
                .lastName("User")
                .role(UserRole.DEVELOPER)
                .active(true)
                .build();
        
        entityManager.persist(user);
        entityManager.flush();

        // When
        Optional<User> found = userRepository.findByEmail(user.getEmail());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo(user.getEmail());
        assertThat(found.get().getRole()).isEqualTo(UserRole.DEVELOPER);
    }

    @Test
    public void whenExistsByEmail_withExistingEmail_thenReturnTrue() {
        // Given
        User user = User.builder()
                .email("developer@drishyascan.com")
                .passwordHash("$2a$10$GVvNmYUYxEudHmAEfW5t8O2kvI3N6OjbdS3Lt2iv4Iirh9.VJo0XO")
                .role(UserRole.DEVELOPER)
                .active(true)
                .build();
        
        entityManager.persist(user);
        entityManager.flush();

        // When
        boolean exists = userRepository.existsByEmail("developer@drishyascan.com");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    public void whenExistsByEmail_withNonExistingEmail_thenReturnFalse() {
        // When
        boolean exists = userRepository.existsByEmail("nonexistent@drishyascan.com");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    public void whenFindByRole_thenReturnUsers() {
        // Given
        User admin = User.builder()
                .email("admin@drishyascan.com")
                .passwordHash("$2a$10$GVvNmYUYxEudHmAEfW5t8O2kvI3N6OjbdS3Lt2iv4Iirh9.VJo0XO")
                .role(UserRole.ADMIN)
                .active(true)
                .build();
        
        User developer = User.builder()
                .email("dev@drishyascan.com")
                .passwordHash("$2a$10$GVvNmYUYxEudHmAEfW5t8O2kvI3N6OjbdS3Lt2iv4Iirh9.VJo0XO")
                .role(UserRole.DEVELOPER)
                .active(true)
                .build();
        
        entityManager.persist(admin);
        entityManager.persist(developer);
        entityManager.flush();

        // When
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        List<User> developers = userRepository.findByRole(UserRole.DEVELOPER);
        List<User> contentManagers = userRepository.findByRole(UserRole.CONTENT_MANAGER);

        // Then
        assertThat(admins).hasSize(1);
        assertThat(developers).hasSize(1);
        assertThat(contentManagers).isEmpty();
    }

    @Test
    @Transactional
    public void whenUpdateLastLoginAt_thenLastLoginAtIsUpdated() {
        // Given
        User user = User.builder()
                .email("login@drishyascan.com")
                .passwordHash("$2a$10$GVvNmYUYxEudHmAEfW5t8O2kvI3N6OjbdS3Lt2iv4Iirh9.VJo0XO")
                .role(UserRole.DEVELOPER)
                .active(true)
                .build();
        
        User savedUser = entityManager.persist(user);
        entityManager.flush();
        
        LocalDateTime loginTime = LocalDateTime.now();

        // When
        userRepository.updateLastLoginAt(savedUser.getId(), loginTime);
        entityManager.clear(); // Clear persistence context to force a fresh read from DB
        
        // Then
        User updatedUser = userRepository.findById(savedUser.getId()).orElseThrow();
        assertThat(updatedUser.getLastLoginAt()).isNotNull();
        // Check only to the second precision to avoid millisecond differences
        assertThat(updatedUser.getLastLoginAt().withNano(0)).isEqualTo(loginTime.withNano(0));
    }
}