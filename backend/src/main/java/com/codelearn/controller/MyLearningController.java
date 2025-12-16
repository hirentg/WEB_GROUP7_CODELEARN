package com.codelearn.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller để trả về fake data cho trang My Learning
 * 
 * NOTE: Đây là FAKE DATA để test UI
 * Trong production, cần thay thế bằng:
 * - API thực từ database (Order, OrderItem với status PAID)
 * - Service để lấy purchased courses từ database
 * - Progress tracking từ database
 */
@RestController
@RequestMapping(path = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class MyLearningController {
    
    /**
     * GET /api/users/my-learning
     * 
     * Trả về danh sách các khóa học đã mua hoặc đang học
     * 
     * FAKE DATA STRUCTURE:
     * {
     *   courseId: String,
     *   courseName: String,
     *   description: String,
     *   thumbnail: String,
     *   purchaseDate: String (ISO format),
     *   progress: Integer (0-100)
     * }
     */
    @GetMapping("/my-learning")
    public ResponseEntity<List<Map<String, Object>>> getMyLearning() {
        List<Map<String, Object>> fakeCourses = new ArrayList<>();
        
        // Fake course 1 - In Progress
        Map<String, Object> course1 = new HashMap<>();
        course1.put("courseId", "react-pro");
        course1.put("courseName", "React for Professionals");
        course1.put("description", "Master React with this comprehensive guide. Learn from the best and build your career.");
        course1.put("thumbnail", "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop");
        course1.put("purchaseDate", LocalDateTime.now().minusDays(15).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        course1.put("progress", 65); // 65% completed
        fakeCourses.add(course1);
        
        // Fake course 2 - Completed
        Map<String, Object> course2 = new HashMap<>();
        course2.put("courseId", "spring-boot-zero-to-hero");
        course2.put("courseName", "Spring Boot Zero to Hero");
        course2.put("description", "Learn Spring Boot from scratch. Build production-ready applications.");
        course2.put("thumbnail", "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop");
        course2.put("purchaseDate", LocalDateTime.now().minusDays(45).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        course2.put("progress", 100); // 100% completed
        fakeCourses.add(course2);
        
        // Fake course 3 - Not Started
        Map<String, Object> course3 = new HashMap<>();
        course3.put("courseId", "ts-mastery");
        course3.put("courseName", "TypeScript Mastery");
        course3.put("description", "Master TypeScript and build type-safe applications.");
        course3.put("thumbnail", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop");
        course3.put("purchaseDate", LocalDateTime.now().minusDays(5).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        course3.put("progress", 0); // Not started
        fakeCourses.add(course3);
        
        // Fake course 4 - In Progress
        Map<String, Object> course4 = new HashMap<>();
        course4.put("courseId", "java-fundamentals");
        course4.put("courseName", "Java Fundamentals");
        course4.put("description", "Learn Java programming fundamentals and best practices.");
        course4.put("thumbnail", "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop");
        course4.put("purchaseDate", LocalDateTime.now().minusDays(30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        course4.put("progress", 35); // 35% completed
        fakeCourses.add(course4);
        
        System.out.println("Returning " + fakeCourses.size() + " fake courses for My Learning");
        
        return ResponseEntity.ok(fakeCourses);
    }
}

