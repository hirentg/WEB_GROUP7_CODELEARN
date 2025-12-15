package com.codelearn.service;

import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.VideoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Course getCourseById(String id) {
        return courseRepository.findById(id).orElse(null);
    }
    
    public List<Video> getCourseVideos(String courseId) {
        return videoRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
    
    @Transactional
    public void initializeSampleCourses() {
        // Initialize courses if they don't exist
        if (courseRepository.count() == 0) {
            Course course1 = new Course(
                    "react-pro",
                    "React for Professionals",
                    "Jane Doe",
                    "8h 15m",
                    72,
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                    4.7,
                    12847,
                    "$14.99"
            );
            courseRepository.save(course1);
            
            Course course2 = new Course(
                    "spring-boot-zero-to-hero",
                    "Spring Boot Zero to Hero",
                    "John Smith",
                    "11h 02m",
                    95,
                    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
                    4.6,
                    9031,
                    "$12.99"
            );
            courseRepository.save(course2);
            
            Course course3 = new Course(
                    "ts-mastery",
                    "TypeScript Mastery",
                    "Alex Johnson",
                    "6h 40m",
                    54,
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                    4.8,
                    15230,
                    "$16.99"
            );
            courseRepository.save(course3);
            
            Course course4 = new Course(
                    "java-fundamentals",
                    "Java Fundamentals",
                    "Mary Lee",
                    "9h 20m",
                    80,
                    "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
                    4.5,
                    11012,
                    "$11.99"
            );
            courseRepository.save(course4);
            
            Course course5 = new Course(
                    "fullstack-react-spring",
                    "Full‑Stack React & Spring",
                    "Chris Martin",
                    "12h 05m",
                    102,
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                    4.7,
                    8453,
                    "$15.99"
            );
            courseRepository.save(course5);
            
            // Initialize sample videos for course1
            Video video1 = new Video("Introduction to React", "Learn the basics of React", 
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                    900, 1);
            video1.setCourse(course1);
            videoRepository.save(video1);
            
            Video video2 = new Video("Components and Props", "Understanding React components", 
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                    1200, 2);
            video2.setCourse(course1);
            videoRepository.save(video2);
            
            Video video3 = new Video("State and Lifecycle", "Managing state in React", 
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                    1500, 3);
            video3.setCourse(course1);
            videoRepository.save(video3);
        }
    }
}

