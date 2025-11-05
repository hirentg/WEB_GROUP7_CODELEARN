package com.codelearn.controller;

import com.codelearn.dto.LoginRequest;
import com.codelearn.dto.RegisterRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest request) {
        // Stub only: accept any non-empty credentials
        return ResponseEntity.ok(Map.of("status", "ok", "email", request.getEmail()));
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest request) {
        // Stub only: echo basic info
        return ResponseEntity.ok(Map.of("status", "created", "email", request.getEmail(), "name", request.getName()));
    }
}


