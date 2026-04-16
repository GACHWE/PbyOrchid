package com.pluggedorchid.backend.auth.service;

import com.pluggedorchid.backend.auth.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtConfig jwtConfig;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    // ==================== Claim Extraction ====================

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            log.warn("Invalid token format or signature while checking expiration");
            return true;   // Treat invalid tokens as expired
        }
    }

    // ==================== Token Validation ====================

    /**
     * Validates the token's signature and expiration only.
     * Does NOT check against a UserDetails object.
     * Useful for initial filtering before loading the user.
     */
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);          // throws exception if signature invalid
            return !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Token expired: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("Invalid JWT signature or structure: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("Unexpected token validation error: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Validates the token against a specific UserDetails.
     * Checks username match and expiration.
     */
    public boolean isTokenValidForUser(String token, UserDetails userDetails) {
        if (userDetails == null) {
            log.warn("Cannot validate token – userDetails is null");
            return false;
        }
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token validation for user failed: {}", e.getMessage());
            return false;
        }
    }

    public Boolean isRefreshTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Refresh token validation failed");
            return false;
        }
    }

    // ==================== Token Generation ====================

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (!userDetails.getAuthorities().isEmpty()) {
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            claims.put("role", role);
        }
        return createToken(claims, userDetails.getUsername(), jwtConfig.getAccessExpiration());
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return createToken(new HashMap<>(), userDetails.getUsername(), jwtConfig.getRefreshExpiration());
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationMs) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    // ==================== Helper ====================

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
}