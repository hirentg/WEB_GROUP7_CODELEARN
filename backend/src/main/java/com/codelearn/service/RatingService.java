package com.codelearn.service;

import com.codelearn.model.Rating;
import com.codelearn.model.User;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.RatingRepository;
import com.codelearn.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Rating createOrUpdateRating(Long userId, String courseId, Integer rating, String review) {
        // Check if user already rated this course
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndCourseId(userId, courseId);

        Rating ratingEntity;
        if (existingRating.isPresent()) {
            // Update existing rating
            ratingEntity = existingRating.get();
            ratingEntity.setRating(rating);
            ratingEntity.setReview(review);
            ratingEntity.setUpdatedAt(LocalDateTime.now());
        } else {
            // Create new rating
            ratingEntity = new Rating(userId, courseId, rating, review);
        }

        Rating savedRating = ratingRepository.save(ratingEntity);

        // Update course aggregate rating
        updateCourseRating(courseId);

        return savedRating;
    }

    public List<Rating> getCourseRatings(String courseId) {
        List<Rating> ratings = ratingRepository.findByCourseIdOrderByCreatedAtDesc(courseId);

        // Populate user info for each rating
        for (Rating rating : ratings) {
            User user = userRepository.findById(rating.getUserId()).orElse(null);
            if (user != null) {
                rating.setUserName(user.getName());
                rating.setUserAvatar(user.getAvatarUrl());
            }
        }

        return ratings;
    }

    public Optional<Rating> getUserRatingForCourse(Long userId, String courseId) {
        return ratingRepository.findByUserIdAndCourseId(userId, courseId);
    }

    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        if (!rating.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this rating");
        }

        String courseId = rating.getCourseId();
        ratingRepository.delete(rating);

        // Update course aggregate rating
        updateCourseRating(courseId);
    }

    private void updateCourseRating(String courseId) {
        Double averageRating = ratingRepository.findAverageRatingByCourseId(courseId);
        Long ratingCount = ratingRepository.countByCourseId(courseId);

        courseRepository.findById(courseId).ifPresent(course -> {
            course.setRating(averageRating != null ? averageRating : 0.0);
            course.setNumRatings(ratingCount != null ? ratingCount.intValue() : 0);
            courseRepository.save(course);
        });
    }
}
