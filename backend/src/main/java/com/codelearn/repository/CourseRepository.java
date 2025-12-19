package com.codelearn.repository;

import com.codelearn.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    @Query(value = """
            SELECT COALESCE(ROUND(CAST(AVG(pc.progress_percent) AS numeric), 2), 0)
            FROM purchased_courses pc
            WHERE pc.course_id = :courseId
            """, nativeQuery = true)
    Double calculateCourseCompletion(@Param("courseId") String courseId);

    List<Course> findByInstructorId(Long instructorId);

    // Filter courses by status (e.g., "PUBLISHED", "DRAFT")
    List<Course> findByStatus(String status);

    // Case-insensitive status filter
    List<Course> findByStatusIgnoreCase(String status);
    
    // Count active courses by instructor (status = 'active' or 'published')
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructorId = :instructorId AND (LOWER(c.status) = 'active' OR LOWER(c.status) = 'published')")
    Long countActiveCoursesByInstructorId(@Param("instructorId") Long instructorId);
    
    // Calculate average rating across all courses by instructor
    @Query("SELECT COALESCE(AVG(c.rating), 0.0) FROM Course c WHERE c.instructorId = :instructorId")
    Double calculateAverageRatingByInstructorId(@Param("instructorId") Long instructorId);
    
    // Get course performance data: course title, student count, completion rate
    @Query(value = """
            SELECT 
                c.title as courseName,
                COUNT(DISTINCT pc.user_id) as studentCount,
                COALESCE(ROUND(CAST(AVG(pc.progress_percent) AS numeric), 0), 0) as completionRate
            FROM courses c
            LEFT JOIN purchased_courses pc ON c.id = pc.course_id
            WHERE c.instructor_id = :instructorId
            GROUP BY c.id, c.title
            ORDER BY studentCount DESC
            """, nativeQuery = true)
    List<Object[]> getCoursePerformanceByInstructorId(@Param("instructorId") Long instructorId);
    
    // Get detailed course statistics: course name, students, completion rate, avg rating
    @Query(value = """
            SELECT 
                c.title as courseName,
                COUNT(DISTINCT pc.user_id) as studentCount,
                COALESCE(ROUND(CAST(AVG(pc.progress_percent) AS numeric), 0), 0) as completionRate,
                c.rating as avgRating
            FROM courses c
            LEFT JOIN purchased_courses pc ON c.id = pc.course_id
            WHERE c.instructor_id = :instructorId
            GROUP BY c.id, c.title, c.rating
            ORDER BY studentCount DESC
            """, nativeQuery = true)
    List<Object[]> getDetailedCourseStatsByInstructorId(@Param("instructorId") Long instructorId);

    // Search courses by title (case-insensitive, partial match)
    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) AND c.status = 'PUBLISHED'")
    List<Course> searchByTitle(@Param("query") String query);

    // Search by title or description
    @Query("SELECT c FROM Course c WHERE (LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND c.status = 'PUBLISHED'")
    List<Course> searchByTitleOrDescription(@Param("query") String query);
}
