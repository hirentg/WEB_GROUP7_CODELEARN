package com.codelearn.controller;

import com.codelearn.dto.CourseDetailResponse;
import com.codelearn.dto.CreateCourseRequest;
import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.service.CourseService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${thumbnail.storage.path:uploads/thumbnails/courses}")
    private String thumbnailStoragePath;

    @GetMapping
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    // Search courses by query string
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<Course> results = courseService.searchCourses(query.trim());
        return ResponseEntity.ok(results);
    }

    // Get course sections with videos (for course content preview)
    @GetMapping("/{id}/sections")
    public ResponseEntity<?> getCourseSections(@PathVariable String id) {
        var sections = courseService.getCourseSections(id);
        return ResponseEntity.ok(sections);
    }

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

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailResponse> getCourseById(@PathVariable String id) {
        CourseDetailResponse courseDetail = courseService.getCourseDetailById(id);
        if (courseDetail != null) {
            return ResponseEntity.ok(courseDetail);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateCourseRequest request) {
        try {
            // Extract user info from JWT token
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

    @GetMapping("/{id}/videos")
    public ResponseEntity<List<Video>> getCourseVideos(@PathVariable String id) {
        List<Video> videos = courseService.getCourseVideos(id);
        return ResponseEntity.ok(videos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateCourseRequest request) {
        try {
            // Extract instructor ID from JWT token
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
            // Extract instructor ID from JWT token
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

    @PostMapping(value = "/upload-thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadThumbnail(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Verify authentication
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);
            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Please select a file to upload"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file type. Only image files are allowed."));
            }

            // Validate file size (max 5MB)
            long maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File size exceeds maximum limit of 5MB"));
            }

            // Get file extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(thumbnailStoragePath);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Generate URL (adjust this based on your server configuration)
            String fileUrl = "/" + thumbnailStoragePath + "/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", uniqueFilename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}
