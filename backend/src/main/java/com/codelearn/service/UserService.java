package com.codelearn.service;

// Reverted: placeholder to neutralize previously added UserService
import com.codelearn.model.User;
import com.codelearn.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
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
        return passwordEncoder.matches(rawPassword, encodedPassword); // Sử dụng BCryptPasswordEncoder để so sánh mật khẩu
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }
}