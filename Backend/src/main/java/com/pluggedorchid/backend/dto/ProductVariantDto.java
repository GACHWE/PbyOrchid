package com.pluggedorchid.backend.dto;

public record ProductVariantDto(
        String color,
        String size,
        Integer stockQuantity
) {}