package com.codelearn.repository;

import com.codelearn.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByQuizId(Long quizId);
    
    Long countByQuizId(Long quizId);
    
    void deleteByQuizId(Long quizId);
    
    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa WHERE qa.quizId = :quizId")
    Double calculateAverageScore(@Param("quizId") Long quizId);
}
