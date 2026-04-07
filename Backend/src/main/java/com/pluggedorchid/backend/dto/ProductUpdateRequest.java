package com.pluggedorchid.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductUpdateRequest(
        String name,
        String description,
        BigDecimal price,
        String brand,
        String gender,
        UUID categoryId,
        UUID categoryTypeId,
        String slug,
        List<ProductVariantDto> variants,
        List<ProductResourceDto> resources
) {}

