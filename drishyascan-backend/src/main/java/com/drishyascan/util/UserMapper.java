package com.drishyascan.util;

import com.drishyascan.dto.UserDto;
import com.drishyascan.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for mapping User entities to DTOs and vice versa
 */
@Component
public class UserMapper {

    /**
     * Maps a User entity to a UserDto
     *
     * @param user The User entity to map
     * @return The corresponding UserDto
     */
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        //dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setRole(user.getRole());
        //dto.setCreatedAt(user.getCreatedAt());
        //dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    /**
     * Maps a list of User entities to a list of UserDtos
     *
     * @param users The list of User entities to map
     * @return The corresponding list of UserDtos
     */
    public List<UserDto> toDtoList(List<User> users) {
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}