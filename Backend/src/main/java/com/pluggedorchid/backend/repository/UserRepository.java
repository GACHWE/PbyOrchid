package com.pluggedorchid.backend.repository;

import com.pluggedorchid.backend.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT COUNT(u) FROM User u WHERE MONTH(u.createdAt) = MONTH(CURRENT_DATE) AND YEAR(u.createdAt) = YEAR(CURRENT_DATE)")
    long countNewThisMonth();

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastActive > :date")
    long countActiveSince(@Param("date") LocalDateTime date);

    // NEW: paginated search + role filter
    @Query("SELECT u FROM User u WHERE " +
            "(:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:role IS NULL OR u.role = :role)")
    Page<User> findAllWithFilters(@Param("search") String search,
                                  @Param("role") String role,
                                  Pageable pageable);
}