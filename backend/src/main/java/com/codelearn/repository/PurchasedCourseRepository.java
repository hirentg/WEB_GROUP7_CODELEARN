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
    
    // Count distinct students enrolled in instructor's courses
    @Query("SELECT COUNT(DISTINCT pc.user.id) FROM PurchasedCourse pc WHERE pc.course.instructorId = :instructorId")
    Long countStudentsByInstructorId(@Param("instructorId") Long instructorId);
    
    // Get enrollment trend by month for last 6 months
    @Query(value = """
            WITH months AS (
                SELECT generate_series(
                    date_trunc('month', CURRENT_DATE - INTERVAL '5 months'),
                    date_trunc('month', CURRENT_DATE),
                    '1 month'::interval
                ) AS month_date
            )
            SELECT 
                TO_CHAR(m.month_date, 'Mon') as month,
                COALESCE(COUNT(DISTINCT pc.user_id), 0) as students
            FROM months m
            LEFT JOIN purchased_courses pc ON date_trunc('month', pc.purchased_at) = m.month_date
            LEFT JOIN courses c ON pc.course_id = c.id AND c.instructor_id = :instructorId
            GROUP BY m.month_date, TO_CHAR(m.month_date, 'Mon')
            ORDER BY m.month_date
            """, nativeQuery = true)
    List<Object[]> getEnrollmentTrendByInstructorId(@Param("instructorId") Long instructorId);
    
    // Calculate total revenue from courses sold by instructor
    @Query(value = """
            SELECT COALESCE(SUM(CAST(REPLACE(c.price, '$', '') AS DECIMAL)), 0)
            FROM purchased_courses pc
            JOIN courses c ON pc.course_id = c.id
            WHERE c.instructor_id = :instructorId
            """, nativeQuery = true)
    Double calculateTotalRevenueByInstructorId(@Param("instructorId") Long instructorId);
    
    // Get student progress distribution (completed, in progress, not started)
    @Query(value = """
            SELECT 
                CASE 
                    WHEN pc.progress_percent = 100 THEN 'Completed'
                    WHEN pc.progress_percent > 0 AND pc.progress_percent < 100 THEN 'In Progress'
                    ELSE 'Not Started'
                END as status,
                COUNT(DISTINCT pc.user_id) as count
            FROM purchased_courses pc
            JOIN courses c ON pc.course_id = c.id
            WHERE c.instructor_id = :instructorId
            GROUP BY CASE 
                WHEN pc.progress_percent = 100 THEN 'Completed'
                WHEN pc.progress_percent > 0 AND pc.progress_percent < 100 THEN 'In Progress'
                ELSE 'Not Started'
            END
            """, nativeQuery = true)
    List<Object[]> getStudentProgressDistribution(@Param("instructorId") Long instructorId);
}
