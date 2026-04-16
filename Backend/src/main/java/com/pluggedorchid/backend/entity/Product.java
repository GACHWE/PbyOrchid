//package com.pluggedorchid.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.math.BigDecimal;
//import java.sql.Timestamp;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//@Entity
//@Table(name = "products",
//        indexes = {
//                @Index(name = "idx_product_category", columnList = "category_id"),
//                @Index(name = "idx_product_brand", columnList = "brand"),
//                @Index(name = "idx_product_gender", columnList = "gender"),
//                @Index(name = "idx_product_price", columnList = "price"),
//                @Index(name = "idx_product_slug", columnList = "slug")
//        })
//@Getter
//@Setter
//@NoArgsConstructor
//public class Product {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(length = 2000)
//    private String description;
//
//    @Column(nullable = false, precision = 12, scale = 2)
//    private BigDecimal price;
//
//    @Column(precision = 12, scale = 2)
//    private BigDecimal originalPrice;   // price before discount
//
//    @Column(nullable = false)
//    private String brand;
//
//    private String gender;              // MALE, FEMALE, UNISEX
//
//    private Float rating;               // average rating (optional)
//
//    @Column(nullable = false, unique = true)
//    private String slug;                // URL-friendly name
//
//    @Column(name = "is_new_arrival", nullable = false)
//    private boolean newArrival = false;
//
//    @Column(name = "is_deleted", nullable = false)
//    private boolean deleted = false;
//
//    @Column(name = "is_featured", nullable = false)
//    private boolean featured = false;
//
//    @Column(name = "featured_until")
//    private Timestamp featuredUntil;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "category_id")
//    private Category category;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "category_type_id")
//    private CategoryType categoryType;   // optional
//
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProductVariant> variants = new ArrayList<>();
//
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProductResources> resources = new ArrayList<>();
//
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    private LocalDateTime updatedAt;
//
//    // Helper methods
//    public void addVariant(ProductVariant variant) {
//        variants.add(variant);
//        variant.setProduct(this);
//    }
//
//    public void removeVariant(ProductVariant variant) {
//        variants.remove(variant);
//        variant.setProduct(null);
//    }
//
//    public void addResource(ProductResources resource) {
//        resources.add(resource);
//        resource.setProduct(this);
//    }
//
//    public void removeResource(ProductResources resource) {
//        resources.remove(resource);
//        resource.setProduct(null);
//    }
//}

package com.pluggedorchid.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products",
        indexes = {
                @Index(name = "idx_product_category", columnList = "category_id"),
                @Index(name = "idx_product_brand", columnList = "brand"),
                @Index(name = "idx_product_gender", columnList = "gender"),
                @Index(name = "idx_product_price", columnList = "price"),
                @Index(name = "idx_product_slug", columnList = "slug")
        })
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private String brand;

    private String gender;

    private Float rating;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "is_new_arrival", nullable = false)
    private boolean newArrival = false;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @Column(name = "featured_until")
    private Timestamp featuredUntil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_type_id")
    private CategoryType categoryType;

    // Resources – always needed, fetched eagerly with SUBSELECT for efficiency
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    private List<ProductResources> resources = new ArrayList<>();

    // Variants – needed only on detail pages, lazy with batch fetching
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 20)
    private List<ProductVariant> variants = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Helper methods
    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }

    public void addResource(ProductResources resource) {
        resources.add(resource);
        resource.setProduct(this);
    }

    public void removeResource(ProductResources resource) {
        resources.remove(resource);
        resource.setProduct(null);
    }
}