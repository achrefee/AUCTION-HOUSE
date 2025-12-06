package com.bidek.BidEk.controllers;

import com.bidek.BidEk.models.Bid;
import com.bidek.BidEk.models.Post;
import com.bidek.BidEk.servises.JwtService;
import com.bidek.BidEk.servises.PostService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final JwtService jwtService;

    public PostController(PostService postService, JwtService jwtService) {
        this.postService = postService;
        this.jwtService = jwtService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Post> createPost(
            HttpServletRequest request,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startingPrice") Double startingPrice,
            @RequestParam("deadline") String deadlineStr,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String ownerEmail = jwtService.extractUsername(token);
        String imageUrl = null;

        try {
            LocalDateTime deadline = parseDeadline(deadlineStr);

            if (image != null && !image.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path imagePath = Paths.get("uploads", filename);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());
                imageUrl = "/uploads/" + filename;
            }

            Post post = new Post();
            post.setTitle(title);
            post.setDescription(description);
            post.setStartingPrice(startingPrice);
            post.setHighestBid(startingPrice);
            post.setDeadline(deadline);
            post.setImageUrl(imageUrl);

            return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(post, ownerEmail));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost, HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = jwtService.extractUsername(token);

        try {
            return ResponseEntity.ok(postService.updatePost(id, updatedPost, email));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = jwtService.extractUsername(token);
        try {
            postService.deletePost(id, email);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Post>> getMyPosts(HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = jwtService.extractUsername(token);
        return ResponseEntity.ok(postService.getPostsByOwner(email));
    }

    @GetMapping("/my-bids")
    public ResponseEntity<List<Post>> getMyBids(HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = jwtService.extractUsername(token);
        return ResponseEntity.ok(postService.getPostsWithUserBids(email));
    }

    @PostMapping("/{id}/bid")
    public ResponseEntity<Post> placeBid(@PathVariable String id, @RequestBody Bid bid, HttpServletRequest request) {
        String token = extractTokenFromCookie(request);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            String bidderEmail = jwtService.extractUsername(token);
            bid.setBidderEmail(bidderEmail);
            Post updatedPost = postService.placeBid(id, bid);
            return ResponseEntity.ok(updatedPost);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
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

    private LocalDateTime parseDeadline(String deadlineStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return LocalDateTime.parse(deadlineStr, formatter);
    }
}
