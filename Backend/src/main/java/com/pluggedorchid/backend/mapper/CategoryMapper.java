package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.CategoryDto;
import com.pluggedorchid.backend.entity.Category;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CategoryMapper {

    // ─────────────────────────────────────────────────────────────
    // CREATE: CategoryDto → Category (new entity)
    // ─────────────────────────────────────────────────────────────
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "slug", ignore = true)               // bidirectional side
    @Mapping(target = "categoryTypes", ignore = true)          // if exists
    Category toEntity(CategoryDto dto);

    // ─────────────────────────────────────────────────────────────
    // UPDATE: CategoryDto → existing Category (partial, ignores nulls)
    // ─────────────────────────────────────────────────────────────
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "categoryTypes", ignore = true)
    void updateEntity(@MappingTarget Category category, CategoryDto dto);

    // ─────────────────────────────────────────────────────────────
    // READ: Category → CategoryDto
    // ─────────────────────────────────────────────────────────────
    CategoryDto toDto(Category category);
}