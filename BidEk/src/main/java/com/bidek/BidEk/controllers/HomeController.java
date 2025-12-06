package com.bidek.BidEk.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.bidek.BidEk.servises.JwtService;

@RestController
@RequestMapping("/api")
public class HomeController {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public HomeController(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(401).body("Unauthorized");

        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!jwtService.isTokenValid(token, userDetails)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/info")
    public ResponseEntity<String> info() {
        return ResponseEntity.ok("BidEk backend is running.");
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("jwt".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
