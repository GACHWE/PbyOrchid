//package com.pluggedorchid.backend.controller;
//
//import com.pluggedorchid.dto.*;
//import com.pluggedorchid.entity.User;
//import com.pluggedorchid.service.OrderService;
//import com.pluggedorchid.backend.service.ReviewService;
//import com.pluggedorchid.service.WishlistService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/v1/buyer")
//@RequiredArgsConstructor
//public class BuyerController {
//
//    private final OrderService orderService;
//    private final WishlistService wishlistService;
//    private final ReviewService reviewService;
//
//    private UUID getUserId(UserDetails userDetails) {
//        if (userDetails instanceof User user) {
//            return user.getId();
//        }
//        throw new RuntimeException("User not authenticated");
//    }
//
//    // Wishlist endpoints
//    @GetMapping("/wishlist")
//    public ResponseEntity<Page<SneakerResponse>> getWishlist(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(wishlistService.getWishlist(userId, pageable));
//    }
//
//    @PostMapping("/wishlist/{sneakerId}")
//    public ResponseEntity<Void> addToWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID sneakerId) {
//        UUID userId = getUserId(userDetails);
//        wishlistService.addToWishlist(userId, sneakerId);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/wishlist/{sneakerId}")
//    public ResponseEntity<Void> removeFromWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable UUID sneakerId) {
//        UUID userId = getUserId(userDetails);
//        wishlistService.removeFromWishlist(userId, sneakerId);
//        return ResponseEntity.noContent().build();
//    }
//
//    // Order endpoints
//    @PostMapping("/orders")
//    public ResponseEntity<OrderResponse> createOrder(@AuthenticationPrincipal UserDetails userDetails,
//                                                     @Valid @RequestBody OrderRequest request) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(orderService.createOrder(userId, request));
//    }
//
//    @GetMapping("/orders")
//    public ResponseEntity<Page<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(orderService.getOrdersByUser(userId, pageable));
//    }
//
//    @GetMapping("/orders/{orderId}")
//    public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal UserDetails userDetails,
//                                                      @PathVariable UUID orderId) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(orderService.getOrderById(userId, orderId));
//    }
//
//    // Review endpoints
//    @PostMapping("/reviews/sneakers/{sneakerId}")
//    public ResponseEntity<ReviewResponse> addReview(@AuthenticationPrincipal UserDetails userDetails,
//                                                    @PathVariable UUID sneakerId,
//                                                    @Valid @RequestBody ReviewRequest request) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(reviewService.addReview(userId, sneakerId, request));
//    }
//
//    @GetMapping("/reviews/my")
//    public ResponseEntity<Page<ReviewResponse>> getMyReviews(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
//        UUID userId = getUserId(userDetails);
//        return ResponseEntity.ok(reviewService.getReviewsByUser(userId, pageable));
//    }
//}