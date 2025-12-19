package com.codelearn.controller;

import com.codelearn.model.Rating;
import com.codelearn.model.User;
import com.codelearn.repository.UserRepository;
import com.codelearn.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;
    private final UserRepository userRepository;

    public RatingController(RatingService ratingService, UserRepository userRepository) {
        this.ratingService = ratingService;
        this.userRepository = userRepository;
    }

    // Submit or update a rating
    @PostMapping
    public ResponseEntity<?> submitRating(@RequestBody RatingRequest request, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
        }

        Rating rating = ratingService.createOrUpdateRating(
                userId,
                request.getCourseId(),
                request.getRating(),
                request.getReview());

        return ResponseEntity.ok(rating);
    }

    // Get all ratings for a course (public)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Rating>> getCourseRatings(@PathVariable String courseId) {
        List<Rating> ratings = ratingService.getCourseRatings(courseId);
        return ResponseEntity.ok(ratings);
    }

    // Get current user's rating for a course
    @GetMapping("/user/{courseId}")
    public ResponseEntity<?> getUserRating(@PathVariable String courseId, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }
        return ratingService.getUserRatingForCourse(userId, courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // Delete a rating
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }
        try {
            ratingService.deleteRating(id, userId);
            return ResponseEntity.ok(Map.of("message", "Rating deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long getUserIdFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user.getId();
            }
        }
        return null;
    }

    // Inner class for request body
    public static class RatingRequest {
        private String courseId;
        private Integer rating;
        private String review;

        public String getCourseId() {
            return courseId;
        }

        public void setCourseId(String courseId) {
            this.courseId = courseId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getReview() {
            return review;
        }

        public void setReview(String review) {
            this.review = review;
        }
    }
}
