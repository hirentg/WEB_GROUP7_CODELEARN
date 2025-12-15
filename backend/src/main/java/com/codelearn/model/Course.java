package com.codelearn.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    private String id;
    
    private String title;
    private String instructor;
    private String duration;
    private int lessons;
    private String thumbnailUrl;
    private double rating;
    private int numRatings;
    private String price;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Video> videos;

    public Course() {}

    public Course(String id, String title, String instructor, String duration, int lessons, String thumbnailUrl, double rating, int numRatings, String price) {
        this.id = id;
        this.title = title;
        this.instructor = instructor;
        this.duration = duration;
        this.lessons = lessons;
        this.thumbnailUrl = thumbnailUrl;
        this.rating = rating;
        this.numRatings = numRatings;
        this.price = price;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
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
    public List<Video> getVideos() { return videos; }
    public void setVideos(List<Video> videos) { this.videos = videos; }
}


