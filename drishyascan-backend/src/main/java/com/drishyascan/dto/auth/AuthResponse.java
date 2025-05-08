package com.drishyascan.dto.auth;

import com.drishyascan.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private UserDto user;

    // Method to get email from the user object
    public String getEmail() {
        return this.user != null ? this.user.getEmail() : null;  // Return email from UserDto if user is not null
    }
}
