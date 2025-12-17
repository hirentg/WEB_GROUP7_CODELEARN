package com.codelearn.controller;

import com.codelearn.dto.CourseDetailResponse;
import com.codelearn.dto.CreateCourseRequest;
import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.model.Section;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.PurchasedCourseRepository;
import com.codelearn.repository.SectionRepository;
import com.codelearn.service.CourseService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

        @Autowired
        private CourseService courseService;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private PurchasedCourseRepository purchasedCourseRepository;

        @Autowired
        private SectionRepository sectionRepository;

        // ==================== BASIC CRUD (from main) ====================

        @GetMapping
        public List<Course> getCourses() {
                List<Course> courses = courseService.getAllCourses();
                System.out.println("Returning " + courses.size() + " courses from database");
                return courses;
        }

        @GetMapping("/{id}")
        public ResponseEntity<CourseDetailResponse> getCourseById(@PathVariable String id) {
                CourseDetailResponse courseDetail = courseService.getCourseDetailById(id);
                if (courseDetail != null) {
                        return ResponseEntity.ok(courseDetail);
                }
                return ResponseEntity.notFound().build();
        }

        // ==================== INSTRUCTOR ENDPOINTS (from feature/page-for-constructor)
        // ====================

        @GetMapping("/instructor/my-courses")
        public ResponseEntity<List<Course>> getInstructorCourses(
                        @RequestHeader("Authorization") String authHeader) {
                try {
                        Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

                        if (instructorId == null) {
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                        }

                        List<Course> courses = courseService.getInstructorCourses(instructorId);
                        return ResponseEntity.ok(courses);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }

        @PostMapping
        public ResponseEntity<Course> createCourse(
                        @RequestHeader("Authorization") String authHeader,
                        @RequestBody CreateCourseRequest request) {
                try {
                        Long instructorId = jwtUtil.getUserIdFromToken(authHeader);
                        String instructorName = jwtUtil.getNameFromToken(authHeader);

                        if (instructorId == null) {
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                        }

                        Course course = courseService.createCourse(request, instructorId, instructorName);
                        return ResponseEntity.status(HttpStatus.CREATED).body(course);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateCourse(
                        @PathVariable String id,
                        @RequestHeader("Authorization") String authHeader,
                        @RequestBody CreateCourseRequest request) {
                try {
                        Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

                        if (instructorId == null) {
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                        }

                        Course updatedCourse = courseService.updateCourse(id, request, instructorId);

                        if (updatedCourse != null) {
                                return ResponseEntity.ok(updatedCourse);
                        } else {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                                .body("{\"error\": \"You don't have permission to update this course\"}");
                        }
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("{\"error\": \"Failed to update course\"}");
                }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteCourse(
                        @PathVariable String id,
                        @RequestHeader("Authorization") String authHeader) {
                try {
                        Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

                        if (instructorId == null) {
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                        }

                        boolean deleted = courseService.deleteCourse(id, instructorId);

                        if (deleted) {
                                return ResponseEntity.ok().body("{\"message\": \"Course deleted successfully\"}");
                        } else {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                                .body("{\"error\": \"You don't have permission to delete this course\"}");
                        }
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("{\"error\": \"Failed to delete course\"}");
                }
        }

        @GetMapping("/{id}/videos")
        public ResponseEntity<List<Video>> getCourseVideos(@PathVariable String id) {
                List<Video> videos = courseService.getCourseVideos(id);
                return ResponseEntity.ok(videos);
        }

        // ==================== PURCHASE FLOW ENDPOINTS (from HEAD/main)
        // ====================

        /**
         * Check if the current user has access to a course (purchased it)
         */
        @GetMapping("/{id}/check-access")
        public ResponseEntity<?> checkCourseAccess(
                        @PathVariable String id,
                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
                try {
                        Map<String, Object> response = new HashMap<>();

                        if (authHeader == null || authHeader.isEmpty()) {
                                response.put("hasAccess", false);
                                return ResponseEntity.ok(response);
                        }

                        Long userId = jwtUtil.getUserIdFromToken(authHeader);
                        if (userId == null) {
                                response.put("hasAccess", false);
                                return ResponseEntity.ok(response);
                        }

                        boolean hasAccess = purchasedCourseRepository.existsByUserIdAndCourseId(userId, id);
                        response.put("hasAccess", hasAccess);

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("hasAccess", false);
                        return ResponseEntity.ok(response);
                }
        }

        /**
         * Get user's progress for a course
         */
        @GetMapping("/{id}/progress")
        public ResponseEntity<?> getCourseProgress(
                        @PathVariable String id,
                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
                try {
                        Map<String, Object> response = new HashMap<>();

                        if (authHeader == null || authHeader.isEmpty()) {
                                response.put("progress", 0);
                                return ResponseEntity.ok(response);
                        }

                        Long userId = jwtUtil.getUserIdFromToken(authHeader);
                        if (userId == null) {
                                response.put("progress", 0);
                                return ResponseEntity.ok(response);
                        }

                        var purchasedCourse = purchasedCourseRepository.findByUserIdAndCourseId(userId, id);
                        if (purchasedCourse.isPresent()) {
                                response.put("progress", purchasedCourse.get().getProgressPercent());
                        } else {
                                response.put("progress", 0);
                        }

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("progress", 0);
                        return ResponseEntity.ok(response);
                }
        }

        /**
         * Get lessons/sections for a course
         */
        @GetMapping("/{id}/lessons")
        public ResponseEntity<?> getCourseLessons(
                        @PathVariable String id,
                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
                try {
                        // Check if course exists
                        var courseOpt = courseRepository.findById(id);
                        if (courseOpt.isEmpty()) {
                                return ResponseEntity.notFound().build();
                        }

                        // Get sections with videos
                        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(id);

                        return ResponseEntity.ok(sections);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("{\"error\": \"Failed to get course lessons\"}");
                }
        }
}
