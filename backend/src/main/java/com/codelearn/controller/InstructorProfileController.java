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
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            InstructorProfileResponse profile = instructorProfileService.getInstructorProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
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
}
