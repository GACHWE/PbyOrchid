//package com.pluggedorchid.backend.controller;
//
//import com.pluggedorchid.dto.ReviewResponse;
//import com.pluggedorchid.backend.service.ReviewService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/v1/public/reviews")
//@RequiredArgsConstructor
//public class PublicReviewController {
//
//    private final ReviewService reviewService;
//
//    @GetMapping("/sneakers/{sneakerId}")
//    public ResponseEntity<Page<ReviewResponse>> getReviewsForSneaker(@PathVariable UUID sneakerId, Pageable pageable) {
//        return ResponseEntity.ok(reviewService.getReviewsBySneaker(sneakerId, pageable));
//    }
//}