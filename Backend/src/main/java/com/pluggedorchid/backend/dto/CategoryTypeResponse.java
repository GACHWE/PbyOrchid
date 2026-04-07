package com.pluggedorchid.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CategoryTypeResponse(
        UUID id,
        String name,
        String description,
        String slug,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}