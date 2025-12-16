package com.codelearn.dto;

import java.time.LocalDateTime;

public class InstructorProfileResponse {
    // User info
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String website;
    private LocalDateTime createdAt;
    
    // Instructor profile info
    private String expertise;
    private String qualifications;
    private Integer totalStudents;
    private Integer totalCourses;
    private Double avgRating;
    private Boolean isVerified;
    
    public InstructorProfileResponse() {}
    
    public InstructorProfileResponse(Long id, String name, String email, String avatarUrl, String bio,
                                   String website, LocalDateTime createdAt, String expertise, String qualifications,
                                   Integer totalStudents, Integer totalCourses, Double avgRating, Boolean isVerified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.website = website;
        this.createdAt = createdAt;
        this.expertise = expertise;
        this.qualifications = qualifications;
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.avgRating = avgRating;
        this.isVerified = isVerified;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    
    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }
    
    public Integer getTotalCourses() { return totalCourses; }
    public void setTotalCourses(Integer totalCourses) { this.totalCourses = totalCourses; }
    
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
}
