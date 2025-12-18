package com.codelearn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateAnswerRequest {
    
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    public CreateAnswerRequest() {}
    
    public CreateAnswerRequest(Long questionId, String content) {
        this.questionId = questionId;
        this.content = content;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}
