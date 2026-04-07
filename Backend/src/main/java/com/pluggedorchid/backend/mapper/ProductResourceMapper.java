package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.ProductResourceDto;
import com.pluggedorchid.backend.entity.ProductResources;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductResourceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductResources toEntity(ProductResourceDto dto);

    ProductResourceDto toDto(ProductResources resource);
}