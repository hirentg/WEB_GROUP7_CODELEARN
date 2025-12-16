package com.codelearn.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller để trả về fake video preview data
 * 
 * NOTE: Đây là FAKE DATA để test UI
 * Trong production, cần thay thế bằng:
 * - VideoPreview entity từ database
 * - Service để lấy video preview từ database
 */
@RestController
@RequestMapping(path = "/api/video-previews", produces = MediaType.APPLICATION_JSON_VALUE)
public class VideoPreviewController {
    
    /**
     * GET /api/video-previews/course/{courseId}
     * 
     * Trả về video preview cho một khóa học
     * 
     * FAKE DATA STRUCTURE:
     * {
     *   id: Long,
     *   previewTitle: String,
     *   previewVideoUrl: String,
     *   duration: Integer (seconds),
     *   courseId: String
     * }
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<Map<String, Object>> getVideoPreviewByCourseId(@PathVariable String courseId) {
        Map<String, Object> preview = new HashMap<>();
        
        // Fake video previews cho các courses khác nhau
        switch (courseId) {
            case "react-pro":
                preview.put("id", 1L);
                preview.put("previewTitle", "React Introduction - Get Started in 5 Minutes");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
                preview.put("duration", 300); // 5 minutes
                preview.put("courseId", "react-pro");
                break;
                
            case "spring-boot-zero-to-hero":
                preview.put("id", 2L);
                preview.put("previewTitle", "Spring Boot Overview - What You'll Learn");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4");
                preview.put("duration", 240); // 4 minutes
                preview.put("courseId", "spring-boot-zero-to-hero");
                break;
                
            case "ts-mastery":
                preview.put("id", 3L);
                preview.put("previewTitle", "TypeScript Basics - Why TypeScript?");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
                preview.put("duration", 180); // 3 minutes
                preview.put("courseId", "ts-mastery");
                break;
                
            case "java-fundamentals":
                preview.put("id", 4L);
                preview.put("previewTitle", "Java Fundamentals - Course Introduction");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
                preview.put("duration", 360); // 6 minutes
                preview.put("courseId", "java-fundamentals");
                break;
                
            case "fullstack-react-spring":
                preview.put("id", 5L);
                preview.put("previewTitle", "Full-Stack Development - Course Preview");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4");
                preview.put("duration", 420); // 7 minutes
                preview.put("courseId", "fullstack-react-spring");
                break;
                
            default:
                // Default preview cho các courses khác
                preview.put("id", 0L);
                preview.put("previewTitle", "Course Preview");
                preview.put("previewVideoUrl", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
                preview.put("duration", 300);
                preview.put("courseId", courseId);
                break;
        }
        
        System.out.println("Returning video preview for course: " + courseId);
        
        return ResponseEntity.ok(preview);
    }
}

