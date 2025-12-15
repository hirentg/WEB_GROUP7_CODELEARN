package com.codelearn.controller;

import com.codelearn.model.Video;
import com.codelearn.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    @Value("${video.storage.path:uploads/videos}")
    private String videoStoragePath;
    
    @Value("${thumbnail.storage.path:uploads/thumbnails}")
    private String thumbnailStoragePath;
    
    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideo(@PathVariable Long id) {
        Video video = videoService.getVideoById(id);
        if (video != null) {
            return ResponseEntity.ok(video);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}/stream")
    public ResponseEntity<Resource> streamVideo(@PathVariable Long id) {
        try {
            Video video = videoService.getVideoById(id);
            if (video == null) {
                return ResponseEntity.notFound().build();
            }
            
            // If videoUrl is a full URL (external), return it directly
            if (video.getVideoUrl() != null && video.getVideoUrl().startsWith("http")) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, video.getVideoUrl())
                        .build();
            }
            
            // Otherwise, serve from local storage
            Path videoPath = Paths.get(videoStoragePath).resolve(video.getVideoUrl());
            Resource resource = new UrlResource(videoPath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(video.getVideoUrl());
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + video.getTitle() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private String determineContentType(String filename) {
        if (filename == null) return "video/mp4";
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "mp4": return "video/mp4";
            case "webm": return "video/webm";
            case "ogg": return "video/ogg";
            default: return "video/mp4";
        }
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("courseId") String courseId,
            @RequestParam("orderIndex") Integer orderIndex,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        
        try {
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file type. Only video files are allowed."));
            }
            
            // Validate video format
            String filename = file.getOriginalFilename();
            if (filename == null || !isValidVideoFormat(filename)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Unsupported video format. Supported formats: MP4, WebM, OGG"));
            }
            
            Video video = videoService.uploadVideo(file, title, description, courseId, orderIndex, thumbnail);
            return ResponseEntity.ok(video);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload video: " + e.getMessage()));
        }
    }
    
    private boolean isValidVideoFormat(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return extension.equals("mp4") || extension.equals("webm") || extension.equals("ogg");
    }
}

