package com.codelearn.service;

import com.codelearn.dto.InstructorProfileResponse;
import com.codelearn.dto.UpdateInstructorProfileRequest;
import com.codelearn.model.InstructorProfile;
import com.codelearn.model.User;
import com.codelearn.repository.InstructorProfileRepository;
import com.codelearn.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InstructorProfileService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstructorProfileRepository instructorProfileRepository;
    
    public InstructorProfileResponse getInstructorProfile(Long userId) {
        // Get user
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Get or create instructor profile
        InstructorProfile profile = instructorProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                InstructorProfile newProfile = new InstructorProfile();
                newProfile.setUserId(userId);
                newProfile.setTotalStudents(0);
                newProfile.setTotalCourses(0);
                newProfile.setAvgRating(0.0);
                newProfile.setIsVerified(false);
                return instructorProfileRepository.save(newProfile);
            });
        
        return new InstructorProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getBio(),
            user.getWebsite(),
            user.getCreatedAt(),
            profile.getExpertise(),
            profile.getQualifications(),
            profile.getTotalStudents(),
            profile.getTotalCourses(),
            profile.getAvgRating(),
            profile.getIsVerified()
        );
    }
    
    @Transactional
    public InstructorProfileResponse updateInstructorProfile(Long userId, UpdateInstructorProfileRequest request) {
        // Get user
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Update user fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite());
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Get or create instructor profile
        InstructorProfile profile = instructorProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                InstructorProfile newProfile = new InstructorProfile();
                newProfile.setUserId(userId);
                newProfile.setTotalStudents(0);
                newProfile.setTotalCourses(0);
                newProfile.setAvgRating(0.0);
                newProfile.setIsVerified(false);
                return newProfile;
            });
        
        // Update instructor profile fields
        if (request.getExpertise() != null) {
            profile.setExpertise(request.getExpertise());
        }
        if (request.getQualifications() != null) {
            profile.setQualifications(request.getQualifications());
        }
        instructorProfileRepository.save(profile);
        
        return getInstructorProfile(userId);
    }
}
