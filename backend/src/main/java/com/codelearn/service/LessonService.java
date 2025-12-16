package com.codelearn.service;

import com.codelearn.dto.CourseLessonsDTO;
import com.codelearn.exception.ResourceNotFoundException;
import com.codelearn.model.Course;
import com.codelearn.model.Section;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.SectionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;
    private final PurchasedCourseService purchasedCourseService;

    public LessonService(SectionRepository sectionRepository,
            CourseRepository courseRepository,
            PurchasedCourseService purchasedCourseService) {
        this.sectionRepository = sectionRepository;
        this.courseRepository = courseRepository;
        this.purchasedCourseService = purchasedCourseService;
    }

    /**
     * Get course lessons - REQUIRES OWNERSHIP VERIFICATION
     * 
     * SECURITY: Verifies user owns the course before returning video URLs
     */
    public CourseLessonsDTO getCourseLessons(Long userId, String courseId) {
        // SECURITY: Verify user owns the course
        if (!purchasedCourseService.hasAccess(userId, courseId)) {
            throw new AccessDeniedException("You must purchase this course to view lessons");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);

        return CourseLessonsDTO.from(courseId, course.getTitle(), sections);
    }

    /**
     * Get course sections without full video URLs (for preview)
     * This can be used on the course details page to show curriculum structure
     */
    public List<Section> getCourseSectionsPreview(String courseId) {
        return sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
}
