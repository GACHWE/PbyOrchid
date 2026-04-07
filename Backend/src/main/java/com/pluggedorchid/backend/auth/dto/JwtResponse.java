package com.pluggedorchid.backend.auth.dto;

import java.util.UUID;

public record JwtResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        UUID userId,
        String email,
        String role
) {}