package com.codelearn.repository;

import com.codelearn.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByCourseIdOrderByCreatedAtDesc(String courseId);

    Optional<Rating> findByUserIdAndCourseId(Long userId, String courseId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.courseId = :courseId")
    Double findAverageRatingByCourseId(@Param("courseId") String courseId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.courseId = :courseId")
    Long countByCourseId(@Param("courseId") String courseId);

    List<Rating> findByUserId(Long userId);
}
