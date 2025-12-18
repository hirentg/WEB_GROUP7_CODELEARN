package com.codelearn.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionResponse {
    
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long videoId;
    private String videoTitle;
    private String courseId;
    private String courseTitle;
    private String title;
    private String content;
    private Integer upvotes;
    private Boolean isAnswered;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer answerCount;
    private List<AnswerInfo> answers;
    
    public static class AnswerInfo {
        private Long id;
        private Long userId;
        private String userName;
        private String userAvatar;
        private String content;
        private Integer upvotes;
        private Boolean isInstructorAnswer;
        private Boolean isBestAnswer;
        private LocalDateTime createdAt;
        
        public AnswerInfo() {}
        
        public AnswerInfo(Long id, Long userId, String userName, String userAvatar, String content, 
                         Integer upvotes, Boolean isInstructorAnswer, Boolean isBestAnswer, LocalDateTime createdAt) {
            this.id = id;
            this.userId = userId;
            this.userName = userName;
            this.userAvatar = userAvatar;
            this.content = content;
            this.upvotes = upvotes;
            this.isInstructorAnswer = isInstructorAnswer;
            this.isBestAnswer = isBestAnswer;
            this.createdAt = createdAt;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        
        public String getUserAvatar() { return userAvatar; }
        public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public Integer getUpvotes() { return upvotes; }
        public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }
        
        public Boolean getIsInstructorAnswer() { return isInstructorAnswer; }
        public void setIsInstructorAnswer(Boolean isInstructorAnswer) { this.isInstructorAnswer = isInstructorAnswer; }
        
        public Boolean getIsBestAnswer() { return isBestAnswer; }
        public void setIsBestAnswer(Boolean isBestAnswer) { this.isBestAnswer = isBestAnswer; }
        
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
    
    public QuestionResponse() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }
    
    public Long getVideoId() { return videoId; }
    public void setVideoId(Long videoId) { this.videoId = videoId; }
    
    public String getVideoTitle() { return videoTitle; }
    public void setVideoTitle(String videoTitle) { this.videoTitle = videoTitle; }
    
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }
    
    public Boolean getIsAnswered() { return isAnswered; }
    public void setIsAnswered(Boolean isAnswered) { this.isAnswered = isAnswered; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Integer getAnswerCount() { return answerCount; }
    public void setAnswerCount(Integer answerCount) { this.answerCount = answerCount; }
    
    public List<AnswerInfo> getAnswers() { return answers; }
    public void setAnswers(List<AnswerInfo> answers) { this.answers = answers; }
}
