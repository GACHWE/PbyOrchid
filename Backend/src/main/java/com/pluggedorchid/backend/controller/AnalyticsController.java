package com.pluggedorchid.backend.controller;

import com.pluggedorchid.backend.dto.AnalyticsEventRequest;
import com.pluggedorchid.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Public analytics tracking")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // New public endpoint for logging events
    @PostMapping("/event")
    @Operation(summary = "Log an analytics event (public)")
    public ResponseEntity<Void> logEvent(@Valid @RequestBody AnalyticsEventRequest request) {
        analyticsService.logEvent(request);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/admin/revenue-trends")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue trends (Admin only)")
    public ResponseEntity<?> getRevenueTrends(
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end) {
        // Provide default date range (last 30 days) if not supplied
        if (start == null) start = LocalDate.now().minusDays(30);
        if (end == null) end = LocalDate.now();
        return ResponseEntity.ok(analyticsService.getDailyRevenue(start, end));
    }

    @GetMapping("/admin/top-wishlisted")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get top wishlisted products (Admin only)")
    public ResponseEntity<?> getTopWishlisted(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopWishlisted(limit));
    }

    @GetMapping("/admin/visitor-stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get visitor statistics (Admin only)")
    public ResponseEntity<?> getVisitorStats(
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end) {
        if (start == null) start = LocalDate.now().minusDays(30);
        if (end == null) end = LocalDate.now();
        return ResponseEntity.ok(analyticsService.getVisitorStats(start, end));
    }

    // Optionally, you can also expose top-sellers if needed:
    @GetMapping("/admin/top-sellers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get top selling products (Admin only)")
    public ResponseEntity<?> getTopSellers(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopSellers(limit));
    }
}