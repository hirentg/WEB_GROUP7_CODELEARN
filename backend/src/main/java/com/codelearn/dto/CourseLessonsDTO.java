package com.codelearn.dto;

import com.codelearn.model.Section;
import com.codelearn.model.Video;

import java.util.List;
import java.util.stream.Collectors;

public class CourseLessonsDTO {

    private String courseId;
    private String courseTitle;
    private List<SectionDTO> sections;
    private int totalVideos;
    private int totalDurationSeconds;

    public CourseLessonsDTO() {
    }

    public static CourseLessonsDTO from(String courseId, String courseTitle, List<Section> sections) {
        CourseLessonsDTO dto = new CourseLessonsDTO();
        dto.courseId = courseId;
        dto.courseTitle = courseTitle;
        dto.sections = sections.stream()
                .map(SectionDTO::from)
                .collect(Collectors.toList());
        dto.totalVideos = sections.stream()
                .mapToInt(s -> s.getVideos().size())
                .sum();
        dto.totalDurationSeconds = sections.stream()
                .flatMap(s -> s.getVideos().stream())
                .mapToInt(Video::getDuration)
                .sum();
        return dto;
    }

    // Getters and Setters
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public List<SectionDTO> getSections() {
        return sections;
    }

    public void setSections(List<SectionDTO> sections) {
        this.sections = sections;
    }

    public int getTotalVideos() {
        return totalVideos;
    }

    public void setTotalVideos(int totalVideos) {
        this.totalVideos = totalVideos;
    }

    public int getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public void setTotalDurationSeconds(int totalDurationSeconds) {
        this.totalDurationSeconds = totalDurationSeconds;
    }

    public static class SectionDTO {
        private Long id;
        private String title;
        private int orderIndex;
        private List<VideoDTO> videos;

        public static SectionDTO from(Section section) {
            SectionDTO dto = new SectionDTO();
            dto.id = section.getId();
            dto.title = section.getTitle();
            dto.orderIndex = section.getOrderIndex();
            dto.videos = section.getVideos().stream()
                    .map(VideoDTO::from)
                    .collect(Collectors.toList());
            return dto;
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

        public int getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(int orderIndex) {
            this.orderIndex = orderIndex;
        }

        public List<VideoDTO> getVideos() {
            return videos;
        }

        public void setVideos(List<VideoDTO> videos) {
            this.videos = videos;
        }
    }

    public static class VideoDTO {
        private Long id;
        private String title;
        private String description;
        private String videoUrl;
        private String thumbnailUrl;
        private int duration;
        private int orderIndex;
        private boolean isFreePreview;

        public static VideoDTO from(Video video) {
            VideoDTO dto = new VideoDTO();
            dto.id = video.getId();
            dto.title = video.getTitle();
            dto.description = video.getDescription();
            dto.videoUrl = video.getVideoUrl();
            dto.thumbnailUrl = video.getThumbnailUrl();
            dto.duration = video.getDuration();
            dto.orderIndex = video.getOrderIndex();
            dto.isFreePreview = video.isFreePreview();
            return dto;
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
    }
}
