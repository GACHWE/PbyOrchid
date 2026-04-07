package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.dto.OrderRequest;
import com.pluggedorchid.backend.dto.OrderResponse;
import com.pluggedorchid.backend.entity.*;
import com.pluggedorchid.backend.exception.BadRequestException;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.OrderMapper;
import com.pluggedorchid.backend.repository.OrderRepository;
import com.pluggedorchid.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final WhatsAppService whatsAppService;

    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");

        order.setItems(new ArrayList<>());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.productId()));

            // Find variant that matches size and color (optional)
            // For simplicity, we assume the variant exists and we deduct stock from it
            // Here we just check overall stock of all variants (or we could sum)
            int totalStock = product.getVariants().stream().mapToInt(ProductVariant::getStockQuantity).sum();
            if (totalStock < itemReq.quantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            // Deduct from the matching variant (simplified: deduct from the first one that matches)
            ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getSize().equals(itemReq.size()) && v.getColor().equals(itemReq.color()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Variant not found for size/color"));
            if (variant.getStockQuantity() < itemReq.quantity()) {
                throw new BadRequestException("Insufficient stock for variant");
            }
            variant.setStockQuantity(variant.getStockQuantity() - itemReq.quantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.quantity());
            item.setPriceAtTime(product.getPrice());
            item.setSize(itemReq.size());
            item.setColor(itemReq.color());

            order.getItems().add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setTotalAmount(total);
        order = orderRepository.save(order);

        whatsAppService.notifyAdminNewOrder(order.getId());
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getBuyerOrders(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(orderMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForUser(UUID id, User user) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found for this user");
        }
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(orderMapper::toResponse);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return orderMapper.toResponse(order);
    }
}