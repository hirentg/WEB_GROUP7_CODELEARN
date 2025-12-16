package com.codelearn.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String instructor;

    private String duration;

    private int lessons;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "promo_video_url")
    private String promoVideoUrl;

    private double rating;

    @Column(name = "num_ratings")
    private int numRatings;

    @Column(nullable = false)
    private String price;

    @Column(name = "discount_price")
    private String discountPrice;

    @Column(nullable = false)
    private String level = "ALL_LEVELS";

    private String language = "English";

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    @JsonIgnore
    private List<Section> sections = new ArrayList<>();

    public Course() {
    }

    public Course(String id, String title, String instructor, String duration, int lessons,
            String thumbnailUrl, double rating, int numRatings, String price) {
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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public int getLessons() {
        return lessons;
    }

    public void setLessons(int lessons) {
        this.lessons = lessons;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getPromoVideoUrl() {
        return promoVideoUrl;
    }

    public void setPromoVideoUrl(String promoVideoUrl) {
        this.promoVideoUrl = promoVideoUrl;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getNumRatings() {
        return numRatings;
    }

    public void setNumRatings(int numRatings) {
        this.numRatings = numRatings;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(String discountPrice) {
        this.discountPrice = discountPrice;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    public void addSection(Section section) {
        sections.add(section);
        section.setCourse(this);
    }

    /**
     * Parse price string to BigDecimal
     * Handles formats like "$14.99", "14.99", "Free"
     */
    public BigDecimal getPriceAsDecimal() {
        if (price == null || price.equalsIgnoreCase("Free")) {
            return BigDecimal.ZERO;
        }
        String cleaned = price.replaceAll("[^\\d.]", "");
        try {
            return new BigDecimal(cleaned);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}
