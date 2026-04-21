package com.pluggedorchid.backend.repository;

import com.pluggedorchid.backend.entity.WishlistItem;
import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<WishlistItem, UUID> {
    Page<WishlistItem> findByUser(User user, Pageable pageable);
    Optional<WishlistItem> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    @Query("SELECT w.product.id, COUNT(w) FROM WishlistItem w GROUP BY w.product.id ORDER BY COUNT(w) DESC")
    List<Object[]> getWishlistCountsGrouped(Pageable pageable);
}