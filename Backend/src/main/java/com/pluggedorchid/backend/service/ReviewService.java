//package com.pluggedorchid.backend.service;
//
//import com.pluggedorchid.dto.ReviewRequest;
//import com.pluggedorchid.dto.ReviewResponse;
//import com.pluggedorchid.backend.entity.Review;
//import com.pluggedorchid.entity.User;
//import com.pluggedorchid.exception.ResourceNotFoundException;
//import com.pluggedorchid.backend.mapper.ReviewMapper;
//import com.pluggedorchid.backend.repository.OrderRepository;
//import com.pluggedorchid.backend.repository.ReviewRepository;
//import com.pluggedorchid.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class ReviewService {
//
//    private final ReviewRepository reviewRepository;
//    private final SneakerRepository sneakerRepository;
//    private final UserRepository userRepository;
//    private final OrderRepository orderRepository;
//    private final ReviewMapper reviewMapper;
//
//    @Transactional
//    public ReviewResponse addReview(UUID userId, UUID sneakerId, ReviewRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//        Sneaker sneaker = sneakerRepository.findById(sneakerId)
//                .orElseThrow(() -> new ResourceNotFoundException("Sneaker not found"));
//
//        if (reviewRepository.existsByUserIdAndSneakerId(userId, sneakerId)) {
//            throw new RuntimeException("You have already reviewed this sneaker");
//        }
//
//        boolean verifiedPurchase = orderRepository.existsByUserIdAndSneakerId(userId, sneakerId);
//
//        Review review = reviewMapper.toEntity(request);
//        review.setUser(user);
//        review.setSneaker(sneaker);
//        review.setVerifiedPurchase(verifiedPurchase);
//        Review saved = reviewRepository.save(review);
//
//        reviewRepository.updateSneakerRatingStats(sneakerId);
//
//        return reviewMapper.toResponse(saved);
//    }
//
//    @Transactional(readOnly = true)
//    public Page<ReviewResponse> getReviewsBySneaker(UUID sneakerId, Pageable pageable) {
//        return reviewRepository.findBySneakerId(sneakerId, pageable)
//                .map(reviewMapper::toResponse);
//    }
//
//    @Transactional(readOnly = true)
//    public Page<ReviewResponse> getReviewsByUser(UUID userId, Pageable pageable) {
//        return reviewRepository.findByUserId(userId, pageable)
//                .map(reviewMapper::toResponse);
//    }
//}