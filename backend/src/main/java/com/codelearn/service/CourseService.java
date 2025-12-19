package com.codelearn.service;

import com.codelearn.dto.CourseDetailResponse;
import com.codelearn.dto.CreateCourseRequest;
import com.codelearn.dto.CreateSectionRequest;
import com.codelearn.dto.CreateVideoRequest;
import com.codelearn.model.Course;
import com.codelearn.model.Section;
import com.codelearn.model.Video;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.QuestionRepository;
import com.codelearn.repository.QuizRepository;
import com.codelearn.repository.SectionRepository;
import com.codelearn.repository.VideoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private static final String DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80";
    private static final String DEFAULT_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Default video
                                                                                                   // placeholder
    private static final String DEFAULT_PROMO_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Default
                                                                                                         // promo video

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;

    /**
     * Get all courses for students/public view
     * Only returns PUBLISHED courses
     */
    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findByStatusIgnoreCase("PUBLISHED");
        // Tính completion cho từng khóa học
        courses.forEach(course -> {
            Double completion = courseRepository.calculateCourseCompletion(course.getId());
            course.setCompletion(completion != null ? completion : 0.0);
        });
        return courses;
    }

    /**
     * Get all courses for a specific instructor
     * Returns ALL courses (both DRAFT and PUBLISHED) for instructor management
     */
    public List<Course> getInstructorCourses(Long instructorId) {
        List<Course> courses = courseRepository.findByInstructorId(instructorId);
        // Tính completion cho từng khóa học
        courses.forEach(course -> {
            Double completion = courseRepository.calculateCourseCompletion(course.getId());
            course.setCompletion(completion != null ? completion : 0.0);
        });
        return courses;
    }

    /**
     * Get only PUBLISHED courses for a specific instructor (for public profile)
     */
    public List<Course> getPublishedCoursesByInstructor(Long instructorId) {
        List<Course> allCourses = courseRepository.findByInstructorId(instructorId);
        return allCourses.stream()
                .filter(course -> "PUBLISHED".equalsIgnoreCase(course.getStatus()))
                .collect(Collectors.toList());
    }

    public Course getCourseById(String id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course != null) {
            Double completion = courseRepository.calculateCourseCompletion(course.getId());
            course.setCompletion(completion != null ? completion : 0.0);
        }
        return course;
    }

    public CourseDetailResponse getCourseDetailById(String id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return null;
        }

        // Calculate completion
        Double completion = courseRepository.calculateCourseCompletion(course.getId());

        // Get sections with videos
        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(id);

        // Map sections to DTO
        List<CourseDetailResponse.SectionWithVideos> sectionDtos = sections.stream()
                .map(section -> {
                    List<Video> videos = videoRepository.findBySectionIdOrderByOrderIndexAsc(section.getId());

                    List<CourseDetailResponse.VideoInfo> videoDtos = videos.stream()
                            .map(video -> new CourseDetailResponse.VideoInfo(
                                    video.getId(),
                                    video.getTitle(),
                                    video.getVideoUrl(),
                                    video.getDuration(),
                                    video.getOrderIndex()))
                            .collect(Collectors.toList());

                    return new CourseDetailResponse.SectionWithVideos(
                            section.getId(),
                            section.getTitle(),
                            section.getDescription(),
                            section.getOrderIndex(),
                            videoDtos);
                })
                .collect(Collectors.toList());

        // Create response DTO
        CourseDetailResponse response = new CourseDetailResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setInstructor(course.getInstructor());
        response.setInstructorId(course.getInstructorId());
        response.setDuration(course.getDuration());
        response.setLessons(course.getLessons());
        response.setThumbnailUrl(course.getThumbnailUrl());
        response.setPromoVideoUrl(course.getPromoVideoUrl());
        response.setRating(course.getRating());
        response.setNumRatings(course.getNumRatings());
        response.setPrice(course.getPrice());
        response.setStudents(course.getStudents());
        response.setCompletion(completion != null ? completion : 0.0);
        response.setStatus(course.getStatus());
        response.setLevel(course.getLevel());
        response.setLanguage(course.getLanguage());
        response.setCategoryId(course.getCategoryId());
        response.setRequirements(course.getRequirements());
        response.setWhatYouLearn(course.getWhatYouLearn());
        response.setTargetAudience(course.getTargetAudience());
        response.setSections(sectionDtos);

        return response;
    }

    public List<Video> getCourseVideos(String courseId) {
        return videoRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    // Search courses by title or description
    public List<Course> searchCourses(String query) {
        return courseRepository.searchByTitleOrDescription(query);
    }

    // Get course sections with videos for public preview
    public List<Section> getCourseSections(String courseId) {
        return sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @Transactional
    public Course createCourse(CreateCourseRequest request, Long instructorId, String instructorName) {
        // Generate unique course ID
        String courseId = generateCourseId(request.getTitle());

        // Use default thumbnail if not provided
        String thumbnailUrl = request.getThumbnailUrl();
        if (thumbnailUrl == null || thumbnailUrl.trim().isEmpty()) {
            thumbnailUrl = DEFAULT_THUMBNAIL;
        }

        // Use default promo video URL if not provided
        String promoVideoUrl = request.getPromoVideoUrl();
        if (promoVideoUrl == null || promoVideoUrl.trim().isEmpty()) {
            promoVideoUrl = DEFAULT_PROMO_VIDEO_URL;
        }

        // Set default values if not provided
        String price = request.getPrice() != null ? request.getPrice() : "$0.00";
        String duration = request.getDuration() != null ? request.getDuration() : "0h 0m";

        // lessons will be calculated from total videos later
        Integer lessons = 0;

        // Handle status from client (convert 'draft' -> 'DRAFT', 'published' ->
        // 'PUBLISHED')
        String status = "DRAFT"; // default
        if (request.getStatus() != null) {
            status = request.getStatus().equalsIgnoreCase("published") ? "PUBLISHED" : "DRAFT";
        }

        // Set default level if not provided
        String level = request.getLevel() != null ? request.getLevel().toUpperCase() : "BEGINNER";
        // Validate level value
        if (!level.matches("BEGINNER|INTERMEDIATE|ADVANCED|ALL_LEVELS")) {
            level = "BEGINNER";
        }

        // Set default language if not provided
        String language = request.getLanguage() != null ? request.getLanguage() : "Vietnamese";

        // Create course with default values
        Course course = new Course(
                courseId,
                request.getTitle(),
                request.getDescription(),
                instructorName, // Use name from JWT token
                duration,
                lessons,
                thumbnailUrl,
                0.0, // rating
                0, // numRatings
                price,
                0, // students
                0.0, // completion
                status // from client or default DRAFT
        );

        // Set instructor ID
        course.setInstructorId(instructorId);

        // Set level
        course.setLevel(level);

        // Set language
        course.setLanguage(language);

        // Set category if provided
        if (request.getCategoryId() != null) {
            course.setCategoryId(request.getCategoryId());
        }

        // Set promo video URL
        course.setPromoVideoUrl(promoVideoUrl);

        // Set additional fields
        if (request.getRequirements() != null) {
            course.setRequirements(request.getRequirements());
        }
        if (request.getWhatYouLearn() != null) {
            course.setWhatYouLearn(request.getWhatYouLearn());
        }

        // Save course first
        Course savedCourse = courseRepository.save(course);

        int totalVideos = 0; // Track total videos count
        int totalDurationSeconds = 0; // Track total duration in seconds

        // Create sections and videos if provided
        if (request.getSections() != null && !request.getSections().isEmpty()) {
            for (CreateSectionRequest sectionReq : request.getSections()) {
                Section section = new Section();
                section.setCourseId(savedCourse.getId());
                section.setTitle(sectionReq.getTitle());
                section.setDescription(sectionReq.getDescription());
                section.setOrderIndex(sectionReq.getOrderIndex());

                Section savedSection = sectionRepository.save(section);

                // Create videos for this section
                if (sectionReq.getVideos() != null && !sectionReq.getVideos().isEmpty()) {
                    for (CreateVideoRequest videoReq : sectionReq.getVideos()) {
                        Integer videoDuration = videoReq.getDuration() != null ? videoReq.getDuration() : 0;

                        // Use default video URL if not provided
                        String videoUrl = videoReq.getVideoUrl();
                        if (videoUrl == null || videoUrl.trim().isEmpty()) {
                            videoUrl = DEFAULT_VIDEO_URL;
                        }

                        Video video = new Video();
                        video.setSectionId(savedSection.getId());
                        video.setCourse(savedCourse);
                        video.setTitle(videoReq.getTitle());
                        video.setVideoUrl(videoUrl);
                        video.setDuration(videoDuration);
                        video.setOrderIndex(videoReq.getOrderIndex());
                        video.setContentType("VIDEO"); // Default content type
                        video.setIsPreview(false);
                        video.setIsFree(false);

                        videoRepository.save(video);
                        totalVideos++; // Count each video
                        totalDurationSeconds += videoDuration; // Sum durations
                    }
                }
            }
        }

        // Update lessons count = total videos
        savedCourse.setLessons(totalVideos);

        // Update duration from total video durations
        savedCourse.setDuration(formatDuration(totalDurationSeconds));

        courseRepository.save(savedCourse);

        return savedCourse;
    }

    private String formatDuration(int totalSeconds) {
        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;

        return hours + " hours " + minutes + " minutes";
    }

    private String generateCourseId(String title) {
        // Generate ID from title (lowercase, replace spaces with hyphens)
        String baseId = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .substring(0, Math.min(title.length(), 30));

        // Add random suffix to ensure uniqueness
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return baseId + "-" + suffix;
    }

    @Transactional
    public void initializeSampleCourses() {
        // Initialize courses if they don't exist
        if (courseRepository.count() == 0) {
            Course course1 = new Course(
                    "react-pro",
                    "React Fundamentals",
                    "Learn the basics of React including components, props, state, and hooks.",
                    "Jane Doe",
                    "8h 15m",
                    72,
                    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
                    4.7,
                    12847,
                    "$14.99",
                    456,
                    82.0,
                    "Published");
            courseRepository.save(course1);

            Course course2 = new Course(
                    "spring-boot-zero-to-hero",
                    "JavaScript Mastery",
                    "Master modern JavaScript ES6+ features and best practices.",
                    "John Smith",
                    "11h 02m",
                    95,
                    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
                    4.6,
                    9031,
                    "$12.99",
                    234,
                    75.0,
                    "Published");
            courseRepository.save(course2);

            Course course3 = new Course(
                    "ts-mastery",
                    "Python Basics",
                    "Introduction to Python programming for beginners.",
                    "Alex Johnson",
                    "6h 40m",
                    54,
                    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
                    4.8,
                    15230,
                    "$16.99",
                    189,
                    68.0,
                    "Published");
            courseRepository.save(course3);

            Course course4 = new Course(
                    "java-fundamentals",
                    "Node.js Backend Development",
                    "Build scalable backend applications with Node.js and Express.",
                    "Mary Lee",
                    "9h 20m",
                    80,
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
                    4.5,
                    11012,
                    "$11.99",
                    312,
                    71.0,
                    "Published");
            courseRepository.save(course4);

            Course course5 = new Course(
                    "fullstack-react-spring",
                    "Advanced TypeScript",
                    "Deep dive into TypeScript type system and advanced patterns.",
                    "Chris Martin",
                    "12h 05m",
                    102,
                    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
                    4.7,
                    8453,
                    "$15.99",
                    0,
                    0.0,
                    "Draft");
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

    @Transactional
    public Course updateCourse(String courseId, CreateCourseRequest request, Long instructorId) {
        // Find the course
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null || !course.getInstructorId().equals(instructorId)) {
            return null; // Course not found or not authorized
        }

        // Update basic course information
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setRequirements(request.getRequirements());
        course.setWhatYouLearn(request.getWhatYouLearn());

        // Update price if provided
        if (request.getPrice() != null && !request.getPrice().trim().isEmpty()) {
            course.setPrice(request.getPrice());
        }

        // Update thumbnail if provided
        if (request.getThumbnailUrl() != null && !request.getThumbnailUrl().trim().isEmpty()) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }

        // Update promo video URL if provided
        if (request.getPromoVideoUrl() != null && !request.getPromoVideoUrl().trim().isEmpty()) {
            course.setPromoVideoUrl(request.getPromoVideoUrl());
        }

        // Update status
        if (request.getStatus() != null) {
            String status = request.getStatus().equalsIgnoreCase("published") ? "PUBLISHED" : "DRAFT";
            course.setStatus(status);
        }

        // Update level if provided
        if (request.getLevel() != null) {
            String level = request.getLevel().toUpperCase();
            if (level.matches("BEGINNER|INTERMEDIATE|ADVANCED|ALL_LEVELS")) {
                course.setLevel(level);
            }
        }

        // Update language if provided
        if (request.getLanguage() != null) {
            course.setLanguage(request.getLanguage());
        }

        // INCREMENTAL UPDATE: Update existing sections/videos, add new ones, remove
        // only deleted ones
        if (request.getSections() != null) {
            // Get existing sections and videos
            List<Section> existingSections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
            List<Video> existingVideos = videoRepository.findByCourseIdOrderByOrderIndexAsc(courseId);

            // Track IDs of sections/videos in the request (to identify what to delete)
            List<Long> requestSectionIds = request.getSections().stream()
                    .filter(s -> s.getId() != null)
                    .map(CreateSectionRequest::getId)
                    .collect(Collectors.toList());

            List<Long> requestVideoIds = request.getSections().stream()
                    .flatMap(s -> s.getVideos() != null ? s.getVideos().stream() : java.util.stream.Stream.empty())
                    .filter(v -> v.getId() != null)
                    .map(CreateVideoRequest::getId)
                    .collect(Collectors.toList());

            // Find videos to delete (exist in DB but not in request)
            List<Long> videoIdsToDelete = existingVideos.stream()
                    .filter(v -> !requestVideoIds.contains(v.getId()))
                    .map(Video::getId)
                    .collect(Collectors.toList());

            // Delete questions and quizzes for videos being removed
            if (!videoIdsToDelete.isEmpty()) {
                questionRepository.deleteByVideoIdIn(videoIdsToDelete);
                quizRepository.deleteByVideoIdIn(videoIdsToDelete);
                // Delete the videos
                for (Long videoId : videoIdsToDelete) {
                    videoRepository.deleteById(videoId);
                }
            }

            // Find sections to delete (exist in DB but not in request)
            List<Long> sectionIdsToDelete = existingSections.stream()
                    .filter(s -> !requestSectionIds.contains(s.getId()))
                    .map(Section::getId)
                    .collect(Collectors.toList());

            // Delete sections (videos already deleted above)
            for (Long sectionId : sectionIdsToDelete) {
                sectionRepository.deleteById(sectionId);
            }

            int totalVideos = 0;
            int totalDurationSeconds = 0;

            // Process each section in the request
            for (CreateSectionRequest sectionReq : request.getSections()) {
                Section section;

                if (sectionReq.getId() != null) {
                    // Update existing section
                    section = sectionRepository.findById(sectionReq.getId()).orElse(null);
                    if (section != null) {
                        section.setTitle(sectionReq.getTitle());
                        section.setDescription(sectionReq.getDescription());
                        section.setOrderIndex(sectionReq.getOrderIndex());
                        section = sectionRepository.save(section);
                    } else {
                        // Section ID provided but not found, create new
                        section = new Section();
                        section.setCourseId(courseId);
                        section.setTitle(sectionReq.getTitle());
                        section.setDescription(sectionReq.getDescription());
                        section.setOrderIndex(sectionReq.getOrderIndex());
                        section = sectionRepository.save(section);
                    }
                } else {
                    // Create new section
                    section = new Section();
                    section.setCourseId(courseId);
                    section.setTitle(sectionReq.getTitle());
                    section.setDescription(sectionReq.getDescription());
                    section.setOrderIndex(sectionReq.getOrderIndex());
                    section = sectionRepository.save(section);
                }

                // Process videos for this section
                if (sectionReq.getVideos() != null) {
                    for (CreateVideoRequest videoReq : sectionReq.getVideos()) {
                        Video video;

                        if (videoReq.getId() != null) {
                            // Update existing video
                            video = videoRepository.findById(videoReq.getId()).orElse(null);
                            if (video != null) {
                                video.setTitle(videoReq.getTitle());
                                String videoUrl = videoReq.getVideoUrl();
                                if (videoUrl != null && !videoUrl.trim().isEmpty()) {
                                    video.setVideoUrl(videoUrl);
                                }
                                Integer duration = videoReq.getDuration() != null ? videoReq.getDuration()
                                        : video.getDuration();
                                video.setDuration(duration != null ? duration : 0);
                                video.setOrderIndex(videoReq.getOrderIndex());
                                video.setSectionId(section.getId());
                                videoRepository.save(video);

                                totalVideos++;
                                totalDurationSeconds += duration != null ? duration : 0;
                            } else {
                                // Video ID provided but not found, create new
                                video = createNewVideo(videoReq, section, course);
                                totalVideos++;
                                totalDurationSeconds += video.getDuration() != null ? video.getDuration() : 0;
                            }
                        } else {
                            // Create new video
                            video = createNewVideo(videoReq, section, course);
                            totalVideos++;
                            totalDurationSeconds += video.getDuration() != null ? video.getDuration() : 0;
                        }
                    }
                }
            }

            // Update lessons count and duration
            course.setLessons(totalVideos);
            course.setDuration(formatDuration(totalDurationSeconds));
        }

        // Save and return updated course
        return courseRepository.save(course);
    }

    private Video createNewVideo(CreateVideoRequest videoReq, Section section, Course course) {
        Video video = new Video();
        video.setSectionId(section.getId());
        video.setTitle(videoReq.getTitle());

        String videoUrl = videoReq.getVideoUrl();
        if (videoUrl == null || videoUrl.trim().isEmpty()) {
            videoUrl = DEFAULT_VIDEO_URL;
        }
        video.setVideoUrl(videoUrl);

        Integer duration = videoReq.getDuration() != null ? videoReq.getDuration() : 0;
        video.setDuration(duration);
        video.setOrderIndex(videoReq.getOrderIndex());
        video.setContentType("VIDEO");
        video.setIsPreview(false);
        video.setIsFree(false);
        video.setCourse(course);

        return videoRepository.save(video);
    }

    @Transactional
    public boolean deleteCourse(String courseId, Long instructorId) {
        // Find the course
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null) {
            return false; // Course not found
        }

        // Check if the instructor owns this course
        if (!course.getInstructorId().equals(instructorId)) {
            return false; // Not authorized to delete
        }

        // Delete the course (sections and videos will be cascade deleted)
        courseRepository.deleteById(courseId);

        return true;
    }
}
