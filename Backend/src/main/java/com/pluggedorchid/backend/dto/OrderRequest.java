package com.pluggedorchid.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record OrderRequest(
        @NotEmpty List<OrderItemRequest> items        ) {
    public record OrderItemRequest(
            @NotNull UUID productId,
            @NotNull Integer quantity,
            String size,
            String color
    ) {}
}