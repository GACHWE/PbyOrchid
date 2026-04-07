package com.pluggedorchid.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String name,
        String description,
        @NotBlank String slug
) {}