package com.drishyascan.dto.auth;

import com.drishyascan.dto.UserDto;

public class AuthResponse {
    private String accessToken;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    // Method to get email from the user object
    public String getEmail() {
        return this.user != null ? this.user.getEmail() : null;  // Return email from UserDto if user is not null
    }
}
