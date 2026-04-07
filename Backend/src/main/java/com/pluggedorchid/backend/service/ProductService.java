package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.*;
import com.pluggedorchid.backend.entity.*;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.ProductMapper;
import com.pluggedorchid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryTypeRepository categoryTypeRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        log.info("Creating new product: {}", request.name());

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        CategoryType categoryType = null;
        if (request.categoryTypeId() != null) {
            categoryType = categoryTypeRepository.findById(request.categoryTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category type not found with id: " + request.categoryTypeId()));
        }

        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setCategoryType(categoryType);
        product.setSlug(generateSlug(request.name())); // always generate slug

        // Map variants
        if (request.variants() != null && !request.variants().isEmpty()) {
            product.getVariants().addAll(productMapper.mapVariants(request.variants(), product));
        }

        // Map resources (images)
        if (request.resources() != null && !request.resources().isEmpty()) {
            product.getResources().addAll(productMapper.mapResources(request.resources(), product));
        }

        product = productRepository.save(product);
        log.info("Product created with id: {}", product.getId());

        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto updateProduct(UUID id, ProductUpdateRequest request) {
        log.info("Updating product with id: {}", id);

        Product product = productRepository.findByIdWithResources(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update basic fields (only if provided)
        productMapper.updateEntity(product, request);

        // Update category if provided
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));
            product.setCategory(category);
        }

        // Update category type if provided
        if (request.categoryTypeId() != null) {
            CategoryType type = categoryTypeRepository.findById(request.categoryTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category type not found with id: " + request.categoryTypeId()));
            product.setCategoryType(type);
        }

        // Update slug if provided
        if (request.slug() != null && !request.slug().isBlank()) {
            product.setSlug(request.slug());
        }

        // Update variants if provided
        if (request.variants() != null) {
            product.getVariants().clear();
            product.getVariants().addAll(productMapper.mapVariants(request.variants(), product));
        }

        // Update resources (images) if provided – only delete images that are not in the new list
        if (request.resources() != null) {
            Set<String> newUrls = request.resources().stream()
                    .map(ProductResourceDto::url)
                    .collect(Collectors.toSet());

            // Delete removed images from Cloudinary
            List<ProductResources> toRemove = product.getResources().stream()
                    .filter(res -> !newUrls.contains(res.getUrl()))
                    .toList();

            for (ProductResources res : toRemove) {
                try {
                    cloudinaryService.deleteFileByUrl(res.getUrl());
                    log.debug("Deleted old image: {}", res.getUrl());
                } catch (IOException e) {
                    log.warn("Failed to delete old image: {}", res.getUrl(), e);
                }
            }

            // Keep only resources that are still present
            product.getResources().removeAll(toRemove);

            // Add new resources (those not already present)
            List<String> existingUrls = product.getResources().stream()
                    .map(ProductResources::getUrl)
                    .toList();

            List<ProductResourceDto> newResources = request.resources().stream()
                    .filter(dto -> !existingUrls.contains(dto.url()))
                    .toList();

            product.getResources().addAll(productMapper.mapResources(newResources, product));
        }
        product = productRepository.save(product);
        log.info("Product updated: {}", id);

        return productMapper.toDto(product);
    }

    @Transactional
    public void deleteProduct(UUID id) throws IOException {
        log.info("Deleting product with id: {}", id);

        Product product = productRepository.findByIdWithResources(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Delete all associated images from Cloudinary
        for (ProductResources res : product.getResources()) {
            try {
                cloudinaryService.deleteFileByUrl(res.getUrl());
                log.debug("Deleted image: {}", res.getUrl());
            } catch (IOException e) {
                log.error("Failed to delete image: {}", res.getUrl(), e);
                // Continue deletion even if one image fails
            }
        }
        productRepository.delete(product);
        log.info("Product deleted: {}", id);
    }

    // ──────────────────────────────────────────────────────────────
    // PUBLIC READ METHODS
    // ──────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(
            UUID categoryId,
            String brand,
            String gender,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured,
            Boolean newArrival,
            String search,
            Pageable pageable) {

        Specification<Product> spec = buildSpecification(
                categoryId, brand, gender, minPrice, maxPrice, featured, newArrival, search);

        return productRepository.findAll(spec, pageable)
                .map(productMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findByIdWithResources(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithResources(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return productMapper.toDto(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return productRepository.findFeaturedProducts(pageable)
                .map(productMapper::toDto);
    }

    // ──────────────────────────────────────────────────────────────
    // ADMIN FEATURES
    // ──────────────────────────────────────────────────────────────
    @Transactional
    public ProductDto featureProduct(UUID id, FeatureProductRequest request) {
        log.info("Featuring product: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setFeatured(true);

        if (request.discountPercent() != null && request.discountPercent().compareTo(BigDecimal.ZERO) > 0) {
            if (product.getOriginalPrice() == null) {
                product.setOriginalPrice(product.getPrice());
            }
            BigDecimal discountFactor = BigDecimal.ONE.subtract(
                    request.discountPercent().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));

            product.setPrice(product.getOriginalPrice()
                    .multiply(discountFactor)
                    .setScale(2, RoundingMode.HALF_UP));
        }

        LocalDateTime expiration = LocalDateTime.now();
        if (request.months() != null && request.months() > 0) expiration = expiration.plusMonths(request.months());
        if (request.days() != null && request.days() > 0) expiration = expiration.plusDays(request.days());
        if (request.hours() != null && request.hours() > 0) expiration = expiration.plusHours(request.hours());
        if (request.minutes() != null && request.minutes() > 0) expiration = expiration.plusMinutes(request.minutes());

        product.setFeaturedUntil(expiration.isAfter(LocalDateTime.now())
                ? Timestamp.valueOf(expiration)
                : null);

        product = productRepository.save(product);
        log.info("Product featured: {}", id);

        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto unfeatureProduct(UUID id) {
        log.info("Unfeaturing product: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setFeatured(false);
        product.setFeaturedUntil(null);
        if (product.getOriginalPrice() != null) {
            product.setPrice(product.getOriginalPrice());
            product.setOriginalPrice(null);
        }
        product = productRepository.save(product);
        log.info("Product unfeatured: {}", id);

        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto toggleNewArrival(UUID id, boolean newArrival) {
        log.info("Toggling new arrival for product {} to {}", id, newArrival);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setNewArrival(newArrival);
        product = productRepository.save(product);
        log.info("New arrival toggled for product: {}", id);

        return productMapper.toDto(product);
    }

    private String generateSlug(String name) {
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        // Ensure uniqueness if needed
        String originalSlug = slug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }
        return slug;
    }

    private Specification<Product> buildSpecification(
            UUID categoryId,
            String brand,
            String gender,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured,
            Boolean newArrival,
            String search) {

        Specification<Product> spec = Specification.where(null);

        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (brand != null && !brand.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand"), brand));
        }
        if (gender != null && !gender.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("gender"), gender));
        }
        if (minPrice != null && maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("price"), minPrice, maxPrice));
        } else if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        } else if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }
        if (featured != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("featured"), featured));
        }
        if (newArrival != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("newArrival"), newArrival));
        }
        if (search != null && !search.isBlank()) {
            String term = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("name")), term),
                            cb.like(cb.lower(root.get("description")), term)
                    ));
        }
        return spec;
    }
}