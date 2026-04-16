package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.*;
import com.pluggedorchid.backend.entity.*;
import org.mapstruct.*;
import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ProductMapper {

    // ─────────────────────────────────────────────────────────────────
    // CREATE: ProductDto → Product (new entity)
    // ─────────────────────────────────────────────────────────────────
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    @Mapping(target = "newArrival", constant = "true")      // default for new products
    @Mapping(target = "featured", constant = "false")
    @Mapping(target = "featuredUntil", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "category", ignore = true)            // set by service after fetch
    @Mapping(target = "categoryType", ignore = true)        // set by service after fetch
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "resources", source = "resources")
    Product toEntity(ProductDto dto);

    // ─────────────────────────────────────────────────────────────────
    // UPDATE: ProductDto → existing Product (partial, ignores nulls)
    // ─────────────────────────────────────────────────────────────────
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "newArrival", ignore = true)
    @Mapping(target = "featured", ignore = true)
    @Mapping(target = "featuredUntil", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "categoryType", ignore = true)
    @Mapping(target = "variants", ignore = true)            // handled separately in service
    @Mapping(target = "resources", ignore = true)           // handled separately in service
    void updateEntity(@MappingTarget Product product, ProductDto dto);

    // ─────────────────────────────────────────────────────────────────
    // READ: Product → ProductDto (full response)
    // ─────────────────────────────────────────────────────────────────
    @Mapping(target = "categoryId", source = "category.id")           // was "category"
    @Mapping(target = "categoryTypeId", source = "categoryType.id")   // was "categoryType"
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "resources", source = "resources")
    ProductDto toDto(Product product);

    // ─────────────────────────────────────────────────────────────────
    // Collection mapping for variants (used by toEntity/toDto)
    // ─────────────────────────────────────────────────────────────────
    List<ProductVariant> mapVariantDtosToEntities(List<ProductVariantDto> dtos);
    List<ProductVariantDto> mapVariantEntitiesToDtos(List<ProductVariant> entities);

    // Single element mapping – required for collection mapping above
    @Mapping(target = "id", ignore = true)                  // ID assigned by DB
    @Mapping(target = "product", ignore = true)             // set via bidirectional helper
    ProductVariant toVariantEntity(ProductVariantDto dto);

    @Mapping(target = "id", source = "id")
    ProductVariantDto toVariantDto(ProductVariant entity);

    // ─────────────────────────────────────────────────────────────────
    // Collection mapping for resources
    // ─────────────────────────────────────────────────────────────────
    List<ProductResources> mapResourceDtosToEntities(List<ProductResourceDto> dtos);
    List<ProductResourceDto> mapResourceEntitiesToDtos(List<ProductResources> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductResources toResourceEntity(ProductResourceDto dto);

    ProductResourceDto toResourceDto(ProductResources entity);

    // ─────────────────────────────────────────────────────────────────
    // AfterMapping hooks to set bidirectional references
    // ─────────────────────────────────────────────────────────────────
    @AfterMapping
    default void linkVariantsToProduct(@MappingTarget Product product) {
        if (product.getVariants() != null) {
            product.getVariants().forEach(v -> v.setProduct(product));
        }
    }

    @AfterMapping
    default void linkResourcesToProduct(@MappingTarget Product product) {
        if (product.getResources() != null) {
            product.getResources().forEach(r -> r.setProduct(product));
        }
    }
}