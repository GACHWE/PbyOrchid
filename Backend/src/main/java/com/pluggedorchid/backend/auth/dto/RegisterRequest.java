package com.pluggedorchid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password,
        @NotBlank String firstName,
        String lastName,
        @NotBlank
        @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Phone number must be 9-15 digits, optionally starting with +")
                String phoneNumber
) {}