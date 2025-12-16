package com.codelearn.config;

import com.codelearn.model.Course;
import com.codelearn.model.Section;
import com.codelearn.model.Video;
import com.codelearn.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initializes sample data for courses, sections, and videos
 * This runs on application startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final CourseRepository courseRepository;

    public DataInitializer(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (courseRepository.count() > 0) {
            System.out.println("Database already has courses, skipping initialization");
            return;
        }

        System.out.println("Initializing sample course data...");

        // Create React Pro course
        Course reactCourse = createCourse(
                "react-pro",
                "React for Professionals",
                "Jane Doe",
                "8h 15m",
                72,
                "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                4.7,
                12847,
                "$14.99");
        reactCourse.setDescription(
                "Master React with this comprehensive course. Learn hooks, context, Redux, and build real-world applications.");
        reactCourse
                .setPromoVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");

        addSection(reactCourse, "Getting Started with React", 1, new String[][] {
                { "Introduction to React",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "600",
                        "true" },
                { "Setting Up Your Development Environment",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "480",
                        "false" },
                { "Your First React Component",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "720",
                        "false" }
        });
        addSection(reactCourse, "React Hooks Deep Dive", 2, new String[][] {
                { "Understanding useState",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", "540",
                        "false" },
                { "Working with useEffect",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", "660",
                        "false" },
                { "Custom Hooks",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                        "780", "false" }
        });
        addSection(reactCourse, "State Management with Redux", 3, new String[][] {
                { "Introduction to Redux",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                        "600", "false" },
                { "Actions and Reducers",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", "720",
                        "false" },
                { "Redux Toolkit",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                        "840", "false" }
        });
        courseRepository.save(reactCourse);

        // Create Spring Boot course
        Course springCourse = createCourse(
                "spring-boot-zero-to-hero",
                "Spring Boot Zero to Hero",
                "John Smith",
                "11h 02m",
                95,
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
                4.6,
                9031,
                "$12.99");
        springCourse.setDescription(
                "Learn Spring Boot from scratch. Build production-ready REST APIs, work with databases, and deploy to cloud.");
        springCourse.setPromoVideoUrl(
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4");

        addSection(springCourse, "Spring Boot Fundamentals", 1, new String[][] {
                { "What is Spring Boot?",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "420",
                        "true" },
                { "Project Setup with Spring Initializr",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "540",
                        "false" },
                { "Understanding Auto-Configuration",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "660",
                        "false" }
        });
        addSection(springCourse, "Building REST APIs", 2, new String[][] {
                { "Creating Controllers",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", "600",
                        "false" },
                { "Request Mapping and Parameters",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", "540",
                        "false" },
                { "Exception Handling",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                        "480", "false" }
        });
        courseRepository.save(springCourse);

        // Create TypeScript course
        Course tsCourse = createCourse(
                "ts-mastery",
                "TypeScript Mastery",
                "Alex Johnson",
                "6h 40m",
                54,
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                4.8,
                15230,
                "$16.99");
        tsCourse.setDescription(
                "Master TypeScript and build type-safe applications. From basics to advanced patterns.");
        tsCourse.setPromoVideoUrl(
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");

        addSection(tsCourse, "TypeScript Basics", 1, new String[][] {
                { "Why TypeScript?",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "360",
                        "true" },
                { "Types and Interfaces",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "540",
                        "false" },
                { "Functions and Generics",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "660",
                        "false" }
        });
        courseRepository.save(tsCourse);

        // Create Java Fundamentals course
        Course javaCourse = createCourse(
                "java-fundamentals",
                "Java Fundamentals",
                "Mary Lee",
                "9h 20m",
                80,
                "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
                4.5,
                11012,
                "$11.99");
        javaCourse.setDescription(
                "Learn Java programming from the ground up. Object-oriented programming, collections, and more.");
        javaCourse.setPromoVideoUrl(
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");

        addSection(javaCourse, "Java Basics", 1, new String[][] {
                { "Introduction to Java",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", "480",
                        "true" },
                { "Variables and Data Types",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "540",
                        "false" }
        });
        courseRepository.save(javaCourse);

        // Create Full-Stack course
        Course fullstackCourse = createCourse(
                "fullstack-react-spring",
                "Full-Stack React & Spring",
                "Chris Martin",
                "12h 05m",
                102,
                "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                4.7,
                8453,
                "$15.99");
        fullstackCourse.setDescription(
                "Build full-stack applications with React frontend and Spring Boot backend. Complete project-based learning.");
        fullstackCourse
                .setPromoVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4");

        addSection(fullstackCourse, "Project Overview", 1, new String[][] {
                { "Course Introduction",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", "300",
                        "true" },
                { "Tech Stack Overview",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "420",
                        "false" }
        });
        courseRepository.save(fullstackCourse);

        System.out.println("Sample data initialization complete! Created 5 courses.");
    }

    private Course createCourse(String id, String title, String instructor, String duration,
            int lessons, String thumbnailUrl, double rating, int numRatings, String price) {
        Course course = new Course(id, title, instructor, duration, lessons, thumbnailUrl, rating, numRatings, price);
        return course;
    }

    private void addSection(Course course, String title, int orderIndex, String[][] videos) {
        Section section = new Section(title, orderIndex);
        section.setCourse(course);

        int videoOrder = 1;
        for (String[] videoData : videos) {
            Video video = new Video(videoData[0], videoData[1], Integer.parseInt(videoData[2]), videoOrder++);
            video.setFreePreview(Boolean.parseBoolean(videoData[3]));
            section.addVideo(video);
        }

        course.addSection(section);
    }
}
