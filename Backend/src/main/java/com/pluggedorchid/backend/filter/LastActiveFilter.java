package com.pluggedorchid.backend.filter;

import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class LastActiveFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            LocalDateTime now = LocalDateTime.now();
            // Update only once per minute to reduce DB writes
            if (user.getLastActive() == null || user.getLastActive().isBefore(now.minusMinutes(1))) {
                user.setLastActive(now);
                userRepository.save(user);
            }
        }
        chain.doFilter(request, response);
    }
}