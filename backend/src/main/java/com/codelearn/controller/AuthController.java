package com.codelearn.controller;
import com.codelearn.dto.LoginRequest;
import com.codelearn.dto.RegisterRequest;
import com.codelearn.model.User;
import com.codelearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest request) {
        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không và mật khẩu có hợp lệ không
        User user = userService.findByEmail(request.getEmail());
        if (user != null && userService.checkPassword(request.getPassword(), user.getPassword())) {
            // Tạo JWT token cho user đã đăng nhập thành công
            String token = userService.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "status", "ok", 
                "token", token,
                "email", user.getEmail(),
                "name", user.getName()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Invalid credentials"));
        }
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest request) {
        // Kiểm tra nếu người dùng đã tồn tại trong cơ sở dữ liệu
        if (userService.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.status(400).body(Map.of("status", "error", "message", "Email already in use"));
        }

        // Lưu người dùng mới vào cơ sở dữ liệu với password đã được hash
        User newUser = userService.registerUser(request.getName(), request.getEmail(), request.getPassword());

        return ResponseEntity.ok(Map.of("status", "created", "email", newUser.getEmail(), "name", newUser.getName()));
    }
}
