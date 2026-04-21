package com.pluggedorchid.backend.auth.controller;

import com.pluggedorchid.backend.auth.dto.UserDto;
import com.pluggedorchid.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(search, role, pageable));
    }

    @GetMapping("/admin/users/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserService.UserStats> getUserStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }
}