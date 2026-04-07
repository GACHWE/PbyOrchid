package com.pluggedorchid.backend.service;

import com.pluggedorchid.backend.dto.ProductDto;
import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.entity.Product;
import com.pluggedorchid.backend.entity.WishlistItem;
import com.pluggedorchid.backend.exception.BadRequestException;
import com.pluggedorchid.backend.exception.ResourceNotFoundException;
import com.pluggedorchid.backend.mapper.ProductMapper;
import com.pluggedorchid.backend.repository.ProductRepository;
import com.pluggedorchid.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public Page<ProductDto> getWishlist(User user, Pageable pageable) {
        return wishlistRepository.findByUser(user, pageable)
                .map(WishlistItem::getProduct)
                .map(productMapper::toDto);
    }

    @Transactional
    public void addToWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new BadRequestException("Product not in wishlist");
        }

        wishlistRepository.deleteByUserAndProduct(user, product);
    }
}