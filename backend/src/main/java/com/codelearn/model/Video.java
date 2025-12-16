package com.codelearn.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "videos")
public class Video {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "section_id")
    private Long sectionId;
    
    @Column(name = "course_id", insertable = false, updatable = false)
    private String courseId;
    
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer duration; // in seconds
    private Integer orderIndex; // order in course
    
    @Column(name = "content_type")
    private String contentType; // VIDEO, ARTICLE, QUIZ
    
    @Column(name = "is_preview")
    private Boolean isPreview;
    
    @Column(name = "is_free")
    private Boolean isFree;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", insertable = false, updatable = false)
    private Section section;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;
    
    public Video() {}
    
    public Video(String title, String description, String videoUrl, String thumbnailUrl, Integer duration, Integer orderIndex) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.duration = duration;
        this.orderIndex = orderIndex;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getVideoUrl() {
        return videoUrl;
    }
    
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
    
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }
    
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public Boolean getIsPreview() {
        return isPreview;
    }
    
    public void setIsPreview(Boolean isPreview) {
        this.isPreview = isPreview;
    }
    
    public Boolean getIsFree() {
        return isFree;
    }
    
    public void setIsFree(Boolean isFree) {
        this.isFree = isFree;
    }
    
    public Long getSectionId() {
        return sectionId;
    }
    
    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
    
    public Section getSection() {
        return section;
    }
    
    public void setSection(Section section) {
        this.section = section;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
}

