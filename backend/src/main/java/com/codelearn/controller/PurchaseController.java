package com.codelearn.controller;

import com.codelearn.dto.PaymentRequestDTO;
import com.codelearn.dto.PaymentResponseDTO;
import com.codelearn.model.Course;
import com.codelearn.service.PurchaseService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/purchases", produces = MediaType.APPLICATION_JSON_VALUE)
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * POST /api/purchases/checkout
     * Process payment for a course with credit card or PayPal
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody PaymentRequestDTO request, HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(PaymentResponseDTO.failure("Unauthorized"));
        }

        Long userId = jwtUtil.getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(PaymentResponseDTO.failure("Invalid token"));
        }

        try {
            PaymentResponseDTO response = purchaseService.processPayment(userId, request);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(PaymentResponseDTO.failure(e.getMessage()));
        }
    }

    /**
     * POST /api/purchases/progress
     * Update user's course watch progress
     */
    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody Map<String, Object> body, HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        Long userId = jwtUtil.getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid token"));
        }

        String courseId = (String) body.get("courseId");
        Integer progressPercent = (Integer) body.get("progressPercent");

        if (courseId == null || progressPercent == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "courseId and progressPercent are required"));
        }

        try {
            purchaseService.updateProgress(userId, courseId, progressPercent);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Progress updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<?> purchaseCourse(@PathVariable String courseId, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        Long userId = jwtUtil.getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid token"));
        }

        try {
            purchaseService.purchaseCourse(userId, courseId);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Course purchased successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getPurchasedCourses(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        Long userId = jwtUtil.getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid token"));
        }

        List<Course> courses = purchaseService.getPurchasedCourses(userId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<?> checkPurchaseStatus(@PathVariable String courseId, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return ResponseEntity.ok(Map.of("purchased", false));
        }

        Long userId = jwtUtil.getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.ok(Map.of("purchased", false));
        }

        boolean purchased = purchaseService.isCoursePurchased(userId, courseId);
        return ResponseEntity.ok(Map.of("purchased", purchased));
    }
}
