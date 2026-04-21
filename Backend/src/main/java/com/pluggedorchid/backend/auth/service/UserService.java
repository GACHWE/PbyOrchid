package com.pluggedorchid.backend.auth.service;

import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.auth.dto.UserDto;
import com.pluggedorchid.backend.auth.mapper.UserMapper;
import com.pluggedorchid.backend.repository.OrderRepository;
import com.pluggedorchid.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final UserMapper userMapper;

    /**
     * Get paginated list of users (admin only)
     */
    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(String search, String role, Pageable pageable) {
        Page<User> users;
        if (search != null || role != null) {
            users = userRepository.findAllWithFilters(search, role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(user -> {
            UserDto dto = userMapper.toDto(user);
            // Add order count and total spent (optional)
            var orders = orderRepository.findByUserId(user.getId(), Pageable.unpaged());
            dto.setOrderCount((int) orders.getTotalElements());
            dto.setTotalSpent(orders.getContent().stream()
                    .map(order -> order.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
            return dto;
        });
    }

    /**
     * Get user statistics for admin dashboard
     */
    @Transactional(readOnly = true)
    public UserStats getUserStats() {
        long totalUsers = userRepository.count();
        long newThisMonth = userRepository.countNewThisMonth();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeUsers = userRepository.countActiveSince(thirtyDaysAgo);
        long inactiveUsers = totalUsers - activeUsers;
        double churnRate = totalUsers == 0 ? 0 : (inactiveUsers * 100.0 / totalUsers);
        churnRate = Math.round(churnRate * 10) / 10.0;
        return new UserStats(totalUsers, newThisMonth, activeUsers, churnRate);
    }

    public record UserStats(long totalUsers, long newThisMonth, long activeUsers, double churnRate) {}
}