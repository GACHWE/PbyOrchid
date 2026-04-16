package com.pluggedorchid.backend.dto;
import java.util.UUID;
public record ProductVariantDto(
        UUID id,
        String color,
        String size,
        Integer stockQuantity
) {}