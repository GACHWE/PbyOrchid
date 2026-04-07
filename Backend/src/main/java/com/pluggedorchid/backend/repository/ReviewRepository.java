//package com.pluggedorchid.backend.repository;
//
//import com.pluggedorchid.backend.entity.Review;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.UUID;
//
//@Repository
//public interface ReviewRepository extends JpaRepository<Review, UUID> {
//    Page<Review> findBySneakerId(UUID sneakerId, Pageable pageable);
//    Page<Review> findByUserId(UUID userId, Pageable pageable);
//    boolean existsByUserIdAndSneakerId(UUID userId, UUID sneakerId);
//
//    @Modifying
//    @Transactional
//    @Query("UPDATE Sneaker s SET s.averageRating = (SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.sneaker.id = :sneakerId), s.reviewCount = (SELECT COUNT(r) FROM Review r WHERE r.sneaker.id = :sneakerId) WHERE s.id = :sneakerId")
//    void updateSneakerRatingStats(@Param("sneakerId") UUID sneakerId);
//}