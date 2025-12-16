package com.codelearn.service;

import com.codelearn.model.PurchasedCourse;
import com.codelearn.repository.PurchasedCourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PurchasedCourseService {

    private final PurchasedCourseRepository repository;

    public PurchasedCourseService(PurchasedCourseRepository repository) {
        this.repository = repository;
    }

    /**
     * Check if user has access to a course
     */
    public boolean hasAccess(Long userId, String courseId) {
        return repository.existsByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Get all courses purchased by a user
     */
    public List<PurchasedCourse> getUserCourses(Long userId) {
        return repository.findByUserIdOrderByPurchasedAtDesc(userId);
    }

    /**
     * Get specific purchased course
     */
    public Optional<PurchasedCourse> getPurchasedCourse(Long userId, String courseId) {
        return repository.findByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Update course progress
     */
    @Transactional
    public void updateProgress(Long userId, String courseId, int percent) {
        int boundedPercent = Math.min(100, Math.max(0, percent));
        repository.updateProgress(userId, courseId, boundedPercent);
    }
}
