package com.pluggedorchid.backend.controller;

import com.pluggedorchid.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Admin dashboard analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/admin/overview")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard overview")
    public ResponseEntity<AnalyticsService.AdminOverview> getAdminOverview() {
        return ResponseEntity.ok(analyticsService.getAdminOverview());
    }
}