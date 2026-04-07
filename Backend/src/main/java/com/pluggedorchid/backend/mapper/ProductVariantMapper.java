package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.ProductVariantDto;
import com.pluggedorchid.backend.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductVariant toEntity(ProductVariantDto dto);

    ProductVariantDto toDto(ProductVariant variant);
}