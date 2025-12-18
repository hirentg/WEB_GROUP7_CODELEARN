package com.codelearn.repository;

import com.codelearn.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    // Get all answers for a specific question
    List<Answer> findByQuestionIdOrderByCreatedAtAsc(Long questionId);
    
    // Get instructor answers for a question
    List<Answer> findByQuestionIdAndIsInstructorAnswerTrueOrderByCreatedAtAsc(Long questionId);
    
    // Count answers for a question
    Long countByQuestionId(Long questionId);
}
