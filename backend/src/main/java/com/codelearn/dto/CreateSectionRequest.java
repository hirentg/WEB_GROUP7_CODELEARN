package com.codelearn.dto;

import java.util.List;

public class CreateSectionRequest {
    private Long id; // null for new sections, set for existing sections
    private String title;
    private String description;
    private Integer orderIndex;
    private List<CreateVideoRequest> videos;

    public CreateSectionRequest() {
    }

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

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<CreateVideoRequest> getVideos() {
        return videos;
    }

    public void setVideos(List<CreateVideoRequest> videos) {
        this.videos = videos;
    }
}
