//package com.pluggedorchid.backend.service;
//
//import com.pluggedorchid.backend.dto.*;
//import com.pluggedorchid.backend.entity.*;
//import com.pluggedorchid.backend.exception.ResourceNotFoundException;
//import com.pluggedorchid.backend.mapper.ProductMapper;
//import com.pluggedorchid.backend.repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.io.IOException;
//import java.math.BigDecimal;
//import java.math.RoundingMode;
//import java.sql.Timestamp;
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class ProductService {
//
//    private final ProductRepository productRepository;
//    private final CategoryRepository categoryRepository;
//    private final CategoryTypeRepository categoryTypeRepository;
//    private final ProductMapper productMapper;
//    private final CloudinaryService cloudinaryService;
//
//    // ──────────────────────────────────────────────────────────────
//    // CREATE & UPDATE (using unified ProductDto with IDs)
//    // ──────────────────────────────────────────────────────────────
//
//    @Transactional
//    public ProductDto createProduct(ProductDto dto) {
//        log.info("Creating new product: {}", dto.name());
//
//        // Fetch category and optional categoryType using the IDs from DTO
//        Category category = findCategoryById(dto.categoryId());
//        CategoryType categoryType = dto.categoryTypeId() != null
//                ? findCategoryTypeById(dto.categoryTypeId())
//                : null;
//
//        // Map DTO to entity (MapStruct handles variants/resources and sets defaults)
//        Product product = productMapper.toEntity(dto);
//        product.setCategory(category);
//        product.setCategoryType(categoryType);
//        product.setSlug(generateUniqueSlug(dto.name()));
//
//        Product saved = productRepository.save(product);
//        log.info("Product created with id: {}", saved.getId());
//
//        return productMapper.toDto(saved);
//    }
//
//    @Transactional
//    public ProductDto updateProduct(UUID id, ProductDto dto) {
//        log.info("Updating product with id: {}", id);
//
//        Product product = productRepository.findByIdWithResources(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
//
//        // Apply partial update (ignores null fields)
//        productMapper.updateEntity(product, dto);
//
//        // Update category if categoryId is provided
//        if (dto.categoryId() != null) {
//            product.setCategory(findCategoryById(dto.categoryId()));
//        }
//
//        // Update categoryType if categoryTypeId is provided
//        if (dto.categoryTypeId() != null) {
//            product.setCategoryType(findCategoryTypeById(dto.categoryTypeId()));
//        }
//
//        // Update slug if explicitly provided
//        if (dto.slug() != null && !dto.slug().isBlank()) {
//            product.setSlug(dto.slug());
//        }
//
//        // Handle variants update (replace entire collection)
//        if (dto.variants() != null) {
//            updateVariants(product, dto.variants());
//        }
//
//        // Handle resources update (sync with Cloudinary)
//        if (dto.resources() != null) {
//            updateResources(product, dto.resources());
//        }
//
//        Product saved = productRepository.save(product);
//        log.info("Product updated: {}", id);
//
//        return productMapper.toDto(saved);
//    }
//
//    // ──────────────────────────────────────────────────────────────
//    // DELETE
//    // ──────────────────────────────────────────────────────────────
//
//    @Transactional
//    public void deleteProduct(UUID id) throws IOException {
//        log.info("Deleting product with id: {}", id);
//
//        Product product = productRepository.findByIdWithResources(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
//
//        deleteAllProductImages(product);
//        productRepository.delete(product);
//        log.info("Product deleted: {}", id);
//    }
//
//    // ──────────────────────────────────────────────────────────────
//    // QUERY METHODS
//    // ──────────────────────────────────────────────────────────────
//
//    @Transactional(readOnly = true)
//    public Page<ProductDto> getAllProducts(
//            UUID categoryId,
//            String brand,
//            String gender,
//            BigDecimal minPrice,
//            BigDecimal maxPrice,
//            Boolean featured,
//            Boolean newArrival,
//            String search,
//            Pageable pageable) {
//
//        Specification<Product> spec = buildSpecification(
//                categoryId, brand, gender, minPrice, maxPrice, featured, newArrival, search);
//
//        return productRepository.findAll(spec, pageable)
//                .map(productMapper::toDto);
//    }
//
//    // ✅ Correct – returns DTO using mapper
//    public ProductDto getProductById(UUID id) {
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
//        return productMapper.toDto(product);
//    }
//
//    @Transactional(readOnly = true)
//    public ProductDto getProductBySlug(String slug) {
//        Product product = productRepository.findBySlugWithResources(slug)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
//        return productMapper.toDto(product);
//    }
//
//    @Transactional(readOnly = true)
//    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
//        return productRepository.findFeaturedProducts(pageable)
//                .map(productMapper::toDto);
//    }
//
//    // ──────────────────────────────────────────────────────────────
//    // ADMIN ACTIONS
//    // ──────────────────────────────────────────────────────────────
//
//    @Transactional
//    public ProductDto featureProduct(UUID id, FeatureProductRequest request) {
//        log.info("Featuring product: {}", id);
//
//        Product product = findProductById(id);
//        product.setFeatured(true);
//
//        applyFeatureDiscount(product, request.discountPercent());
//        product.setFeaturedUntil(calculateExpiration(request));
//
//        Product saved = productRepository.save(product);
//        log.info("Product featured: {}", id);
//
//        return productMapper.toDto(saved);
//    }
//
//    @Transactional
//    public ProductDto unfeatureProduct(UUID id) {
//        log.info("Unfeaturing product: {}", id);
//
//        Product product = findProductById(id);
//        product.setFeatured(false);
//        product.setFeaturedUntil(null);
//        restoreOriginalPrice(product);
//
//        Product saved = productRepository.save(product);
//        log.info("Product unfeatured: {}", id);
//
//        return productMapper.toDto(saved);
//    }
//
//    @Transactional
//    public ProductDto toggleNewArrival(UUID id, boolean newArrival) {
//        log.info("Toggling new arrival for product {} to {}", id, newArrival);
//
//        Product product = findProductById(id);
//        product.setNewArrival(newArrival);
//        Product saved = productRepository.save(product);
//        log.info("New arrival toggled for product: {}", id);
//
//        return productMapper.toDto(saved);
//    }
//
//    // ──────────────────────────────────────────────────────────────
//    // PRIVATE HELPER METHODS
//    // ──────────────────────────────────────────────────────────────
//
//    private Product findProductById(UUID id) {
//        return productRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
//    }
//
//    private Category findCategoryById(UUID categoryId) {
//        return categoryRepository.findById(categoryId)
//                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
//    }
//
//    private CategoryType findCategoryTypeById(UUID categoryTypeId) {
//        return categoryTypeRepository.findById(categoryTypeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Category type not found with id: " + categoryTypeId));
//    }
//
//    private String generateUniqueSlug(String name) {
//        String baseSlug = name.toLowerCase()
//                .replaceAll("[^a-z0-9]+", "-")
//                .replaceAll("^-|-$", "");
//        String slug = baseSlug;
//        int counter = 1;
//        while (productRepository.existsBySlug(slug)) {
//            slug = baseSlug + "-" + counter++;
//        }
//        return slug;
//    }
//
//    private void updateVariants(Product product, List<ProductVariantDto> variantDtos) {
//        product.getVariants().clear();
//        if (variantDtos != null && !variantDtos.isEmpty()) {
//            List<ProductVariant> newVariants = productMapper.mapVariantDtosToEntities(variantDtos);
//            newVariants.forEach(product::addVariant);
//        }
//    }
//
//    @Transactional
//    public ProductResources addResourceToProduct(UUID productId, String imageUrl) {
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
//
//        ProductResources resource = new ProductResources();
//        resource.setUrl(imageUrl);
//        resource.setProduct(product);
//
//        product.getResources().add(resource);   // Add to collection
//        productRepository.save(product);        // Cascade will save the new resource
//
//        return resource;
//    }
//
//    private void updateResources(Product product, List<ProductResourceDto> resourceDtos) {
//        Set<String> newUrls = resourceDtos.stream()
//                .map(ProductResourceDto::url)
//                .collect(Collectors.toSet());
//
//        List<ProductResources> toRemove = product.getResources().stream()
//                .filter(res -> !newUrls.contains(res.getUrl()))
//                .toList();
//
//        for (ProductResources res : toRemove) {
//            deleteImageSafely(res.getUrl());
//        }
//        product.getResources().removeAll(toRemove);
//
//        Set<String> existingUrls = product.getResources().stream()
//                .map(ProductResources::getUrl)
//                .collect(Collectors.toSet());
//
//        List<ProductResourceDto> newResourceDtos = resourceDtos.stream()
//                .filter(dto -> !existingUrls.contains(dto.url()))
//                .toList();
//
//        if (!newResourceDtos.isEmpty()) {
//            List<ProductResources> newResources = productMapper.mapResourceDtosToEntities(newResourceDtos);
//            newResources.forEach(product::addResource);
//        }
//    }
//
//    private void deleteAllProductImages(Product product) {
//        for (ProductResources res : product.getResources()) {
//            deleteImageSafely(res.getUrl());
//        }
//    }
//
//    private void deleteImageSafely(String imageUrl) {
//        try {
//            cloudinaryService.deleteFileByUrl(imageUrl);
//            log.debug("Deleted image: {}", imageUrl);
//        } catch (IOException e) {
//            log.warn("Failed to delete image: {}", imageUrl, e);
//        }
//    }
//
//    private void applyFeatureDiscount(Product product, BigDecimal discountPercent) {
//        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
//            if (product.getOriginalPrice() == null) {
//                product.setOriginalPrice(product.getPrice());
//            }
//            BigDecimal discountFactor = BigDecimal.ONE.subtract(
//                    discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
//            BigDecimal discountedPrice = product.getOriginalPrice()
//                    .multiply(discountFactor)
//                    .setScale(2, RoundingMode.HALF_UP);
//            product.setPrice(discountedPrice);
//        }
//    }
//
//    private void restoreOriginalPrice(Product product) {
//        if (product.getOriginalPrice() != null) {
//            product.setPrice(product.getOriginalPrice());
//            product.setOriginalPrice(null);
//        }
//    }
//
//    private Timestamp calculateExpiration(FeatureProductRequest request) {
//        LocalDateTime expiration = LocalDateTime.now();
//        if (request.months() != null && request.months() > 0) expiration = expiration.plusMonths(request.months());
//        if (request.days() != null && request.days() > 0) expiration = expiration.plusDays(request.days());
//        if (request.hours() != null && request.hours() > 0) expiration = expiration.plusHours(request.hours());
//        if (request.minutes() != null && request.minutes() > 0) expiration = expiration.plusMinutes(request.minutes());
//        return expiration.isAfter(LocalDateTime.now()) ? Timestamp.valueOf(expiration) : null;
//    }
//
//    private Specification<Product> buildSpecification(
//            UUID categoryId,
//            String brand,
//            String gender,
//            BigDecimal minPrice,
//            BigDecimal maxPrice,
//            Boolean featured,
//            Boolean newArrival,
//            String search) {
//
//        Specification<Product> spec = Specification.where(null);
//
//        if (categoryId != null) {
//            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
//        }
//        if (brand != null && !brand.isBlank()) {
//            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand"), brand));
//        }
//        if (gender != null && !gender.isBlank()) {
//            spec = spec.and((root, query, cb) -> cb.equal(root.get("gender"), gender));
//        }
//        if (minPrice != null && maxPrice != null) {
//            spec = spec.and((root, query, cb) -> cb.between(root.get("price"), minPrice, maxPrice));
//        } else if (minPrice != null) {
//            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
//        } else if (maxPrice != null) {
//            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
//        }
//        if (featured != null) {
//            spec = spec.and((root, query, cb) -> cb.equal(root.get("featured"), featured));
//        }
//        if (newArrival != null) {
//            spec = spec.and((root, query, cb) -> cb.equal(root.get("newArrival"), newArrival));
//        }
//        if (search != null && !search.isBlank()) {
//            String term = "%" + search.toLowerCase() + "%";
//            spec = spec.and((root, query, cb) ->
//                    cb.or(
//                            cb.like(cb.lower(root.get("name")), term),
//                            cb.like(cb.lower(root.get("description")), term)
//                    ));
//        }
//        return spec;
//    }
//}
package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.*;
import com.pluggedorchid.backend.entity.*;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.ProductMapper;
import com.pluggedorchid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
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

    // ──────────────────────────────────────────────────────────────
    // CREATE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        log.info("Creating new product: {}", dto.name());

        Category category = findCategoryById(dto.categoryId());
        CategoryType categoryType = dto.categoryTypeId() != null
                ? findCategoryTypeById(dto.categoryTypeId())
                : null;

        Product product = productMapper.toEntity(dto);
        product.setCategory(category);
        product.setCategoryType(categoryType);
        product.setSlug(generateUniqueSlug(dto.name()));

        Product saved = productRepository.save(product);
        log.info("Product created with id: {}", saved.getId());

        return productMapper.toDto(saved);
    }

    // ──────────────────────────────────────────────────────────────
    // UPDATE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ProductDto updateProduct(UUID id, ProductDto dto) {
        log.info("Updating product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update basic fields (ignores nulls)
        productMapper.updateEntity(product, dto);

        if (dto.categoryId() != null) {
            product.setCategory(findCategoryById(dto.categoryId()));
        }
        if (dto.categoryTypeId() != null) {
            product.setCategoryType(findCategoryTypeById(dto.categoryTypeId()));
        }
        if (dto.slug() != null && !dto.slug().isBlank()) {
            product.setSlug(dto.slug());
        }

        // Handle variants (lazy – but we can modify within transaction)
        if (dto.variants() != null) {
            updateVariants(product, dto.variants());
        }

        // Handle resources (already loaded eagerly – compare and sync)
        if (dto.resources() != null) {
            updateResources(product, dto.resources());
        }

        Product saved = productRepository.save(product);
        log.info("Product updated: {}", id);
        return productMapper.toDto(saved);
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE – optimal (still loads resources to clean Cloudinary)
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public void deleteProduct(UUID id) throws IOException {
        log.info("Deleting product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Delete images from Cloudinary (resources are already loaded eagerly)
        for (ProductResources res : product.getResources()) {
            try {
                cloudinaryService.deleteFileByUrl(res.getUrl());
                log.debug("Deleted image: {}", res.getUrl());
            } catch (IOException e) {
                log.warn("Failed to delete image: {}", res.getUrl(), e);
            }
        }

        productRepository.deleteById(id);
        log.info("Product deleted: {}", id);
    }

    // ──────────────────────────────────────────────────────────────
    // QUERY METHODS
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

        // Resources are already loaded eagerly (thanks to SUBSELECT).
        // Variants remain lazy – not needed in list views.
        return productRepository.findAll(spec, pageable)
                .map(productMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Initialize variants lazily (needed for detail page)
        Hibernate.initialize(product.getVariants());

        return productMapper.toDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        Hibernate.initialize(product.getVariants());

        return productMapper.toDto(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return productRepository.findFeaturedProducts(pageable)
                .map(productMapper::toDto);
    }

    // ──────────────────────────────────────────────────────────────
    // ADMIN ACTIONS (feature, unfeature, toggle new arrival)
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ProductDto featureProduct(UUID id, FeatureProductRequest request) {
        log.info("Featuring product: {}", id);

        Product product = findProductById(id);
        product.setFeatured(true);
        applyFeatureDiscount(product, request.discountPercent());
        product.setFeaturedUntil(calculateExpiration(request));

        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }

    @Transactional
    public ProductDto unfeatureProduct(UUID id) {
        log.info("Unfeaturing product: {}", id);

        Product product = findProductById(id);
        product.setFeatured(false);
        product.setFeaturedUntil(null);
        restoreOriginalPrice(product);

        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }

    @Transactional
    public ProductDto toggleNewArrival(UUID id, boolean newArrival) {
        log.info("Toggling new arrival for product {} to {}", id, newArrival);

        Product product = findProductById(id);
        product.setNewArrival(newArrival);
        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }

    // ──────────────────────────────────────────────────────────────
    // UTILITY FOR FILE UPLOAD CONTROLLER
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ProductResources addResourceToProduct(UUID productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductResources resource = new ProductResources();
        resource.setUrl(imageUrl);
        resource.setProduct(product);
        product.getResources().add(resource);   // cascade will save
        productRepository.save(product);
        return resource;
    }

    // ──────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ──────────────────────────────────────────────────────────────

    private Product findProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Category findCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private CategoryType findCategoryTypeById(UUID categoryTypeId) {
        return categoryTypeRepository.findById(categoryTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Category type not found with id: " + categoryTypeId));
    }

    private String generateUniqueSlug(String name) {
        String baseName = name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        String baseSlug = "orchid-" + baseName;   // ← prefix added
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private void updateVariants(Product product, List<ProductVariantDto> variantDtos) {
        product.getVariants().clear();
        if (variantDtos != null && !variantDtos.isEmpty()) {
            List<ProductVariant> newVariants = productMapper.mapVariantDtosToEntities(variantDtos);
            newVariants.forEach(product::addVariant);
        }
    }

    private void updateResources(Product product, List<ProductResourceDto> resourceDtos) {
        Set<String> newUrls = resourceDtos.stream()
                .map(ProductResourceDto::url)
                .collect(Collectors.toSet());

        // Remove resources not present in DTO
        List<ProductResources> toRemove = product.getResources().stream()
                .filter(res -> !newUrls.contains(res.getUrl()))
                .toList();

        for (ProductResources res : toRemove) {
            try {
                cloudinaryService.deleteFileByUrl(res.getUrl());
            } catch (IOException e) {
                log.warn("Failed to delete image: {}", res.getUrl(), e);
            }
            product.removeResource(res);
        }

        // Add new resources
        Set<String> existingUrls = product.getResources().stream()
                .map(ProductResources::getUrl)
                .collect(Collectors.toSet());

        List<ProductResourceDto> newResourceDtos = resourceDtos.stream()
                .filter(dto -> !existingUrls.contains(dto.url()))
                .toList();

        if (!newResourceDtos.isEmpty()) {
            List<ProductResources> newResources = productMapper.mapResourceDtosToEntities(newResourceDtos);
            newResources.forEach(product::addResource);
        }
    }

    private void applyFeatureDiscount(Product product, BigDecimal discountPercent) {
        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
            if (product.getOriginalPrice() == null) {
                product.setOriginalPrice(product.getPrice());
            }
            BigDecimal discountFactor = BigDecimal.ONE.subtract(
                    discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            BigDecimal discountedPrice = product.getOriginalPrice()
                    .multiply(discountFactor)
                    .setScale(2, RoundingMode.HALF_UP);
            product.setPrice(discountedPrice);
        }
    }

    private void restoreOriginalPrice(Product product) {
        if (product.getOriginalPrice() != null) {
            product.setPrice(product.getOriginalPrice());
            product.setOriginalPrice(null);
        }
    }

    private Timestamp calculateExpiration(FeatureProductRequest request) {
        LocalDateTime expiration = LocalDateTime.now();
        if (request.months() != null && request.months() > 0) expiration = expiration.plusMonths(request.months());
        if (request.days() != null && request.days() > 0) expiration = expiration.plusDays(request.days());
        if (request.hours() != null && request.hours() > 0) expiration = expiration.plusHours(request.hours());
        if (request.minutes() != null && request.minutes() > 0) expiration = expiration.plusMinutes(request.minutes());
        return expiration.isAfter(LocalDateTime.now()) ? Timestamp.valueOf(expiration) : null;
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