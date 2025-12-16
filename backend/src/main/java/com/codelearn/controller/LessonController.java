package com.codelearn.controller;

import com.codelearn.dto.CourseLessonsDTO;
import com.codelearn.service.LessonService;
import com.codelearn.service.PurchasedCourseService;
import com.codelearn.util.SecurityUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class LessonController {

    private final LessonService lessonService;
    private final PurchasedCourseService purchasedCourseService;
    private final SecurityUtils securityUtils;

    public LessonController(LessonService lessonService,
            PurchasedCourseService purchasedCourseService,
            SecurityUtils securityUtils) {
        this.lessonService = lessonService;
        this.purchasedCourseService = purchasedCourseService;
        this.securityUtils = securityUtils;
    }

    /**
     * GET /api/courses/{courseId}/lessons
     * Get all lessons for a course
     * 
     * SECURITY: Verifies user owns the course before returning video URLs
     */
    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<CourseLessonsDTO> getCourseLessons(
            @PathVariable String courseId,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = securityUtils.extractUserId(authHeader);
        CourseLessonsDTO lessons = lessonService.getCourseLessons(userId, courseId);
        return ResponseEntity.ok(lessons);
    }

    /**
     * GET /api/courses/{courseId}/check-access
     * Check if current user has access to the course
     */
    @GetMapping("/{courseId}/check-access")
    public ResponseEntity<Map<String, Object>> checkAccess(
            @PathVariable String courseId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(Map.of("hasAccess", false, "reason", "Not logged in"));
        }

        try {
            Long userId = securityUtils.extractUserId(authHeader);
            boolean hasAccess = purchasedCourseService.hasAccess(userId, courseId);
            return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("hasAccess", false, "reason", "Invalid token"));
        }
    }

    /**
     * POST /api/courses/{courseId}/progress
     * Update course progress
     */
    @PostMapping("/{courseId}/progress")
    public ResponseEntity<Map<String, String>> updateProgress(
            @PathVariable String courseId,
            @RequestBody Map<String, Integer> body,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = securityUtils.extractUserId(authHeader);
        int percent = body.getOrDefault("percent", 0);
        purchasedCourseService.updateProgress(userId, courseId, percent);
        return ResponseEntity.ok(Map.of("status", "updated"));
    }
}
