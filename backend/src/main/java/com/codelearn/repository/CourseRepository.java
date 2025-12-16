package com.codelearn.repository;

import com.codelearn.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    List<Course> findAllByOrderByRatingDesc();

    List<Course> findByInstructorContainingIgnoreCase(String instructor);

    List<Course> findByTitleContainingIgnoreCase(String title);
}
