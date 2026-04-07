//package com.pluggedorchid.backend.controller;
//
//import com.pluggedorchid.backend.dto.CategoryRequest;
//import com.pluggedorchid.backend.dto.CategoryResponse;
//import com.pluggedorchid.backend.dto.DashboardStats;
//import com.pluggedorchid.backend.dto.OrderResponse;
//import com.pluggedorchid.backend.dto.ProductDto;
//import com.pluggedorchid.backend.service.*;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/v1/admin")
//@RequiredArgsConstructor
//@SecurityRequirement(name = "bearerAuth")
//@Tag(name = "Admin", description = "Admin-only endpoints")
//public class AdminController {
//
//    private final CategoryService categoryService;
//    private final ProductServiceImpl productService;
//    private final OrderService orderService;
//    private final AnalyticsService analyticsService;
//
//    // Dashboard (placeholder)
//    @GetMapping("/dashboard")
//    @Operation(summary = "Get dashboard stats")
//    public ResponseEntity<DashboardStats> getDashboardStats() {
//        // implement using materialized views
//        return ResponseEntity.ok(null);
//    }
//
//    // Category CRUD
//    @GetMapping("/categories")
//    @Operation(summary = "Get all categories (admin)")
//    public ResponseEntity<Page<CategoryResponse>> getAllCategories(Pageable pageable) {
//        // Not paginated in spec, but we can return list
//        return ResponseEntity.ok(Page.empty());
//    }
//
//    @PostMapping("/categories")
//    @Operation(summary = "Create a new category")
//    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
//        return ResponseEntity.ok(categoryService.createCategory(request));
//    }
//
//    @PutMapping("/categories/{id}")
//    @Operation(summary = "Update a category")
//    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
//        return ResponseEntity.ok(categoryService.updateCategory(id, request));
//    }
//
//    @DeleteMapping("/categories/{id}")
//    @Operation(summary = "Delete a category")
//    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
//        categoryService.deleteCategory(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // Product management (extra admin endpoints)
//    @GetMapping("/products")
//    @Operation(summary = "Get all products (admin)")
//    public ResponseEntity<Page<ProductDto>> getAllProducts(Pageable pageable) {
//        return ResponseEntity.ok(productService.getAllProducts(pageable, null));
//    }
//
//    @PutMapping("/products/{id}/new-arrival")
//    @Operation(summary = "Toggle new arrival status")
//    public ResponseEntity<ProductDto> toggleNewArrival(@PathVariable UUID id, @RequestParam boolean newArrival) {
//        return ResponseEntity.ok(productService.toggleNewArrival(id, newArrival));
//    }
//
//    // Order management
//    @GetMapping("/orders")
//    @Operation(summary = "Get all orders (admin)")
//    public ResponseEntity<Page<OrderResponse>> getAllOrders(Pageable pageable) {
//        return ResponseEntity.ok(orderService.getAllOrders(pageable));
//    }
//
//    @PutMapping("/orders/{id}/status")
//    @Operation(summary = "Update order status")
//    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable UUID id, @RequestParam String status) {
//        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
//    }
//
//    // Analytics endpoints (placeholder)
//    @GetMapping("/analytics/revenue-trends")
//    @Operation(summary = "Get revenue trends")
//    public ResponseEntity<?> getRevenueTrends() {
//        return ResponseEntity.ok(null);
//    }
//
//    @GetMapping("/analytics/top-wishlisted")
//    @Operation(summary = "Get top wishlisted products")
//    public ResponseEntity<?> getTopWishlisted() {
//        return ResponseEntity.ok(null);
//    }
//
//    @GetMapping("/analytics/visitor-stats")
//    @Operation(summary = "Get visitor statistics")
//    public ResponseEntity<?> getVisitorStats() {
//        return ResponseEntity.ok(null);
//    }
//}