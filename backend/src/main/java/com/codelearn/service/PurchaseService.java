package com.codelearn.service;

import com.codelearn.model.Course;
import com.codelearn.model.PurchasedCourse;
import com.codelearn.model.User;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.PurchasedCourseRepository;
import com.codelearn.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseService {
    
    @Autowired
    private PurchasedCourseRepository purchasedCourseRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public PurchasedCourse purchaseCourse(Long userId, String courseId) {
        // Check if already purchased
        if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Course already purchased");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        PurchasedCourse purchasedCourse = new PurchasedCourse(user, course);
        return purchasedCourseRepository.save(purchasedCourse);
    }
    
    public List<Course> getPurchasedCourses(Long userId) {
        List<PurchasedCourse> purchasedCourses = purchasedCourseRepository.findByUserId(userId);
        return purchasedCourses.stream()
                .map(PurchasedCourse::getCourse)
                .collect(Collectors.toList());
    }
    
    public boolean isCoursePurchased(Long userId, String courseId) {
        return purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}

