package com.pluggedorchid.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-folder}")
    private String uploadFolder;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    /**
     * Upload single file → returns secure URL
     */
    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        Map<String, Object> params = ObjectUtils.asMap(
                "folder", uploadFolder,
                "resource_type", "image",
                "overwrite", true
        );

        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
            return result.get("secure_url").toString();
        } catch (Exception e) {
            log.error("Cloudinary upload failed for file: {}", file.getOriginalFilename(), e);
            throw new IOException("Failed to upload to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Upload multiple files → returns simple map of filename → url
     */
    public Map<String, String> uploadMultipleFiles(MultipartFile[] files) {
        Map<String, String> results = new HashMap<>();

        for (MultipartFile file : files) {
            String filename = Objects.requireNonNullElse(file.getOriginalFilename(), "unknown");
            try {
                String url = uploadFile(file);
                results.put(filename, url);
            } catch (Exception e) {
                log.error("Failed to upload {}", filename, e);
                results.put(filename, "ERROR: " + e.getMessage());
            }
        }
        return results;
    }

    /**
     * Delete by public ID
     */
    public void deleteFile(String publicId) throws IOException {
        if (publicId == null || publicId.trim().isEmpty()) {
            throw new IllegalArgumentException("Public ID cannot be empty");
        }
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            log.error("Failed to delete file with publicId: {}", publicId, e);
            throw new IOException("Failed to delete from Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Delete by full Cloudinary URL (auto extracts public ID)
     */
    public void deleteFileByUrl(String url) throws IOException {
        String publicId = extractPublicIdFromUrl(url);
        if (publicId == null) {
            throw new IllegalArgumentException("Could not extract public ID from URL: " + url);
        }
        deleteFile(publicId);
    }

    /**
     * Extract public ID from Cloudinary URL (very robust)
     */
    public String extractPublicIdFromUrl(String url) {
        if (url == null || !url.contains("/upload/")) return null;

        try {
            String afterUpload = url.substring(url.indexOf("/upload/") + 8);

            // Remove query params if any
            int queryIndex = afterUpload.indexOf('?');
            if (queryIndex != -1) afterUpload = afterUpload.substring(0, queryIndex);

            String[] parts = afterUpload.split("/");
            StringBuilder publicId = new StringBuilder();
            boolean started = false;

            for (String part : parts) {
                if (!started && (part.contains(",") || part.contains("_") || part.matches("v\\d+"))) {
                    continue; // skip version & transformations
                }
                started = true;
                if (publicId.length() > 0) publicId.append("/");
                publicId.append(part);
            }

            // Remove file extension
            String id = publicId.toString();
            int dotIndex = id.lastIndexOf('.');
            return dotIndex != -1 ? id.substring(0, dotIndex) : id;
        } catch (Exception e) {
            log.warn("Failed to extract public ID from URL: {}", url);
            return null;
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.");
        }
    }
}