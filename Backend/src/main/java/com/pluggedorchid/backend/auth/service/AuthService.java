package com.pluggedorchid.backend.auth.service;

import com.pluggedorchid.backend.auth.dto.JwtResponse;
import com.pluggedorchid.backend.auth.dto.LoginRequest;
import com.pluggedorchid.backend.auth.dto.RefreshTokenRequest;
import com.pluggedorchid.backend.auth.dto.RegisterRequest;
import com.pluggedorchid.backend.entity.Role;
import com.pluggedorchid.backend.auth.entity.User;
import com.pluggedorchid.backend.exception.BadRequestException;
import com.pluggedorchid.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;  // ✅ import uncommented
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByPhoneNumber(request.phoneNumber())) {
            throw new BadRequestException("Phone number already registered");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setRole(Role.USER);
        userRepository.save(user);

        return login(new LoginRequest(request.email(), request.password()));
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Assume User implements UserDetails
        User user = (User) authentication.getPrincipal();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new JwtResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getFirstName(),
                user.getEmail(),
                user.getRole().name(),          // role as string, e.g. "USER"
                user.getPhoneNumber()            // ✅ added phoneNumber
        );
    }

    public JwtResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtService.isRefreshTokenValid(request.refreshToken())) {
            throw new BadRequestException("Invalid refresh token");
        }

        String email = jwtService.extractUsername(request.refreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(user);

        return new JwtResponse(
                newAccessToken,
                request.refreshToken(),
                "Bearer",
                user.getId(),
                user.getFirstName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhoneNumber()            // ✅ added phoneNumber
        );
    }
}