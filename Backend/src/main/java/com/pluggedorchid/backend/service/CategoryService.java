package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.CategoryDto;
import com.pluggedorchid.backend.entity.Category;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.CategoryMapper;
import com.pluggedorchid.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return categoryMapper.toDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = categoryMapper.toEntity(dto);
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @Transactional
    public CategoryDto updateCategory(UUID id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryMapper.updateEntity(category, dto);
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}