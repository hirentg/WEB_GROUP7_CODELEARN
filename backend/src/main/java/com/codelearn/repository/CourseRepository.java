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
}
