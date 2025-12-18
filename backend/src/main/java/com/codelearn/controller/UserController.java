package com.codelearn.controller;

import com.codelearn.dto.UpdateProfileRequest;
import com.codelearn.dto.UserProfileDTO;
import com.codelearn.model.User;
import com.codelearn.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        try {
            User user = getUserFromAuth(auth);
            return ResponseEntity.ok(toDTO(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdateProfileRequest request,
            Authentication auth) {
        User user;
        try {
            user = getUserFromAuth(auth);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));
        }

        // Update fields if provided
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getHeadline() != null) {
            user.setHeadline(request.getHeadline());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(toDTO(savedUser));
    }

    // Get public profile of any user
    @GetMapping("/{id}/public")
    public ResponseEntity<?> getPublicProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    // Return only public fields
                    UserProfileDTO dto = new UserProfileDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setAvatarUrl(user.getAvatarUrl());
                    dto.setBio(user.getBio());
                    dto.setHeadline(user.getHeadline());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private UserProfileDTO toDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getHeadline(),
                user.getWebsite(),
                user.getRole(),
                user.getCreatedAt());
    }

    private User getUserFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user;
            }
        }
        throw new RuntimeException("User not authenticated");
    }
}
