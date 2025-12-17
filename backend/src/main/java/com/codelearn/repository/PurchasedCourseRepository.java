package com.codelearn.repository;

import com.codelearn.model.PurchasedCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchasedCourseRepository extends JpaRepository<PurchasedCourse, Long> {
    List<PurchasedCourse> findByUserId(Long userId);

    // Fetch courses with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT pc FROM PurchasedCourse pc JOIN FETCH pc.course WHERE pc.user.id = :userId")
    List<PurchasedCourse> findByUserIdWithCourse(@Param("userId") Long userId);

    Optional<PurchasedCourse> findByUserIdAndCourseId(Long userId, String courseId);

    boolean existsByUserIdAndCourseId(Long userId, String courseId);

    @Modifying
    @Query("UPDATE PurchasedCourse pc SET pc.progressPercent = :progress WHERE pc.user.id = :userId AND pc.course.id = :courseId")
    int updateProgress(@Param("userId") Long userId, @Param("courseId") String courseId,
            @Param("progress") int progress);
}
