package com.codelearn.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "video_url", nullable = false)
    private String videoUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(nullable = false)
    private int duration; // in seconds

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "is_free_preview")
    private boolean isFreePreview = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    @JsonIgnore
    private Section section;

    public Video() {
    }

    public Video(String title, String videoUrl, int duration, int orderIndex) {
        this.title = title;
        this.videoUrl = videoUrl;
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

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public boolean isFreePreview() {
        return isFreePreview;
    }

    public void setFreePreview(boolean freePreview) {
        this.isFreePreview = freePreview;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    // Helper method to get duration formatted
    public String getFormattedDuration() {
        int minutes = duration / 60;
        int seconds = duration % 60;
        return String.format("%d:%02d", minutes, seconds);
    }
}
