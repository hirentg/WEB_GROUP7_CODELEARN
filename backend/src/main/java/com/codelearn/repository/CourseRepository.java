package com.codelearn.repository;

import com.codelearn.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    List<Course> findAllByOrderByRatingDesc();

    List<Course> findByInstructorContainingIgnoreCase(String instructor);

    List<Course> findByTitleContainingIgnoreCase(String title);

    // From feature/page-for-constructor branch
    List<Course> findByInstructorId(Long instructorId);

    @Query(value = """
            SELECT COALESCE(ROUND(CAST(AVG(pc.progress_percentage) AS numeric), 2), 0)
            FROM purchased_courses pc
            WHERE pc.course_id = :courseId
            """, nativeQuery = true)
    Double calculateCourseCompletion(@Param("courseId") String courseId);
}
