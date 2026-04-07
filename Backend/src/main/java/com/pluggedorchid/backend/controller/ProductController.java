package com.pluggedorchid.backend.controller;

import com.pluggedorchid.backend.dto.*;
import com.pluggedorchid.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Public product endpoints")
public class ProductController {

    private final ProductService productService;

    // ──────────────────────────────────────────────────────────────
    // PUBLIC ENDPOINTS
    // ──────────────────────────────────────────────────────────────
    @GetMapping
    @Operation(summary = "Get all products with filtering, search, pagination")
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(productService.getAllProducts(
                categoryId, brand, gender, minPrice, maxPrice,
                featured, newArrival, search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product by slug")
    public ResponseEntity<ProductDto> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    public ResponseEntity<Page<ProductDto>> getFeaturedProducts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }

    // ──────────────────────────────────────────────────────────────
    // ADMIN ONLY ENDPOINTS
    // ──────────────────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable UUID id,
                                                    @Valid @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a product (Admin only)")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) throws IOException {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> featureProduct(@PathVariable UUID id,
                                                     @Valid @RequestBody FeatureProductRequest request) {
        return ResponseEntity.ok(productService.featureProduct(id, request));
    }

    @PutMapping("/{id}/unfeature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> unfeatureProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.unfeatureProduct(id));
    }

    @PutMapping("/{id}/new-arrival")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> toggleNewArrival(@PathVariable UUID id,
                                                       @RequestParam boolean newArrival) {
        return ResponseEntity.ok(productService.toggleNewArrival(id, newArrival));
    }
}