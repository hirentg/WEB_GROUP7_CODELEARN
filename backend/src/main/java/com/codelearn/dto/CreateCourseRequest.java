package com.codelearn.dto;

import java.util.List;

public class CreateCourseRequest {
    private String title;
    private String description;
    private String requirements;
    private String whatYouLearn;
    private String thumbnailUrl;
    private String price;
    private String duration;
    private Integer lessons;
    private String status; // 'draft' or 'published' from client
    private String level; // Optional: BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS
    private String language; // Optional
    private Long categoryId; // Optional
    private List<CreateSectionRequest> sections; // Sections with videos
    
    public CreateCourseRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getWhatYouLearn() {
        return whatYouLearn;
    }

    public void setWhatYouLearn(String whatYouLearn) {
        this.whatYouLearn = whatYouLearn;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getLessons() {
        return lessons;
    }

    public void setLessons(Integer lessons) {
        this.lessons = lessons;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<CreateSectionRequest> getSections() {
        return sections;
    }

    public void setSections(List<CreateSectionRequest> sections) {
        this.sections = sections;
    }
}
