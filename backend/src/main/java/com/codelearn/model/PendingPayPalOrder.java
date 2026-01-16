package com.codelearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Pending PayPal Order
 * Stores PayPal order IDs temporarily before capture.
 * This allows state persistence across browser redirects without localStorage.
 */
@Entity
@Table(name = "pending_paypal_orders")
public class PendingPayPalOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String courseId;

    @Column(nullable = false, unique = true)
    private String paypalOrderId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public PendingPayPalOrder() {
    }

    public PendingPayPalOrder(Long userId, String courseId, String paypalOrderId) {
        this.userId = userId;
        this.courseId = courseId;
        this.paypalOrderId = paypalOrderId;
        this.createdAt = LocalDateTime.now();
        // PayPal orders expire after 3 hours, we'll expire after 1 hour
        this.expiresAt = LocalDateTime.now().plusHours(1);
    }

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

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getPaypalOrderId() {
        return paypalOrderId;
    }

    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
