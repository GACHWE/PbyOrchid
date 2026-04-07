package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.*;
import com.pluggedorchid.backend.entity.*;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        uses = {CategoryMapper.class, CategoryTypeMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    // CREATE: ProductCreateRequest → Product
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    @Mapping(target = "newArrival", constant = "true")
    @Mapping(target = "featured", constant = "false")
    @Mapping(target = "featuredUntil", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "categoryType", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "resources", ignore = true)
    Product toEntity(ProductCreateRequest request);

    // UPDATE: ProductUpdateRequest → existing Product (partial)
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
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "resources", ignore = true)
    void updateEntity(@MappingTarget Product product, ProductUpdateRequest request);

    // READ: Product → ProductDto
    @Mapping(source = "category", target = "category")
    @Mapping(source = "categoryType", target = "categoryType")
    ProductDto toDto(Product product);

    // Helper methods for variants and resources (same as before)
    default List<ProductVariant> mapVariants(List<ProductVariantDto> variantDtos, Product product) {
        if (variantDtos == null) return List.of();
        return variantDtos.stream()
                .map(dto -> {
                    ProductVariant v = new ProductVariant();
                    v.setColor(dto.color());
                    v.setSize(dto.size());
                    v.setStockQuantity(dto.stockQuantity());
                    v.setProduct(product);
                    return v;
                })
                .collect(Collectors.toList());
    }

    default List<ProductResources> mapResources(List<ProductResourceDto> resourceDtos, Product product) {
        if (resourceDtos == null) return List.of();
        return resourceDtos.stream()
                .map(dto -> {
                    ProductResources r = new ProductResources();
                    r.setUrl(dto.url());
                    r.setResourceType(dto.resourceType() != null ? dto.resourceType() : "image");
                    r.setProduct(product);
                    return r;
                })
                .collect(Collectors.toList());
    }
}