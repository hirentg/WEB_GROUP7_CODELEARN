package com.codelearn.repository;

import com.codelearn.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizIdOrderByOrderIndexAsc(Long quizId);
    Long countByQuizId(Long quizId);
    void deleteByQuizId(Long quizId);
}
