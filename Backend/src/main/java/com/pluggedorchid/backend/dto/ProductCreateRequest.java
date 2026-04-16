//package com.pluggedorchid.backend.dto;
//
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Positive;
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.UUID;
//
//public record ProductCreateRequest(
//        @NotBlank String name,
//        String description,
//        @NotNull @Positive BigDecimal price,
//        @NotBlank String brand,
//        String gender,
//        @NotNull UUID categoryId,
//        UUID categoryTypeId,
//        String slug,
//        List<ProductVariantDto> variants,
//        List<ProductResourceDto> resources
//) {}