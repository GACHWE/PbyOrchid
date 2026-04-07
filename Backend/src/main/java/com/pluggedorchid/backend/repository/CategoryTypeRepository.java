package com.pluggedorchid.backend.repository;

import com.pluggedorchid.backend.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryTypeRepository extends JpaRepository<CategoryType, UUID> {
    Optional<CategoryType> findBySlug(String slug);
}