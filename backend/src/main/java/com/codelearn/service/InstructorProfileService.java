package com.codelearn.service;

import com.codelearn.dto.InstructorProfileResponse;
import com.codelearn.dto.UpdateInstructorProfileRequest;
import com.codelearn.model.InstructorProfile;
import com.codelearn.model.User;
import com.codelearn.repository.InstructorProfileRepository;
import com.codelearn.repository.UserRepository;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.PurchasedCourseRepository;
import com.codelearn.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InstructorProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstructorProfileRepository instructorProfileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PurchasedCourseRepository purchasedCourseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public InstructorProfileResponse getInstructorProfile(Long userId) {
        System.out.println("=== Getting instructor profile for user ID: " + userId);

        // Get user
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            System.err.println("ERROR: User not found with ID: " + userId);
            throw new RuntimeException("User not found with ID: " + userId);
        }

        System.out.println("User found: " + user.getName() + " (email: " + user.getEmail() + ")");

        // Get or create instructor profile
        InstructorProfile profile = instructorProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    System.out.println("Instructor profile not found, creating new one for user ID: " + userId);
                    InstructorProfile newProfile = new InstructorProfile();
                    newProfile.setUserId(userId);
                    newProfile.setTotalStudents(0);
                    newProfile.setTotalCourses(0);
                    newProfile.setAvgRating(0.0);
                    newProfile.setIsVerified(false);
                    InstructorProfile saved = instructorProfileRepository.save(newProfile);
                    System.out.println("New instructor profile created with ID: " + saved.getId());
                    return saved;
                });

        System.out.println("Instructor profile found/created with ID: " + profile.getId());

        // Calculate dynamic stats from actual course data
        Long activeCourses = courseRepository.countActiveCoursesByInstructorId(userId);
        int totalCourses = activeCourses != null ? activeCourses.intValue() : 0;

        Long studentCount = purchasedCourseRepository.countStudentsByInstructorId(userId);
        int totalStudents = studentCount != null ? studentCount.intValue() : 0;

        Double avgRating = courseRepository.calculateAverageRatingByInstructorId(userId);
        double rating = avgRating != null ? avgRating : 0.0;

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
                totalStudents, // Dynamically calculated
                totalCourses, // Dynamically calculated
                rating, // Dynamically calculated
                profile.getIsVerified());
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

    public Map<String, Object> getInstructorStats(Long instructorId) {
        Map<String, Object> stats = new HashMap<>();

        // Get total unique students enrolled in instructor's courses
        try {
            Long activeStudents = purchasedCourseRepository.countStudentsByInstructorId(instructorId);
            Long studentCount = activeStudents != null ? activeStudents : 0L;
            stats.put("totalStudents", studentCount);
            stats.put("activeStudents", studentCount);
        } catch (Exception e) {
            System.err.println("Error getting student count: " + e.getMessage());
            stats.put("totalStudents", 0L);
            stats.put("activeStudents", 0L);
        }

        // Get total active (published) courses
        try {
            Long activeCourses = courseRepository.countActiveCoursesByInstructorId(instructorId);
            stats.put("activeCourses", activeCourses != null ? activeCourses : 0L);
        } catch (Exception e) {
            System.err.println("Error getting active courses: " + e.getMessage());
            stats.put("activeCourses", 0L);
        }

        // Get pending questions (unanswered)
        try {
            Long pendingQuestions = questionRepository.countPendingQuestionsByInstructorId(instructorId);
            stats.put("pendingQuestions", pendingQuestions != null ? pendingQuestions : 0L);
        } catch (Exception e) {
            System.err.println("Error getting pending questions: " + e.getMessage());
            stats.put("pendingQuestions", 0L);
        }

        // Calculate average completion across all instructor's courses
        try {
            List<com.codelearn.model.Course> courses = courseRepository.findByInstructorId(instructorId);
            double totalCompletion = 0.0;
            int courseCount = 0;

            for (com.codelearn.model.Course course : courses) {
                Double completion = courseRepository.calculateCourseCompletion(course.getId());
                if (completion != null && completion > 0) {
                    totalCompletion += completion;
                    courseCount++;
                }
            }

            double avgCompletion = courseCount > 0 ? Math.round(totalCompletion / courseCount * 100.0) / 100.0 : 0.0;
            stats.put("avgCompletion", avgCompletion);

            // Get total number of ratings (reviews)
            int totalReviews = courses.stream()
                    .mapToInt(com.codelearn.model.Course::getNumRatings)
                    .sum();
            stats.put("totalReviews", totalReviews);
        } catch (Exception e) {
            System.err.println("Error calculating completion: " + e.getMessage());
            stats.put("avgCompletion", 0.0);
            stats.put("totalReviews", 0);
        }

        // Calculate total revenue from courses sold
        try {
            Double totalRevenue = purchasedCourseRepository.calculateTotalRevenueByInstructorId(instructorId);
            stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        } catch (Exception e) {
            System.err.println("Error calculating revenue: " + e.getMessage());
            stats.put("totalRevenue", 0.0);
        }

        // Calculate average rating across all instructor's courses
        try {
            Double avgRating = courseRepository.calculateAverageRatingByInstructorId(instructorId);
            stats.put("courseRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        } catch (Exception e) {
            System.err.println("Error calculating rating: " + e.getMessage());
            stats.put("courseRating", 0.0);
        }

        return stats;
    }

    public List<Map<String, Object>> getEnrollmentTrend(Long instructorId) {
        List<Object[]> trendData = purchasedCourseRepository.getEnrollmentTrendByInstructorId(instructorId);
        List<Map<String, Object>> enrollmentTrend = new ArrayList<>();

        for (Object[] row : trendData) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", row[0]); // Month name (Dec, Nov, Oct...)
            monthData.put("students", ((Number) row[1]).intValue()); // Student count
            enrollmentTrend.add(monthData);
        }

        return enrollmentTrend;
    }

    public List<Map<String, Object>> getCoursePerformance(Long instructorId) {
        List<Object[]> performanceData = courseRepository.getCoursePerformanceByInstructorId(instructorId);
        List<Map<String, Object>> coursePerformance = new ArrayList<>();

        for (Object[] row : performanceData) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("name", row[0]); // Course title
            courseData.put("students", ((Number) row[1]).intValue()); // Student count
            courseData.put("completion", ((Number) row[2]).intValue()); // Completion rate
            coursePerformance.add(courseData);
        }

        return coursePerformance;
    }

    public List<Map<String, Object>> getStudentProgressDistribution(Long instructorId) {
        List<Object[]> progressData = purchasedCourseRepository.getStudentProgressDistribution(instructorId);
        List<Map<String, Object>> distribution = new ArrayList<>();

        // Initialize all statuses with 0
        Map<String, Integer> counts = new HashMap<>();
        counts.put("Completed", 0);
        counts.put("In Progress", 0);
        counts.put("Not Started", 0);

        // Fill in actual counts from database
        for (Object[] row : progressData) {
            String status = (String) row[0];
            Integer count = ((Number) row[1]).intValue();
            counts.put(status, count);
        }

        // Build result list
        distribution.add(createProgressMap("Completed", counts.get("Completed"), "#10b981"));
        distribution.add(createProgressMap("In Progress", counts.get("In Progress"), "#6366f1"));
        distribution.add(createProgressMap("Not Started", counts.get("Not Started"), "#f59e0b"));

        return distribution;
    }

    private Map<String, Object> createProgressMap(String name, Integer value, String color) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("value", value);
        map.put("color", color);
        return map;
    }

    public List<Map<String, Object>> getDetailedCourseStats(Long instructorId) {
        List<Object[]> statsData = courseRepository.getDetailedCourseStatsByInstructorId(instructorId);
        List<Map<String, Object>> courseStats = new ArrayList<>();

        for (Object[] row : statsData) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("course", row[0]); // Course title
            courseData.put("students", ((Number) row[1]).intValue()); // Student count
            courseData.put("completionRate", ((Number) row[2]).intValue()); // Completion rate
            courseData.put("avgRate", row[3] != null ? ((Number) row[3]).doubleValue() : 0.0); // Average rating
            courseStats.add(courseData);
        }

        return courseStats;
    }
}