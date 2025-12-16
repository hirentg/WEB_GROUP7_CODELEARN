package com.codelearn.util;

import com.codelearn.exception.BadRequestException;
import com.codelearn.service.UserService;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserService userService;

    public SecurityUtils(UserService userService) {
        this.userService = userService;
    }

    /**
     * Extract user ID from Authorization header
     * 
     * @param authHeader The Authorization header value (Bearer token)
     * @return User ID extracted from token
     * @throws BadRequestException if token is invalid or missing
     */
    public Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadRequestException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Long userId = userService.parseTokenForUserId(token);

        if (userId == null) {
            throw new BadRequestException("Invalid or expired token");
        }

        return userId;
    }
}
