package com.bidek.BidEk.controllers;

import com.bidek.BidEk.models.User;
import com.bidek.BidEk.servises.AuthService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        String token = authService.login(user);

        // Créer un cookie HttpOnly contenant le JWT
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 jours
                .sameSite("Lax")
                .secure(false) // mettre true si tu es en HTTPS
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Supprimer le cookie en le remplaçant avec un cookie vide expiré
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}
