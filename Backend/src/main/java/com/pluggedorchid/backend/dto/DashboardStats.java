package com.pluggedorchid.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record DashboardStats(
        List<DailyRevenue> revenueTrends,
        List<TopSeller> topSellers,
        List<TopWishlisted> topWishlisted,
        List<VisitorStats> visitorStats
) {
    public record DailyRevenue(LocalDate date, BigDecimal revenue, Long orderCount) {}
    public record TopSeller(UUID productId, String productName, Long totalQuantitySold) {}
    public record TopWishlisted(UUID productId, String productName, Long wishlistCount) {}
    public record VisitorStats(LocalDate date, Long uniqueVisitors, Long totalSessions) {}
}