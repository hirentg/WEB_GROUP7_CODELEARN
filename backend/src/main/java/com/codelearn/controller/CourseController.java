package com.codelearn.controller;

import com.codelearn.model.Course;
import com.codelearn.repository.CourseRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

        private final CourseRepository courseRepository;

        public CourseController(CourseRepository courseRepository) {
                this.courseRepository = courseRepository;
        }

        @GetMapping
        public List<Course> getCourses() {
                List<Course> courses = courseRepository.findAll();
                System.out.println("Returning " + courses.size() + " courses from database");
                return courses;
        }

        @GetMapping("/{id}")
        public ResponseEntity<Course> getCourseById(@PathVariable String id) {
                return courseRepository.findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }
}
