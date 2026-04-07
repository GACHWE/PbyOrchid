//package com.pluggedorchid.backend.controller;
//
//import com.pluggedorchid.service.ProductServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.data.web.PageableDefault;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/v1/public/sneakers")
//@RequiredArgsConstructor
//public class PublicSneakerController {
//
//    private final ProductServiceImpl sneakerService;
//
//    @GetMapping
//    public ResponseEntity<Page<SneakerResponse>> getAllSneakers(
//            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        return ResponseEntity.ok(sneakerService.getAllSneakers(pageable));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<SneakerResponse> getSneakerById(@PathVariable UUID id) {
//        return ResponseEntity.ok(sneakerService.getSneakerById(id));
//    }
//
//    @GetMapping("/filter")
//    public ResponseEntity<Page<SneakerResponse>> filterSneakers(
//            @RequestParam(required = false) List<String> brands,
//            @RequestParam(required = false) List<Sneaker.Gender> genders,
//            @RequestParam(required = false) BigDecimal minPrice,
//            @RequestParam(required = false) BigDecimal maxPrice,
//            @PageableDefault(size = 20) Pageable pageable) {
//
//        if (minPrice == null) minPrice = BigDecimal.ZERO;
//        if (maxPrice == null) maxPrice = BigDecimal.valueOf(10000);
//
//        return ResponseEntity.ok(sneakerService.filterSneakers(brands, genders, minPrice, maxPrice, pageable));
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<Page<SneakerResponse>> searchSneakers(
//            @RequestParam String keyword,
//            @PageableDefault(size = 20) Pageable pageable) {
//        return ResponseEntity.ok(sneakerService.searchByKeyword(keyword, pageable));
//    }
//}