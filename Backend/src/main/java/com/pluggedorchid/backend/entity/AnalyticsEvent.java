package com.pluggedorchid.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "analytics_events",
        indexes = {
                @Index(name = "idx_event_timestamp", columnList = "timestamp"),
                @Index(name = "idx_event_type", columnList = "event_type"),
                @Index(name = "idx_event_user_id", columnList = "user_id"),
                @Index(name = "idx_event_product_id", columnList = "product_id")
        })
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    private UUID userId; // nullable for guests

    private UUID productId; // nullable for non-product events

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    private String ipHash; // SHA-256 of client IP

    @CreationTimestamp
    private LocalDateTime timestamp;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    public enum EventType {
        PAGE_VIEW,
        PRODUCT_VIEW,
        ADD_TO_CART,
        ADD_TO_WISHLIST,
        CHECKOUT_START,
        PURCHASE
    }
}