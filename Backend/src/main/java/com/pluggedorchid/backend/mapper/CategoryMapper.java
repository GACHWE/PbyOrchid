package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.CategoryRequest;
import com.pluggedorchid.backend.dto.CategoryResponse;
import com.pluggedorchid.backend.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toEntity(CategoryRequest request);

    CategoryResponse toResponse(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Category category, CategoryRequest request);
}