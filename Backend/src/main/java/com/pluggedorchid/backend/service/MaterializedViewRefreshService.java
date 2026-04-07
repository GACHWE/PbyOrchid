package com.pluggedorchid.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterializedViewRefreshService {

    private final JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 0 * * * *") // every hour
    @Transactional
    public void refreshMaterializedViews() {
        log.info("Refreshing materialized views...");
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue");
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_top_sellers");
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_top_wishlisted");
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_visitor_stats");
        log.info("Materialized views refreshed.");
    }
}