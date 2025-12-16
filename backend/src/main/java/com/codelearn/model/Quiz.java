package com.codelearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
public class Quiz {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "video_id")
    private Long videoId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "passing_score", nullable = false)
    private Integer passingScore = 70;
    
    @Column(name = "time_limit_minutes", nullable = false)
    private Integer timeLimitMinutes;
    
    @Column(nullable = false)
    private String status = "DRAFT";
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public Quiz() {}
    
    public Quiz(Long videoId, String title, String description, Integer passingScore, Integer timeLimitMinutes) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
