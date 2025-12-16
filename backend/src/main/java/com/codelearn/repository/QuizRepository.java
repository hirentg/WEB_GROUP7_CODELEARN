package com.codelearn.repository;

import com.codelearn.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByVideoId(Long videoId);
    
    @Query("SELECT q FROM Quiz q " +
           "JOIN Video v ON q.videoId = v.id " +
           "JOIN Course c ON v.courseId = c.id " +
           "WHERE c.instructorId = :instructorId")
    List<Quiz> findByInstructorId(@Param("instructorId") Long instructorId);
}
