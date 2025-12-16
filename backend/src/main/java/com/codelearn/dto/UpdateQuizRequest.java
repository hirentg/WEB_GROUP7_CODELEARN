package com.codelearn.dto;

public class UpdateQuizRequest {
    private String title;
    private String description;
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private String status;
    
    public UpdateQuizRequest() {}
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
