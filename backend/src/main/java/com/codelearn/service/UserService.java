package com.codelearn.service;

// Reverted: placeholder to neutralize previously added UserService
import com.codelearn.model.User;
import com.codelearn.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Fixed secret key for JWT (should be in application.properties in production)
    private static final String SECRET_STRING = "MySecretKeyForCodeLearn12345678901234567890123456";
    private final SecretKey jwtSecretKey = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    private final long jwtExpirationMs = 86400000; // 24 hours

    @Transactional
    public User registerUser(String name, String email, String password) {
        if (userRepository.findByName(name) != null) {
            throw new RuntimeException("Username already exists");
        }
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setName(name);
        user.setPassword(encodedPassword);
        user.setEmail(email);

        return userRepository.save(user);
    }

    public User findByName(String username) {
        return userRepository.findByName(username);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword); // Sử dụng BCryptPasswordEncoder để so sánh mật
                                                                      // khẩu
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    // Tạo JWT token cho user
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("name", user.getName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey)
                .compact();
    }

    /**
     * Parse JWT token and extract user ID
     */
    public Long parseTokenForUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(jwtSecretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Object userIdClaim = claims.get("userId");
            if (userIdClaim instanceof Number) {
                return ((Number) userIdClaim).longValue();
            }
            return Long.parseLong(userIdClaim.toString());
        } catch (Exception e) {
            return null;
        }
    }
}