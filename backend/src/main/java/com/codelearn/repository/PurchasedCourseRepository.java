package com.codelearn.repository;

import com.codelearn.model.PurchasedCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchasedCourseRepository extends JpaRepository<PurchasedCourse, Long> {
    List<PurchasedCourse> findByUserId(Long userId);
    Optional<PurchasedCourse> findByUserIdAndCourseId(Long userId, String courseId);
    boolean existsByUserIdAndCourseId(Long userId, String courseId);
}


