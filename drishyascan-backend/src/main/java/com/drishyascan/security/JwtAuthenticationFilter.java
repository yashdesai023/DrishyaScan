package com.drishyascan.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.drishyascan.util.JwtUtil;

import java.io.IOException;

@Component 
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // Log request details for debugging
            logger.debug("Processing request to: {} {}", request.getMethod(), request.getRequestURI());
            
            // Extract Authorization header
            final String authorizationHeader = request.getHeader("Authorization");
            logger.debug("Authorization header: {}", authorizationHeader != null ? 
                    (authorizationHeader.startsWith("Bearer ") ? "Bearer token present" : authorizationHeader) : "null");

            String email = null;
            String jwt = null;

            // Check if Authorization header exists and has Bearer token
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                // Extract JWT token
                jwt = authorizationHeader.substring(7);
                try {
                    // Extract username (email) from token
                    email = jwtUtil.extractUsername(jwt);
                    logger.debug("Extracted email from token: {}", email);
                } catch (Exception e) {
                    // Log exception
                    logger.error("JWT token validation failed: {}", e.getMessage(), e);
                }
            }

            // If email is extracted and user is not yet authenticated
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("Loading user details for: {}", email);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

                // Validate token against userDetails
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Set authentication details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication successful for user: {}", email);
                } else {
                    logger.warn("Token validation failed for user: {}", email);
                }
            }
        } catch (Exception e) {
            // Catch any unexpected errors in the filter
            logger.error("Unexpected error in JWT filter", e);
        }
        
        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}