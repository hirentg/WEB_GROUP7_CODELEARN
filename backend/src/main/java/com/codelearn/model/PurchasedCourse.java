package com.codelearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchased_courses", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "course_id" }))
public class PurchasedCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(name = "purchased_at", nullable = false)
    private LocalDateTime purchasedAt;

    @Column(name = "progress_percent")
    private int progressPercent = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    public PurchasedCourse() {
        this.purchasedAt = LocalDateTime.now();
    }

    public PurchasedCourse(User user, String courseId) {
        this.user = user;
        this.courseId = courseId;
        this.purchasedAt = LocalDateTime.now();
        this.progressPercent = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public void setPurchasedAt(LocalDateTime purchasedAt) {
        this.purchasedAt = purchasedAt;
    }

    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = Math.min(100, Math.max(0, progressPercent));
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }
}
