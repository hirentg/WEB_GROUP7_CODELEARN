package com.codelearn.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "instructor_profiles")
public class InstructorProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;
    
    @Column(name = "expertise")
    private String expertise;
    
    @Column(name = "qualifications", columnDefinition = "TEXT")
    private String qualifications;
    
    @Column(name = "total_students", nullable = false)
    private Integer totalStudents = 0;
    
    @Column(name = "total_courses", nullable = false)
    private Integer totalCourses = 0;
    
    @Column(name = "avg_rating", nullable = false)
    private Double avgRating = 0.0;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payout_info", columnDefinition = "json")
    private String payoutInfo;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getExpertise() {
        return expertise;
    }
    
    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }
    
    public String getQualifications() {
        return qualifications;
    }
    
    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }
    
    public Integer getTotalStudents() {
        return totalStudents;
    }
    
    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }
    
    public Integer getTotalCourses() {
        return totalCourses;
    }
    
    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }
    
    public Double getAvgRating() {
        return avgRating;
    }
    
    public void setAvgRating(Double avgRating) {
        this.avgRating = avgRating;
    }
    
    public String getPayoutInfo() {
        return payoutInfo;
    }
    
    public void setPayoutInfo(String payoutInfo) {
        this.payoutInfo = payoutInfo;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
}
