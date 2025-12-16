package com.codelearn.dto;

import java.util.List;

public class CreateQuizRequest {
    private Long videoId;
    private String title;
    private String description;
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private String status; // DRAFT or ACTIVE
    private List<QuestionRequest> questions;
    
    public static class QuestionRequest {
        private String questionText;
        private String questionType; // TRUE_FALSE, SINGLE_CHOICE
        private Integer points;
        private String explanation;
        private Integer orderIndex;
        private List<OptionRequest> options;
        private Integer correctAnswerIndex; // Index of correct answer in options array
        
        public QuestionRequest() {}
        
        // Getters and Setters
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        
        public String getQuestionType() { return questionType; }
        public void setQuestionType(String questionType) { this.questionType = questionType; }
        
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
        
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
        
        public List<OptionRequest> getOptions() { return options; }
        public void setOptions(List<OptionRequest> options) { this.options = options; }
        
        public Integer getCorrectAnswerIndex() { return correctAnswerIndex; }
        public void setCorrectAnswerIndex(Integer correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }
    }
    
    public static class OptionRequest {
        private String optionText;
        private Integer orderIndex;
        
        public OptionRequest() {}
        
        public OptionRequest(String optionText, Integer orderIndex) {
            this.optionText = optionText;
            this.orderIndex = orderIndex;
        }
        
        // Getters and Setters
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    }
    
    public CreateQuizRequest() {}
    
    // Getters and Setters
    public Long getVideoId() { return videoId; }
    public void setVideoId(Long videoId) { this.videoId = videoId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    
    public List<QuestionRequest> getQuestions() { return questions; }
    public void setQuestions(List<QuestionRequest> questions) { this.questions = questions; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
