package com.pluggedorchid.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public record FeatureProductRequest(
        @DecimalMin("0.01") @DecimalMax("99.99") BigDecimal discountPercent,
        Integer months,
        Integer days,
        Integer hours,
        Integer minutes
) {}