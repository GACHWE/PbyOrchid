package com.pluggedorchid.backend.auth.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component  // or @Configuration – but @Component is fine for a simple holder
public class JwtConfig {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;   // 15 minutes

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;  // 7 days
}