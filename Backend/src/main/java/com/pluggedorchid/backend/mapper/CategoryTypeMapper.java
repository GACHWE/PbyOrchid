package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.CategoryTypeResponse;
import com.pluggedorchid.backend.entity.CategoryType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryTypeMapper {
    CategoryTypeResponse toResponse(CategoryType categoryType);
}