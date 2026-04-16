//package com.pluggedorchid.backend.repository;
//
//import com.pluggedorchid.backend.entity.Product;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.Optional;
//import java.util.UUID;
//
//public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
//
//    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.resources LEFT JOIN FETCH p.variants WHERE p.slug = :slug")
//    Optional<Product> findBySlugWithResources(@Param("slug") String slug);
//
//    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.resources LEFT JOIN FETCH p.variants WHERE p.id = :id")
//    Optional<Product> findByIdWithResources(@Param("id") UUID id);
//
//    @Query("SELECT p FROM Product p WHERE p.featured = true AND (p.featuredUntil IS NULL OR p.featuredUntil > CURRENT_TIMESTAMP)")
//    Page<Product> findFeaturedProducts(Pageable pageable);
//
//    boolean existsBySlug(String slug);
//}


package com.pluggedorchid.backend.repository;

import com.pluggedorchid.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    // No more JOIN FETCH queries – resources are eager, variants are lazy.
    // Plain findById and findBySlug already load resources (EAGER).
    Optional<Product> findById(UUID id);
    Optional<Product> findBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE p.featured = true AND (p.featuredUntil IS NULL OR p.featuredUntil > CURRENT_TIMESTAMP)")
    Page<Product> findFeaturedProducts(Pageable pageable);

    boolean existsBySlug(String slug);
}