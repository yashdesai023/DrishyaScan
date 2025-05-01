// 7. Security Package
package com.drishyascan.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the application.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // This is a placeholder. We'll implement proper security later.
        http
            .csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/health", "/api-docs/**", "/swagger-ui/**").permitAll()
            .anyRequest().authenticated();
            
        return http.build();
    }
}