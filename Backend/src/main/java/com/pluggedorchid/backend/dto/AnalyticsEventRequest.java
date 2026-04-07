package com.pluggedorchid.backend.dto;

import com.pluggedorchid.backend.entity.AnalyticsEvent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record AnalyticsEventRequest(
        @NotNull AnalyticsEvent.EventType eventType,
        UUID productId,
        @NotBlank String sessionId,
        @NotBlank String ipHash,
        Map<String, Object> metadata
) {}