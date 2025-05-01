// AuthResponse.java
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
}