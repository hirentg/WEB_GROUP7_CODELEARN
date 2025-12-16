package com.codelearn.controller;

import com.codelearn.dto.CourseDetailResponse;
import com.codelearn.dto.CreateCourseRequest;
import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.service.CourseService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Course> getCourses() {
        return courseService.getAllCourses();
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
}


