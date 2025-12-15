package com.codelearn.service;

import com.codelearn.model.Course;
import com.codelearn.model.Video;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class VideoService {
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Value("${video.storage.path:uploads/videos}")
    private String videoStoragePath;
    
    @Value("${thumbnail.storage.path:uploads/thumbnails}")
    private String thumbnailStoragePath;
    
    public Video getVideoById(Long id) {
        return videoRepository.findById(id).orElse(null);
    }
    
    public Video uploadVideo(MultipartFile videoFile, String title, String description, 
                            String courseId, Integer orderIndex, MultipartFile thumbnailFile) throws IOException {
        
        // Verify course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Create storage directories if they don't exist
        Path videoDir = Paths.get(videoStoragePath);
        Path thumbnailDir = Paths.get(thumbnailStoragePath);
        Files.createDirectories(videoDir);
        Files.createDirectories(thumbnailDir);
        
        // Generate unique filename
        String videoExtension = getFileExtension(videoFile.getOriginalFilename());
        String videoFilename = UUID.randomUUID().toString() + "." + videoExtension;
        Path videoPath = videoDir.resolve(videoFilename);
        
        // Save video file
        Files.copy(videoFile.getInputStream(), videoPath, StandardCopyOption.REPLACE_EXISTING);
        
        // Handle thumbnail
        String thumbnailUrl = null;
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String thumbnailExtension = getFileExtension(thumbnailFile.getOriginalFilename());
            String thumbnailFilename = UUID.randomUUID().toString() + "." + thumbnailExtension;
            Path thumbnailPath = thumbnailDir.resolve(thumbnailFilename);
            Files.copy(thumbnailFile.getInputStream(), thumbnailPath, StandardCopyOption.REPLACE_EXISTING);
            thumbnailUrl = thumbnailStoragePath + "/" + thumbnailFilename;
        }
        
        // Calculate duration (you might want to use a library like JAVE for this)
        Integer duration = estimateDuration(videoFile.getSize());
        
        // Create and save video entity
        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setVideoUrl(videoFilename); // Store filename, not full path
        video.setThumbnailUrl(thumbnailUrl);
        video.setDuration(duration);
        video.setOrderIndex(orderIndex);
        video.setCourse(course);
        
        return videoRepository.save(video);
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "mp4";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
    
    private Integer estimateDuration(long fileSizeBytes) {
        // Rough estimation: assume 1MB per minute for compressed video
        // This is just an approximation - in production, use a library like JAVE
        return (int) (fileSizeBytes / (1024 * 1024)); // minutes (rough estimate)
    }
}

