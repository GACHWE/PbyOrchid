package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.OrderRequest;
import com.pluggedorchid.backend.dto.OrderResponse;
import com.pluggedorchid.backend.entity.*;
import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.entity.OrderStatus;
import com.pluggedorchid.backend.event.OrderCreatedEvent;
import org.springframework.security.access.AccessDeniedException;
import com.pluggedorchid.backend.exception.BadRequestException;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.OrderMapper;
import com.pluggedorchid.backend.repository.OrderRepository;
import com.pluggedorchid.backend.repository.ProductRepository;
import com.pluggedorchid.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final OrderMapper orderMapper;
    private final ApplicationEventPublisher eventPublisher;

    // ==================== CREATE ORDER (no stock deduction) ====================

    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setRecipientName(request.recipientName());
        order.setWhatsappNumber(request.whatsappNumber());
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderRequest.OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.productId()));

            // Find variant (no stock deduction yet)
            ProductVariant variant = findVariant(product, itemReq.size(), itemReq.color());

            // Soft check: if variant has zero stock, reject immediately (optional)
            if (variant.getStockQuantity() <= 0) {
                throw new BadRequestException("Variant (size %s, color %s) is out of stock"
                        .formatted(itemReq.size(), itemReq.color()));
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.quantity());
            item.setPriceAtTime(product.getPrice());
            item.setSize(itemReq.size());
            item.setColor(itemReq.color());

            items.add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setItems(items);
        order.setTotalAmount(total);
        order = orderRepository.save(order);

        // Publish event – notification will be sent after transaction commit
        eventPublisher.publishEvent(new OrderCreatedEvent(order));

        return orderMapper.toResponse(order);
    }

    // ==================== CONFIRM ORDER (deduct stock with retry) ====================

    @Retryable(
            value = OptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional
    public OrderResponse confirmOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be confirmed. Current status: " + order.getStatus());
        }

        // Deduct stock for each item
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = findVariant(item.getProduct(), item.getSize(), item.getColor());
            int newStock = variant.getStockQuantity() - item.getQuantity();
            if (newStock < 0) {
                throw new BadRequestException(
                        String.format("Not enough stock for %s (size %s, color %s). Available: %d, requested: %d",
                                item.getProduct().getName(), item.getSize(), item.getColor(),
                                variant.getStockQuantity(), item.getQuantity())
                );
            }
            variant.setStockQuantity(newStock);
            // version field will be incremented automatically
        }

        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        log.info("Order {} confirmed, stock deducted", orderId);
        return orderMapper.toResponse(order);
    }

    // ==================== MARK AS DELIVERED ====================

    @Transactional
    public OrderResponse markAsDelivered(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed orders can be marked as delivered");
        }

        order.setStatus(OrderStatus.DELIVERED);
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    // ==================== CANCEL ORDER (role-based) ====================

    @Transactional
    public OrderResponse cancelOrder(UUID orderId, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = order.getUser().getId().equals(currentUser.getId());

        // Validation rules
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order already cancelled");
        }
        if (order.getStatus() == OrderStatus.CONFIRMED && !isAdmin) {
            throw new BadRequestException("Confirmed orders can only be cancelled by admin");
        }
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You are not authorised to cancel this order");
        }

        // If order was confirmed, restore stock
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            restoreStock(order);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        log.info("Order {} cancelled by user {} (admin: {})", orderId, currentUser.getId(), isAdmin);
        return orderMapper.toResponse(order);
    }

    // ==================== QUERIES ====================

    @Transactional(readOnly = true)
    public Page<OrderResponse> getBuyerOrders(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(orderMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForUser(UUID id, User user) {
        Order order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(orderMapper::toResponse);
    }

    // ==================== PRIVATE HELPERS ====================

    private ProductVariant findVariant(Product product, String size, String color) {
        return product.getVariants().stream()
                .filter(v -> v.getSize().equals(size) && v.getColor().equals(color))
                .findFirst()
                .orElseThrow(() -> new BadRequestException(
                        String.format("Variant not found for product %s (size %s, color %s)",
                                product.getName(), size, color)));
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = findVariant(item.getProduct(), item.getSize(), item.getColor());
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            // optimistic lock will handle concurrent updates
        }
    }
}