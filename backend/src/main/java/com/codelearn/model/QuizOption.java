package com.codelearn.model;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_options")
public class QuizOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_id", nullable = false)
    private Long questionId;
    
    @Column(name = "option_text", nullable = false)
    private String optionText;
    
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    public QuizOption() {}
    
    public QuizOption(Long questionId, String optionText, Boolean isCorrect, Integer orderIndex) {
        this.questionId = questionId;
        this.optionText = optionText;
        this.isCorrect = isCorrect;
        this.orderIndex = orderIndex;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    
    public String getOptionText() { return optionText; }
    public void setOptionText(String optionText) { this.optionText = optionText; }
    
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
