package com.eventmanagementapp.gatewayservice.filter;

import com.eventmanagementapp.gatewayservice.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    Claims claims = jwtUtil.validateToken(token);
                    String email = claims.get("email", String.class);
                    String role = claims.get("role", String.class);
                    String userId = claims.get("userId", String.class);

                    request.setAttribute("X-User-Email", email);
                    request.setAttribute("X-User-Role", role);
                    request.setAttribute("X-User-Id", userId);
                }
            } catch (Exception e) {
                // Token validation failed, continue without setting attributes
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/api/");
    }
}