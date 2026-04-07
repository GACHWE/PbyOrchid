package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.AnalyticsEventRequest;
import com.pluggedorchid.backend.entity.AnalyticsEvent;
import com.pluggedorchid.backend.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final JdbcTemplate jdbcTemplate;

    // -----------------------------------------------------------------
    // Event logging
    // -----------------------------------------------------------------

    @Async
    @Transactional
    public void logEvent(AnalyticsEventRequest request) {
        AnalyticsEvent event = new AnalyticsEvent();
        event.setEventType(request.eventType());
        event.setProductId(request.productId());
        event.setSessionId(request.sessionId());
        event.setIpHash(request.ipHash());
        event.setMetadata(request.metadata());
        analyticsEventRepository.save(event);
        log.debug("Logged analytics event: {}", request.eventType());
    }

    // -----------------------------------------------------------------
    // Materialized view refresh (scheduled)
    // -----------------------------------------------------------------

    @Scheduled(cron = "0 0 * * * *") // every hour
    @Transactional
    public void refreshMaterializedViews() {
        log.info("Refreshing materialized views...");
        analyticsEventRepository.refreshDailyRevenueView();
        analyticsEventRepository.refreshTopSellersView();
        analyticsEventRepository.refreshTopWishlistedView();
        analyticsEventRepository.refreshVisitorStatsView();
        log.info("Materialized views refreshed.");
    }

    // -----------------------------------------------------------------
    // Query methods for materialized views
    // -----------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<DailyRevenue> getDailyRevenue(LocalDate start, LocalDate end) {
        String sql = """
            SELECT date, total_revenue, order_count
            FROM mv_daily_revenue
            WHERE date BETWEEN ? AND ?
            ORDER BY date
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new DailyRevenue(
                        rs.getDate("date").toLocalDate(),
                        rs.getBigDecimal("total_revenue"),
                        rs.getInt("order_count")
                ),
                start, end);
    }

    @Transactional(readOnly = true)
    public List<TopSeller> getTopSellers(int limit) {
        String sql = """
            SELECT product_id, product_name, total_sold, total_revenue
            FROM mv_top_sellers
            ORDER BY total_sold DESC
            LIMIT ?
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new TopSeller(
                        rs.getObject("product_id", java.util.UUID.class),
                        rs.getString("product_name"),
                        rs.getInt("total_sold"),
                        rs.getBigDecimal("total_revenue")
                ),
                limit);
    }

    @Transactional(readOnly = true)
    public List<TopWishlisted> getTopWishlisted(int limit) {
        String sql = """
            SELECT product_id, product_name, wishlist_count
            FROM mv_top_wishlisted
            ORDER BY wishlist_count DESC
            LIMIT ?
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new TopWishlisted(
                        rs.getObject("product_id", java.util.UUID.class),
                        rs.getString("product_name"),
                        rs.getInt("wishlist_count")
                ),
                limit);
    }

    @Transactional(readOnly = true)
    public List<VisitorStats> getVisitorStats(LocalDate start, LocalDate end) {
        String sql = """
            SELECT date, unique_visitors, page_views
            FROM mv_visitor_stats
            WHERE date BETWEEN ? AND ?
            ORDER BY date
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new VisitorStats(
                        rs.getDate("date").toLocalDate(),
                        rs.getInt("unique_visitors"),
                        rs.getInt("page_views")
                ),
                start, end);
    }

    // -----------------------------------------------------------------
    // DTOs (records) for query results
    // -----------------------------------------------------------------

    public record DailyRevenue(LocalDate date, BigDecimal totalRevenue, int orderCount) {}

    public record TopSeller(UUID productId, String productName, int totalSold, BigDecimal totalRevenue) {}

    public record TopWishlisted(UUID productId, String productName, int wishlistCount) {}

    public record VisitorStats(LocalDate date, int uniqueVisitors, int pageViews) {}
}