//package com.pluggedorchid.backend.controller;
//
//import com.pluggedorchid.backend.exception.ResourceNotFoundException;
//import com.pluggedorchid.backend.service.CloudinaryService;
//import com.pluggedorchid.backend.service.ProductService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.Map;
//import java.util.UUID;
//
//@Slf4j
//@RestController
//@RequestMapping("/api/v1/files")
//@RequiredArgsConstructor
//@Tag(name = "File Upload", description = "Endpoints for image uploads to Cloudinary")
//public class FileUploadController {
//
//    private final CloudinaryService cloudinaryService;
//    private final ProductService productService;
//
//    @PostMapping("/upload")
//    @Operation(summary = "Upload single image to Cloudinary and attach to product")
//    public ResponseEntity<Map<String, Object>> uploadFile(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam(value = "productId", required = false) UUID productId) {
//
//        String filename = file.getOriginalFilename();
//        try {
//            // 1. Upload to Cloudinary
//            String imageUrl = cloudinaryService.uploadFile(file);
//
//            // 2. Attach to product (saves ProductResources via cascade)
//            productService.addResourceToProduct(productId, imageUrl);
//
//            // 3. Return success
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "url", imageUrl,
//                    "productId", productId,
//                    "filename", filename != null ? filename : "unknown"
//            ));
//        } catch (IllegalArgumentException e) {
//            // Validation error (file empty, too big, wrong type)
//            log.warn("File upload validation failed for {}: {}", filename, e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "error", e.getMessage(),
//                    "filename", filename != null ? filename : "unknown"
//            ));
//        } catch (ResourceNotFoundException e) {
//            // Product not found
//            log.warn("Product not found: {}", productId);
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
//                    "success", false,
//                    "error", e.getMessage(),
//                    "productId", productId
//            ));
//        } catch (Exception e) {
//            // Cloudinary or database error
//            log.error("Upload failed for {}: {}", filename, e.getMessage(), e);
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "error", "Failed to upload image: " + e.getMessage(),
//                    "filename", filename != null ? filename : "unknown"
//            ));
//        }
//    }
//
//    @PostMapping("/upload-multiple")
//    @Operation(summary = "Upload multiple images to Cloudinary")
//    public ResponseEntity<Map<String, Object>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//        if (files == null || files.length == 0) {
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "error", "No files provided"
//            ));
//        }
//
//        try {
//            Map<String, String> results = cloudinaryService.uploadMultipleFiles(files);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "results", results,
//                    "message", "Batch upload completed",
//                    "total", files.length
//            ));
//        } catch (Exception e) {
//            log.error("Batch upload failed", e);
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "error", "Batch upload failed: " + e.getMessage()
//            ));
//        }
//    }
//
//    @DeleteMapping("/delete")
//    @Operation(summary = "Delete image by public ID")
//    public ResponseEntity<Map<String, Object>> deleteFile(@RequestParam("publicId") String publicId) {
//        try {
//            cloudinaryService.deleteFile(publicId);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Image deleted successfully",
//                    "publicId", publicId
//            ));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "error", e.getMessage(),
//                    "publicId", publicId
//            ));
//        } catch (Exception e) {
//            log.error("Delete failed for publicId {}: {}", publicId, e.getMessage(), e);
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "error", "Failed to delete image: " + e.getMessage(),
//                    "publicId", publicId
//            ));
//        }
//    }
//
//    @DeleteMapping("/delete-by-url")
//    @Operation(summary = "Delete image by URL")
//    public ResponseEntity<Map<String, Object>> deleteFileByUrl(@RequestParam("imageUrl") String imageUrl) {
//        try {
//            cloudinaryService.deleteFileByUrl(imageUrl);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Image deleted successfully",
//                    "imageUrl", imageUrl
//            ));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "error", e.getMessage(),
//                    "imageUrl", imageUrl
//            ));
//        } catch (Exception e) {
//            log.error("Delete by URL failed for {}: {}", imageUrl, e.getMessage(), e);
//            return ResponseEntity.internalServerError().body(Map.of(
//                    "success", false,
//                    "error", "Failed to delete image: " + e.getMessage(),
//                    "imageUrl", imageUrl
//            ));
//        }
//    }
//
//    @GetMapping("/health")
//    @Operation(summary = "File upload service health check")
//    public ResponseEntity<Map<String, Object>> healthCheck() {
//        return ResponseEntity.ok(Map.of(
//                "status", "OK",
//                "service", "Cloudinary File Upload",
//                "timestamp", System.currentTimeMillis()
//        ));
//    }
//}

