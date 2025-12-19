package com.codelearn.repository;

import com.codelearn.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

        @Query("SELECT q FROM Quiz q " +
                        "JOIN Video v ON q.videoId = v.id " +
                        "WHERE v.courseId = :courseId AND (q.status = 'PUBLISHED' OR q.status = 'ACTIVE')")
        List<Quiz> findByCourseIdAndPublished(@Param("courseId") String courseId);

        // Delete quizzes by video IDs (for cascade delete when updating course)
        @Modifying
        @Query("DELETE FROM Quiz q WHERE q.videoId IN :videoIds")
        void deleteByVideoIdIn(@Param("videoIds") List<Long> videoIds);
}
