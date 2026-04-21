package com.pluggedorchid.backend.auth.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    private int orderCount;
    private BigDecimal totalSpent;
}