package com.codelearn.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    /**
     * Upload image to Cloudinary
     * @param file MultipartFile image
     * @param folder Folder name in Cloudinary (e.g., "codelearn/thumbnails")
     * @param width Target width for transformation (optional)
     * @param height Target height for transformation (optional)
     * @return URL of uploaded image
     */
    public String uploadImage(MultipartFile file, String folder, Integer width, Integer height) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Build upload options
        Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "quality", "auto"
        );

        // Add transformation if dimensions provided
        if (width != null && height != null) {
            uploadOptions.put("transformation", new com.cloudinary.Transformation()
                    .width(width).height(height).crop("fill"));
        }

        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

        return (String) uploadResult.get("secure_url");
    }

    /**
     * Upload thumbnail (800x450)
     */
    public String uploadThumbnail(MultipartFile file) throws IOException {
        return uploadImage(file, "codelearn/thumbnails", 800, 450);
    }

    /**
     * Upload avatar (300x300)
     */
    public String uploadAvatar(MultipartFile file) throws IOException {
        return uploadImage(file, "codelearn/avatars", 300, 300);
    }

    /**
     * Delete image from Cloudinary by public ID
     * @param publicId Public ID of the image
     */
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param imageUrl Full Cloudinary URL
     * @return Public ID
     */
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }
        
        // Extract public ID from URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
        // Public ID: folder/image
        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) {
            return null;
        }
        
        String afterUpload = parts[1];
        // Remove version if exists (v1234567890/)
        String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
        // Remove file extension
        int lastDot = withoutVersion.lastIndexOf('.');
        if (lastDot > 0) {
            return withoutVersion.substring(0, lastDot);
        }
        
        return withoutVersion;
    }
}
