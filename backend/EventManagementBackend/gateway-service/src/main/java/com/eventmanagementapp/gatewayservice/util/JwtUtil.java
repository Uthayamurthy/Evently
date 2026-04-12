package com.eventmanagementapp.gatewayservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET = "evently-secret-key-for-jwt-signing-minimum-256-bits-required";
    private static final long EXPIRATION_TIME = 86400000;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email, String role, String userId) {
        return Jwts.builder()
            .claims(Map.of(
                "email", email,
                "role", role,
                "userId", userId
            ))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(getSigningKey())
            .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (Exception e) {
            return null;
        }
    }

    public String getEmailFromToken(String token) {
        Claims claims = validateToken(token);
        return claims != null ? claims.get("email", String.class) : null;
    }

    public String getRoleFromToken(String token) {
        Claims claims = validateToken(token);
        return claims != null ? claims.get("role", String.class) : null;
    }

    public String getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims != null ? claims.get("userId", String.class) : null;
    }

    public boolean isTokenValid(String token) {
        return validateToken(token) != null;
    }
}