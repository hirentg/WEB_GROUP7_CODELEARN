package com.codelearn.dto;

import java.util.List;

public class QuizDetailResponse {
    private Long id;
    private Long videoId;
    private String videoTitle;
    private String courseTitle;
    private String title;
    private String description;
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private String status;
    private List<QuestionDetail> questions;
    
    public static class QuestionDetail {
        private Long id;
        private String questionText;
        private String questionType;
        private Integer points;
        private String explanation;
        private Integer orderIndex;
        private List<OptionDetail> options;
        
        public QuestionDetail() {}
        
        public QuestionDetail(Long id, String questionText, String questionType, Integer points, 
                            String explanation, Integer orderIndex, List<OptionDetail> options) {
            this.id = id;
            this.questionText = questionText;
            this.questionType = questionType;
            this.points = points;
            this.explanation = explanation;
            this.orderIndex = orderIndex;
            this.options = options;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
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
        
        public List<OptionDetail> getOptions() { return options; }
        public void setOptions(List<OptionDetail> options) { this.options = options; }
    }
    
    public static class OptionDetail {
        private Long id;
        private String optionText;
        private Boolean isCorrect;
        private Integer orderIndex;
        
        public OptionDetail() {}
        
        public OptionDetail(Long id, String optionText, Boolean isCorrect, Integer orderIndex) {
            this.id = id;
            this.optionText = optionText;
            this.isCorrect = isCorrect;
            this.orderIndex = orderIndex;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    }
    
    public QuizDetailResponse() {}
    
    public QuizDetailResponse(Long id, Long videoId, String videoTitle, String courseTitle,
                            String title, String description, Integer passingScore, Integer timeLimitMinutes,
                            String status, List<QuestionDetail> questions) {
        this.id = id;
        this.videoId = videoId;
        this.videoTitle = videoTitle;
        this.courseTitle = courseTitle;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.status = status;
        this.questions = questions;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getVideoId() { return videoId; }
    public void setVideoId(Long videoId) { this.videoId = videoId; }
    
    public String getVideoTitle() { return videoTitle; }
    public void setVideoTitle(String videoTitle) { this.videoTitle = videoTitle; }
    
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    
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
    
    public List<QuestionDetail> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDetail> questions) { this.questions = questions; }
}
