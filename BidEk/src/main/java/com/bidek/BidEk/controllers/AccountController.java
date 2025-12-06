package com.bidek.BidEk.controllers;

import com.bidek.BidEk.servises.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final JwtService jwtService;

    public AccountController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getAccountInfo(HttpServletRequest request) {
        String token = extractTokenFromCookies(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String email = jwtService.extractUsername(token);
            return ResponseEntity.ok(Map.of("email", email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("jwt".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
