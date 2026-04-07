package com.pluggedorchid.backend.dto;

import java.util.UUID;

public record ProductResourceDto(
        UUID id,
        String url,
        String resourceType
) {}