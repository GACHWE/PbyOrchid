package com.pluggedorchid.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryDto(
        UUID id,                       // null for create
        @NotBlank String name,
        String description,
        @NotBlank String slug,
        LocalDateTime createdAt,       // ignored on write
        LocalDateTime updatedAt        // ignored on write
) {}