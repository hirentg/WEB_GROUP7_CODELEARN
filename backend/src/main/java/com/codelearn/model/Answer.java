package com.codelearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_id", nullable = false)
    private Long questionId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(nullable = false)
    private Integer upvotes = 0;
    
    @Column(name = "is_instructor_answer", nullable = false)
    private Boolean isInstructorAnswer = false;
    
    @Column(name = "is_best_answer", nullable = false)
    private Boolean isBestAnswer = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    private Question question;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    // Constructors
    public Answer() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Answer(Long questionId, Long userId, String content) {
        this.questionId = questionId;
        this.userId = userId;
        this.content = content;
        this.upvotes = 0;
        this.isInstructorAnswer = false;
        this.isBestAnswer = false;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getUpvotes() {
        return upvotes;
    }
    
    public void setUpvotes(Integer upvotes) {
        this.upvotes = upvotes;
    }
    
    public Boolean getIsInstructorAnswer() {
        return isInstructorAnswer;
    }
    
    public void setIsInstructorAnswer(Boolean isInstructorAnswer) {
        this.isInstructorAnswer = isInstructorAnswer;
    }
    
    public Boolean getIsBestAnswer() {
        return isBestAnswer;
    }
    
    public void setIsBestAnswer(Boolean isBestAnswer) {
        this.isBestAnswer = isBestAnswer;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Question getQuestion() {
        return question;
    }
    
    public void setQuestion(Question question) {
        this.question = question;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}
