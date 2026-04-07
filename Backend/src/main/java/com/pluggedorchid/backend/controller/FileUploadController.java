package com.pluggedorchid.backend.controller;

import com.pluggedorchid.backend.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "Endpoints for image uploads to Cloudinary")
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a single file")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadFile(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("message", "File uploaded successfully");
            response.put("filename", file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage(), "filename", file.getOriginalFilename()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage(),
                            "filename", file.getOriginalFilename()));
        }
    }

    @PostMapping("/upload-multiple")
    @Operation(summary = "Upload multiple files")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            Map<String, Object> response = new HashMap<>();
            Map<String, String> results = new HashMap<>();
            int success = 0, failed = 0;
            for (MultipartFile file : files) {
                try {
                    String url = cloudinaryService.uploadFile(file);
                    results.put(file.getOriginalFilename(), url);
                    success++;
                } catch (Exception e) {
                    results.put(file.getOriginalFilename(), "ERROR: " + e.getMessage());
                    failed++;
                }
            }
            response.put("results", results);
            response.put("successful", success);
            response.put("failed", failed);
            response.put("total", files.length);
            response.put("message", "Batch upload completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Batch upload failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete a file by public ID")
    public ResponseEntity<?> deleteFile(@RequestParam("publicId") String publicId) {
        try {
            cloudinaryService.deleteFile(publicId);
            return ResponseEntity.ok().body(Map.of("message", "File deleted successfully", "publicId", publicId));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete file: " + e.getMessage(), "publicId", publicId));
        }
    }

    @DeleteMapping("/delete-by-url")
    @Operation(summary = "Delete a file by its Cloudinary URL")
    public ResponseEntity<?> deleteFileByUrl(@RequestParam("imageUrl") String imageUrl) {
        try {
            cloudinaryService.deleteFileByUrl(imageUrl);
            return ResponseEntity.ok().body(Map.of("message", "File deleted successfully", "imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete file: " + e.getMessage(), "imageUrl", imageUrl));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage(), "imageUrl", imageUrl));
        }
    }

    @GetMapping("/extract-public-id")
    @Operation(summary = "Extract public ID from a Cloudinary URL")
    public ResponseEntity<?> extractPublicId(@RequestParam("url") String url) {
        String publicId = cloudinaryService.extractPublicIdFromUrl(url);
        if (publicId != null) {
            return ResponseEntity.ok(Map.of("publicId", publicId, "url", url));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Could not extract public ID from URL", "url", url));
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "OK", "service", "File Upload Service"));
    }
}