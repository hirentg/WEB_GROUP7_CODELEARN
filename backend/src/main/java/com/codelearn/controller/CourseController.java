package com.codelearn.controller;

import com.codelearn.model.Course;
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

    private List<Course> sampleCourses() {
        return List.of(
                new Course(
                        "react-pro",
                        "React for Professionals",
                        "Jane Doe",
                        "8h 15m",
                        72,
                        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                        4.7,
                        12847,
                        "$14.99"
                ),
                new Course(
                        "spring-boot-zero-to-hero",
                        "Spring Boot Zero to Hero",
                        "John Smith",
                        "11h 02m",
                        95,
                        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
                        4.6,
                        9031,
                        "$12.99"
                ),
                new Course(
                        "ts-mastery",
                        "TypeScript Mastery",
                        "Alex Johnson",
                        "6h 40m",
                        54,
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                        4.8,
                        15230,
                        "$16.99"
                ),
                new Course(
                        "java-fundamentals",
                        "Java Fundamentals",
                        "Mary Lee",
                        "9h 20m",
                        80,
                        "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
                        4.5,
                        11012,
                        "$11.99"
                ),
                new Course(
                        "fullstack-react-spring",
                        "Full‑Stack React & Spring",
                        "Chris Martin",
                        "12h 05m",
                        102,
                        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                        4.7,
                        8453,
                        "$15.99"
                )
        );
    }

    @GetMapping
    public List<Course> getCourses() {
        List<Course> courses = sampleCourses();
        System.out.println("Returning " + courses.size() + " courses");
        return courses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return sampleCourses().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


