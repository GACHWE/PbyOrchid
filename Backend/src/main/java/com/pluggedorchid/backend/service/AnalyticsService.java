package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.entity.Order;
import com.pluggedorchid.backend.entity.OrderStatus;
import com.pluggedorchid.backend.repository.OrderRepository;
import com.pluggedorchid.backend.repository.ProductRepository;
import com.pluggedorchid.backend.repository.UserRepository;
import com.pluggedorchid.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;

    @Transactional(readOnly = true)
    public AdminOverview getAdminOverview() {
        // 1. Revenue totals
        BigDecimal totalRevenueAll = orderRepository.sumAllOrderTotals();
        BigDecimal totalRevenueDelivered = orderRepository.sumByStatus(OrderStatus.DELIVERED);

        // 2. Total orders
        long totalOrders = orderRepository.count();

        // 3. Total users (registered)
        long totalUsers = userRepository.count();

        // 4. Active products (non-deleted)
        long totalProducts = productRepository.countByDeletedFalse();

        // 5. Active authenticated visitors (last 5 minutes)
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        long activeVisitors = userRepository.countActiveSince(fiveMinutesAgo);

        // 6. Orders count per status
        Map<OrderStatus, Long> ordersCountByStatus = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            ordersCountByStatus.put(status, orderRepository.countByStatus(status));
        }

        // 7. Revenue per status
        Map<OrderStatus, BigDecimal> revenueByStatus = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            revenueByStatus.put(status, orderRepository.sumByStatus(status));
        }

        // 8. Top 5 wishlisted products
        List<WishlistCount> topWishlisted = new ArrayList<>();
        Pageable topFive = PageRequest.of(0, 5);
        List<Object[]> results = wishlistRepository.getWishlistCountsGrouped(topFive);
        for (Object[] row : results) {
            UUID productId = (UUID) row[0];
            Long count = (Long) row[1];
            productRepository.findById(productId).ifPresent(product ->
                    topWishlisted.add(new WishlistCount(productId, product.getName(), count))
            );
        }

        // 9. Recent orders (last 5)
        List<RecentOrder> recentOrders = new ArrayList<>();
        Pageable recentPage = PageRequest.of(0, 5);
        List<Order> latestOrders = orderRepository.findTop5ByOrderByCreatedAtDesc(recentPage);
        for (Order order : latestOrders) {
            String customerName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
            recentOrders.add(new RecentOrder(
                    order.getId(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    customerName,
                    order.getCreatedAt()
            ));
        }

        return new AdminOverview(
                totalRevenueAll,
                totalRevenueDelivered,
                totalOrders,
                totalUsers,
                totalProducts,
                activeVisitors,
                ordersCountByStatus,
                revenueByStatus,
                topWishlisted,
                recentOrders
        );
    }

    // -----------------------------------------------------------------
    // DTOs (records)
    // -----------------------------------------------------------------
    public record AdminOverview(
            BigDecimal totalRevenueAll,
            BigDecimal totalRevenueDelivered,
            long totalOrders,
            long totalUsers,
            long totalProducts,
            long activeVisitors,
            Map<OrderStatus, Long> ordersCountByStatus,
            Map<OrderStatus, BigDecimal> revenueByStatus,
            List<WishlistCount> topWishlisted,
            List<RecentOrder> recentOrders
    ) {}

    public record WishlistCount(UUID productId, String productName, long count) {}

    public record RecentOrder(UUID orderId, BigDecimal amount, OrderStatus status, String customerName, LocalDateTime createdAt) {}
}