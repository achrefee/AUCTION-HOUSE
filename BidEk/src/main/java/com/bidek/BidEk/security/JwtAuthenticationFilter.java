package com.bidek.BidEk.security;

import com.bidek.BidEk.servises.JwtService;
import com.bidek.BidEk.servises.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userDetailsService = userService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {

        String jwt = null;
        String userEmail = null;

        // 1. Check Authorization header
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // 2. Check JWT in cookies (cookie name should match what AuthController sets)
        if (jwt == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {  // 🔁 corrected from "token"
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        // 3. Validate token and set authentication
        if (jwt != null) {
            try {
                userEmail = jwtService.extractUsername(jwt);
                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (ExpiredJwtException e) {
                System.out.println("⚠️ JWT token expired: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("❌ JWT error: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}
