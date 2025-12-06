package com.bidek.BidEk.controllers;

import com.bidek.BidEk.models.User;
import com.bidek.BidEk.servises.JwtService;
import com.bidek.BidEk.servises.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    public UserController(UserService userService, JwtService jwtService, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(HttpServletRequest request) {
        if (!isAuthenticated(request)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id, HttpServletRequest request) {
        if (!isAuthenticated(request)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id, HttpServletRequest request) {
        if (!isAuthenticated(request)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAuthenticated(HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return false;
    
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    
        return jwtService.isTokenValid(token, userDetails);
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
