package com.codelearn.controller;

import com.codelearn.model.Course;
import com.codelearn.model.PurchasedCourse;
import com.codelearn.repository.CourseRepository;
import com.codelearn.service.PurchasedCourseService;
import com.codelearn.util.SecurityUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for My Learning page
 * Returns purchased courses for the authenticated user
 */
@RestController
@RequestMapping(path = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class MyLearningController {

    private final PurchasedCourseService purchasedCourseService;
    private final CourseRepository courseRepository;
    private final SecurityUtils securityUtils;

    public MyLearningController(PurchasedCourseService purchasedCourseService,
            CourseRepository courseRepository,
            SecurityUtils securityUtils) {
        this.purchasedCourseService = purchasedCourseService;
        this.courseRepository = courseRepository;
        this.securityUtils = securityUtils;
    }

    /**
     * GET /api/users/my-learning
     * Returns purchased courses with course details and progress
     */
    @GetMapping("/my-learning")
    public ResponseEntity<List<Map<String, Object>>> getMyLearning(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // If not authenticated, return empty list
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        try {
            Long userId = securityUtils.extractUserId(authHeader);
            List<PurchasedCourse> purchasedCourses = purchasedCourseService.getUserCourses(userId);

            List<Map<String, Object>> result = new ArrayList<>();
            for (PurchasedCourse pc : purchasedCourses) {
                Map<String, Object> item = new HashMap<>();
                item.put("courseId", pc.getCourseId());
                item.put("purchaseDate", pc.getPurchasedAt().toString());
                item.put("progress", pc.getProgressPercent());

                // Get course details
                courseRepository.findById(pc.getCourseId()).ifPresent(course -> {
                    item.put("courseName", course.getTitle());
                    item.put("description",
                            course.getDescription() != null ? course.getDescription() : "Master " + course.getTitle());
                    item.put("thumbnail", course.getThumbnailUrl());
                    item.put("instructor", course.getInstructor());
                    item.put("duration", course.getDuration());
                });

                result.add(item);
            }

            System.out.println("Returning " + result.size() + " purchased courses for user " + userId);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Error fetching my learning: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}
