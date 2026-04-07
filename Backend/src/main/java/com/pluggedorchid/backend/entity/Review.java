//package com.pluggedorchid.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name = "reviews")
//@Getter
//@Setter
//public class Review extends BaseEntity {
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "sneaker_id", nullable = false)
//    private Sneaker sneaker;
//
//    @Column(nullable = false)
//    private Integer rating;
//
//    @Column(length = 1000)
//    private String comment;
//
//    private Boolean verifiedPurchase = false;
//}