package com.pluggedorchid.backend.controller;

import com.pluggedorchid.backend.service.CloudinaryService;
import com.pluggedorchid.backend.service.ProductService;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "Endpoints for image uploads to Cloudinary")
public class FileUploadController {

    private final CloudinaryService cloudinaryService;
    private final ProductService productService;

    @PostMapping("/upload")
    @Operation(summary = "Upload single image to Cloudinary and optionally attach to product")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "productId", required = false) UUID productId) {

        String filename = file.getOriginalFilename();
        try {
            // 1. Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadFile(file);

            // 2. Attach to product only if productId is provided
            if (productId != null) {
                productService.addResourceToProduct(productId, imageUrl);
            }

            // 3. Return success
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "url", imageUrl,
                    "productId", productId != null ? productId : "not-attached",
                    "filename", filename != null ? filename : "unknown"
            ));
        } catch (IllegalArgumentException e) {
            // Validation error (file empty, too big, wrong type)
            log.warn("File upload validation failed for {}: {}", filename, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "filename", filename != null ? filename : "unknown"
            ));
        } catch (ResourceNotFoundException e) {
            // Product not found
            log.warn("Product not found: {}", productId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "productId", productId
            ));
        } catch (Exception e) {
            // Cloudinary or database error
            log.error("Upload failed for {}: {}", filename, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", "Failed to upload image: " + e.getMessage(),
                    "filename", filename != null ? filename : "unknown"
            ));
        }
    }

    @PostMapping("/upload-multiple")
    @Operation(summary = "Upload multiple images to Cloudinary")
    public ResponseEntity<Map<String, Object>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "No files provided"
            ));
        }

        try {
            Map<String, String> results = cloudinaryService.uploadMultipleFiles(files);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "results", results,
                    "message", "Batch upload completed",
                    "total", files.length
            ));
        } catch (Exception e) {
            log.error("Batch upload failed", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", "Batch upload failed: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete image by public ID")
    public ResponseEntity<Map<String, Object>> deleteFile(@RequestParam("publicId") String publicId) {
        try {
            cloudinaryService.deleteFile(publicId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Image deleted successfully",
                    "publicId", publicId
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "publicId", publicId
            ));
        } catch (Exception e) {
            log.error("Delete failed for publicId {}: {}", publicId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", "Failed to delete image: " + e.getMessage(),
                    "publicId", publicId
            ));
        }
    }

    @DeleteMapping("/delete-by-url")
    @Operation(summary = "Delete image by URL")
    public ResponseEntity<Map<String, Object>> deleteFileByUrl(@RequestParam("imageUrl") String imageUrl) {
        try {
            cloudinaryService.deleteFileByUrl(imageUrl);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Image deleted successfully",
                    "imageUrl", imageUrl
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "imageUrl", imageUrl
            ));
        } catch (Exception e) {
            log.error("Delete by URL failed for {}: {}", imageUrl, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", "Failed to delete image: " + e.getMessage(),
                    "imageUrl", imageUrl
            ));
        }
    }

    @GetMapping("/health")
    @Operation(summary = "File upload service health check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "Cloudinary File Upload",
                "timestamp", System.currentTimeMillis()
        ));
    }
}