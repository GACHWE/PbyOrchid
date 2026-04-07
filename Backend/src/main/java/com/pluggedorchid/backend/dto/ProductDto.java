////package com.pluggedorchid.backend.dto;
////
////import java.math.BigDecimal;
////import java.sql.Timestamp;
////import java.time.LocalDateTime;
////import java.util.List;
////import java.util.UUID;
////
////public record ProductDto(
////        UUID id,
////        String name,
////        String description,
////        BigDecimal price,
////        BigDecimal originalPrice,
////        String brand,
////        String gender,
////        Float rating,
////        String slug,
////        boolean newArrival,
////        boolean featured,
////        Timestamp featuredUntil,
////        CategoryResponse category,
////        CategoryTypeResponse categoryType,
////        List<ProductVariantDto> variants,
////        List<ProductResourceDto> resources,
////        LocalDateTime createdAt,
////        LocalDateTime updatedAt
////) {}
//package com.pluggedorchid.backend.dto;
//
//import java.math.BigDecimal;
//import java.sql.Timestamp;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//
///**
// * SINGLE PRODUCT DTO – Fully compatible with the refactored ProductService + ProductMapper
// *
// * This is the ONE response DTO used everywhere:
// *   • getAllProducts()
// *   • getProductById()
// *   • getProductBySlug()
// *   • getFeaturedProducts()
// *   • createProduct() / updateProduct() / featureProduct() / etc.
// *
// * It matches exactly what the current MapStruct mapper expects.
// */
//public record ProductDto(
//        UUID id,
//
//        String name,
//        String description,
//        BigDecimal price,
//        BigDecimal originalPrice,     // used for featured discount restoration
//
//        String brand,
//        String gender,
//
//        Float rating,
//        String slug,
//
//        boolean newArrival,
//        boolean featured,
//        Timestamp featuredUntil,      // null = permanent
//
//        // Nested category info (populated by CategoryMapper)
//        CategoryResponse category,
//        CategoryTypeResponse categoryType,
//
//        // Full list support (multi-variant + multi-image)
//        List<ProductVariantDto> variants,
//        List<ProductResourceDto> resources,
//
//        LocalDateTime createdAt,
//        LocalDateTime updatedAt
//) {}
//
///* ──────────────────────────────────────────────────────────────
//   Supporting DTOs required by ProductDto (minimal & complete)
//   ────────────────────────────────────────────────────────────── */
//
///** Simple category response (used by CategoryMapper) */
////public record CategoryResponse(
////        UUID id,
////        String name,
////        String slug
////) {}
//
///** Simple category type response (used by CategoryTypeMapper) */
////public record CategoryTypeResponse(
////        UUID id,
////        String name,
////        String slug
////) {}
//
///** Product variant (color + size + stock) */
////public record ProductVariantDto(
////        UUID id,           // optional – null on create
////        String color,
////        String size,
////        Integer stockQuantity
////) {}
//
///** Product resource (image or other media) */
////public record ProductResourceDto(
////        UUID id,           // optional – null on create
////        String url,
////        String resourceType   // "image", "video", etc.
////) {}

package com.pluggedorchid.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDto(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        BigDecimal originalPrice,
        String brand,
        String gender,
        Float rating,
        String slug,
        boolean newArrival,
        boolean featured,
        Timestamp featuredUntil,
        CategoryResponse category,
        CategoryTypeResponse categoryType,
        List<ProductVariantDto> variants,
        List<ProductResourceDto> resources,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}