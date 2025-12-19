package com.codelearn.controller;

import com.codelearn.service.CloudinaryService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/upload", produces = MediaType.APPLICATION_JSON_VALUE)
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Upload thumbnail image to Cloudinary
     * POST /api/upload/thumbnail
     */
    @PostMapping(value = "/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadThumbnail(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify authentication
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "File size exceeds 5MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "File must be an image (jpg, png, webp)");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadThumbnail(file);

            response.put("success", true);
            response.put("message", "Thumbnail uploaded successfully");
            response.put("url", imageUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to upload thumbnail: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Upload avatar image to Cloudinary
     * POST /api/upload/avatar
     */
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify authentication
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "File size exceeds 5MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "File must be an image (jpg, png, webp)");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadAvatar(file);

            response.put("success", true);
            response.put("message", "Avatar uploaded successfully");
            response.put("url", imageUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to upload avatar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete image from Cloudinary
     * DELETE /api/upload?url={imageUrl}
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteImage(
            @RequestParam("url") String imageUrl,
            @RequestHeader("Authorization") String authHeader) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify authentication
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Extract public ID and delete
            String publicId = cloudinaryService.extractPublicId(imageUrl);
            if (publicId == null) {
                response.put("success", false);
                response.put("message", "Invalid Cloudinary URL");
                return ResponseEntity.badRequest().body(response);
            }

            cloudinaryService.deleteImage(publicId);

            response.put("success", true);
            response.put("message", "Image deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
