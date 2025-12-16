package com.codelearn.dto;

import java.util.List;

public class CourseDetailResponse {
    private String id;
    private String title;
    private String description;
    private String instructor;
    private Long instructorId;
    private String duration;
    private Integer lessons;
    private String thumbnailUrl;
    private Double rating;
    private Integer numRatings;
    private String price;
    private Integer students;
    private Double completion;
    private String status;
    private String level;
    private String language;
    private Long categoryId;
    private String requirements;
    private String whatYouLearn;
    private String targetAudience;
    private List<SectionWithVideos> sections;
    
    public static class SectionWithVideos {
        private Long id;
        private String title;
        private String description;
        private Integer orderIndex;
        private List<VideoInfo> videos;
        
        public SectionWithVideos() {}
        
        public SectionWithVideos(Long id, String title, String description, Integer orderIndex, List<VideoInfo> videos) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.orderIndex = orderIndex;
            this.videos = videos;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
        
        public List<VideoInfo> getVideos() { return videos; }
        public void setVideos(List<VideoInfo> videos) { this.videos = videos; }
    }
    
    public static class VideoInfo {
        private Long id;
        private String title;
        private String videoUrl;
        private Integer duration; // in seconds
        private Integer orderIndex;
        
        public VideoInfo() {}
        
        public VideoInfo(Long id, String title, String videoUrl, Integer duration, Integer orderIndex) {
            this.id = id;
            this.title = title;
            this.videoUrl = videoUrl;
            this.duration = duration;
            this.orderIndex = orderIndex;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getVideoUrl() { return videoUrl; }
        public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
        
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    }
    
    public CourseDetailResponse() {}
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    
    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public Integer getLessons() { return lessons; }
    public void setLessons(Integer lessons) { this.lessons = lessons; }
    
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getNumRatings() { return numRatings; }
    public void setNumRatings(Integer numRatings) { this.numRatings = numRatings; }
    
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    
    public Integer getStudents() { return students; }
    public void setStudents(Integer students) { this.students = students; }
    
    public Double getCompletion() { return completion; }
    public void setCompletion(Double completion) { this.completion = completion; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    
    public String getWhatYouLearn() { return whatYouLearn; }
    public void setWhatYouLearn(String whatYouLearn) { this.whatYouLearn = whatYouLearn; }
    
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    
    public List<SectionWithVideos> getSections() { return sections; }
    public void setSections(List<SectionWithVideos> sections) { this.sections = sections; }
}
