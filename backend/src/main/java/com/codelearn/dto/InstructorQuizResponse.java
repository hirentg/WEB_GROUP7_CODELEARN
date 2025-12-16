package com.codelearn.dto;

public class InstructorQuizResponse {
    private Long id;
    private String title;
    private String description;
    private String courseTitle;
    private String courseId;
    private Long videoId;
    private String videoTitle;
    private Integer questions; // total questions count
    private Integer attempts; // total attempts count
    private Double avgScore; // average score from all attempts
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private String status; // active or draft
    
    public InstructorQuizResponse() {}
    
    public InstructorQuizResponse(Long id, String title, String description, String courseTitle, 
                                   String courseId, Long videoId, String videoTitle, Integer questions, 
                                   Integer attempts, Double avgScore, Integer passingScore, 
                                   Integer timeLimitMinutes, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseTitle = courseTitle;
        this.courseId = courseId;
        this.videoId = videoId;
        this.videoTitle = videoTitle;
        this.questions = questions;
        this.attempts = attempts;
        this.avgScore = avgScore;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    
    public Long getVideoId() { return videoId; }
    public void setVideoId(Long videoId) { this.videoId = videoId; }
    
    public String getVideoTitle() { return videoTitle; }
    public void setVideoTitle(String videoTitle) { this.videoTitle = videoTitle; }
    
    public Integer getQuestions() { return questions; }
    public void setQuestions(Integer questions) { this.questions = questions; }
    
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    
    public Double getAvgScore() { return avgScore; }
    public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }
    
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
