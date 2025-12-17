package com.codelearn.service;

import com.codelearn.dto.CourseDetailResponse;
import com.codelearn.dto.CreateCourseRequest;
import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private VideoRepository videoRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public CourseDetailResponse getCourseDetailById(String id) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return null;
        }
        Course course = courseOpt.get();
        CourseDetailResponse response = new CourseDetailResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setSubtitle(course.getSubtitle());
        response.setDescription(course.getDescription());
        response.setInstructor(course.getInstructor());
        response.setDuration(course.getDuration());
        response.setLessons(course.getLessons());
        response.setThumbnailUrl(course.getThumbnailUrl());
        response.setPromoVideoUrl(course.getPromoVideoUrl());
        response.setRating(course.getRating());
        response.setNumRatings(course.getNumRatings());
        response.setPrice(course.getPrice());
        response.setDiscountPrice(course.getDiscountPrice());
        response.setLevel(course.getLevel());
        response.setLanguage(course.getLanguage());
        return response;
    }

    public List<Course> getInstructorCourses(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    @Transactional
    public Course createCourse(CreateCourseRequest request, Long instructorId, String instructorName) {
        Course course = new Course();
        course.setId(UUID.randomUUID().toString());
        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setInstructor(instructorName);
        course.setInstructorId(instructorId);
        course.setDuration(request.getDuration() != null ? request.getDuration() : "0h");
        course.setLessons(request.getLessons() != null ? request.getLessons() : 0);
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setPromoVideoUrl(request.getPromoVideoUrl());
        course.setPrice(request.getPrice() != null ? request.getPrice() : "Free");
        course.setDiscountPrice(request.getDiscountPrice());
        course.setLevel(request.getLevel() != null ? request.getLevel() : "ALL_LEVELS");
        course.setLanguage(request.getLanguage() != null ? request.getLanguage() : "English");

        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(String id, CreateCourseRequest request, Long instructorId) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return null;
        }

        Course course = courseOpt.get();

        if (request.getTitle() != null)
            course.setTitle(request.getTitle());
        if (request.getSubtitle() != null)
            course.setSubtitle(request.getSubtitle());
        if (request.getDescription() != null)
            course.setDescription(request.getDescription());
        if (request.getDuration() != null)
            course.setDuration(request.getDuration());
        if (request.getLessons() != null)
            course.setLessons(request.getLessons());
        if (request.getThumbnailUrl() != null)
            course.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getPromoVideoUrl() != null)
            course.setPromoVideoUrl(request.getPromoVideoUrl());
        if (request.getPrice() != null)
            course.setPrice(request.getPrice());
        if (request.getDiscountPrice() != null)
            course.setDiscountPrice(request.getDiscountPrice());
        if (request.getLevel() != null)
            course.setLevel(request.getLevel());
        if (request.getLanguage() != null)
            course.setLanguage(request.getLanguage());

        return courseRepository.save(course);
    }

    @Transactional
    public boolean deleteCourse(String id, Long instructorId) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return false;
        }
        courseRepository.deleteById(id);
        return true;
    }

    public List<Video> getCourseVideos(String courseId) {
        return videoRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
}
