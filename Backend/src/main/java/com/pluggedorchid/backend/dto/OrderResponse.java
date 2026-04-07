package com.pluggedorchid.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        UUID buyerId,
        List<OrderItemResponse> items,
        BigDecimal totalAmount,
        String status,
        String shippingAddress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record OrderItemResponse(
            UUID productId,
            ProductDto product,
            Integer quantity,
            BigDecimal priceAtTime,
            String size,
            String color
    ) {}
}