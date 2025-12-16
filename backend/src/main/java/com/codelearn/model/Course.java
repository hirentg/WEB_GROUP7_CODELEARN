package com.codelearn.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    private String id;
    
    private String title;
    
    private String subtitle;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "instructor_id")
    private Long instructorId;
    
    private String instructor;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    private String language;
    
    private String duration;
    private int lessons;
    private String thumbnailUrl;
    private double rating;
    private int numRatings;
    private String price;
    
    @Column(name = "total_enrollments")
    private int students;
    
    @Transient
    private double completion;
    
    private String status;
    
    private String level;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @Column(name = "what_you_learn", columnDefinition = "TEXT")
    private String whatYouLearn;
    
    @Column(name = "target_audience", columnDefinition = "TEXT")
    private String targetAudience;
    
    @JsonIgnore
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Video> videos;

    public Course() {}

    public Course(String id, String title, String description, String instructor, String duration, int lessons, 
                  String thumbnailUrl, double rating, int numRatings, String price, int students, 
                  double completion, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.duration = duration;
        this.lessons = lessons;
        this.thumbnailUrl = thumbnailUrl;
        this.rating = rating;
        this.numRatings = numRatings;
        this.price = price;
        this.students = students;
        this.completion = completion;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public int getLessons() { return lessons; }
    public void setLessons(int lessons) { this.lessons = lessons; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getNumRatings() { return numRatings; }
    public void setNumRatings(int numRatings) { this.numRatings = numRatings; }
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    public int getStudents() { return students; }
    public void setStudents(int students) { this.students = students; }
    public double getCompletion() { return completion; }
    public void setCompletion(double completion) { this.completion = completion; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    public String getWhatYouLearn() { return whatYouLearn; }
    public void setWhatYouLearn(String whatYouLearn) { this.whatYouLearn = whatYouLearn; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public List<Video> getVideos() { return videos; }
    public void setVideos(List<Video> videos) { this.videos = videos; }
}


