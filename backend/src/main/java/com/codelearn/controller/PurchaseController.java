package com.codelearn.controller;

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

