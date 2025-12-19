package com.codelearn.controller;

import com.codelearn.dto.InstructorProfileResponse;
import com.codelearn.dto.UpdateInstructorProfileRequest;
import com.codelearn.service.InstructorProfileService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/instructor/profile", produces = MediaType.APPLICATION_JSON_VALUE)
public class InstructorProfileController {
    
    @Autowired
    private InstructorProfileService instructorProfileService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping
    public ResponseEntity<InstructorProfileResponse> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                System.out.println("ERROR: User ID is null from token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            System.out.println("Fetching profile for user ID: " + userId);
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            
            if (profile == null) {
                System.out.println("ERROR: Profile is null for user ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            System.out.println("Profile fetched successfully for user: " + profile.getName());
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            System.err.println("Runtime exception in getProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Exception in getProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping
    public ResponseEntity<InstructorProfileResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateInstructorProfileRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.updateInstructorProfile(userId, request);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            Map<String, Object> stats = instructorProfileService.getInstructorStats(profile.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/enrollment-trend")
    public ResponseEntity<List<Map<String, Object>>> getEnrollmentTrend(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            List<Map<String, Object>> trend = instructorProfileService.getEnrollmentTrend(profile.getId());
            return ResponseEntity.ok(trend);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/course-performance")
    public ResponseEntity<List<Map<String, Object>>> getCoursePerformance(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            List<Map<String, Object>> performance = instructorProfileService.getCoursePerformance(profile.getId());
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/student-progress-distribution")
    public ResponseEntity<List<Map<String, Object>>> getStudentProgressDistribution(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            List<Map<String, Object>> distribution = instructorProfileService.getStudentProgressDistribution(profile.getId());
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/detailed-course-stats")
    public ResponseEntity<List<Map<String, Object>>> getDetailedCourseStats(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            List<Map<String, Object>> stats = instructorProfileService.getDetailedCourseStats(profile.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
