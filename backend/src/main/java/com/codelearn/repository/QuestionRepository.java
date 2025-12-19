package com.codelearn.repository;

import com.codelearn.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

       // Get all questions for a specific video
       List<Question> findByVideoIdOrderByCreatedAtDesc(Long videoId);

       // Get all questions by a specific user
       List<Question> findByUserIdOrderByCreatedAtDesc(Long userId);

       // Get unanswered questions for a video
       List<Question> findByVideoIdAndIsAnsweredFalseOrderByCreatedAtDesc(Long videoId);

       // Get questions by video and instructor (for instructor view)
       @Query("SELECT q FROM Question q WHERE q.videoId IN " +
                     "(SELECT v.id FROM Video v WHERE v.course.instructorId = :instructorId) " +
                     "ORDER BY q.createdAt DESC")
       List<Question> findQuestionsByInstructorId(@Param("instructorId") Long instructorId);

       // Get unanswered questions for instructor
       @Query("SELECT q FROM Question q WHERE q.videoId IN " +
                     "(SELECT v.id FROM Video v WHERE v.course.instructorId = :instructorId) " +
                     "AND q.isAnswered = false " +
                     "ORDER BY q.createdAt DESC")
       List<Question> findUnansweredQuestionsByInstructorId(@Param("instructorId") Long instructorId);

       // Get questions for a specific course
       @Query("SELECT q FROM Question q WHERE q.videoId IN " +
                     "(SELECT v.id FROM Video v WHERE v.course.id = :courseId) " +
                     "ORDER BY q.createdAt DESC")
       List<Question> findQuestionsByCourseId(@Param("courseId") String courseId);

       // Count pending questions for instructor
       @Query("SELECT COUNT(q) FROM Question q WHERE q.videoId IN " +
                     "(SELECT v.id FROM Video v WHERE v.course.instructorId = :instructorId) " +
                     "AND q.isAnswered = false")
       Long countPendingQuestionsByInstructorId(@Param("instructorId") Long instructorId);

       // Delete questions by video IDs (for cascade delete when updating course)
       @Modifying
       @Query("DELETE FROM Question q WHERE q.videoId IN :videoIds")
       void deleteByVideoIdIn(@Param("videoIds") List<Long> videoIds);
}
