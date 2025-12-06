package com.bidek.BidEk.servises;

import com.bidek.BidEk.models.Bid;
import com.bidek.BidEk.models.Post;
import com.bidek.BidEk.repositories.PostRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // ------------------- CREATE -------------------
    public Post createPost(Post post, String ownerEmail) {
        post.setOwnerEmail(ownerEmail);
        post.setHighestBid(post.getStartingPrice());
        post.setExpired(post.getDeadline().isBefore(LocalDateTime.now()));
        return postRepository.save(post);
    }

    // ------------------- FETCH -------------------
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        posts.forEach(this::updatePostExpirationStatus);
        return posts;
    }

    public Optional<Post> getPostById(String id) {
        Optional<Post> post = postRepository.findById(id);
        post.ifPresent(this::updatePostExpirationStatus);
        return post;
    }

    public List<Post> getPostsByOwner(String email) {
        List<Post> posts = postRepository.findByOwnerEmail(email);
        posts.forEach(this::updatePostExpirationStatus);
        return posts;
    }

    public List<Post> getPostsWithUserBids(String userEmail) {
        return postRepository.findAll().stream()
                .peek(this::updatePostExpirationStatus)
                .filter(post -> post.getBids().stream()
                        .anyMatch(bid -> userEmail.equals(bid.getBidderEmail())))
                .collect(Collectors.toList());
    }

    // ------------------- BIDDING -------------------
    public Post placeBid(String postId, Bid bid) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        updatePostExpirationStatus(post);
        if (post.isExpired() || post.getDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction has ended. No more bids accepted.");
        }

        if (bid.getAmount() <= post.getHighestBid()) {
            throw new RuntimeException("Bid must be higher than current highest bid");
        }

        post.setHighestBid(bid.getAmount());
        post.setHighestBidderEmail(bid.getBidderEmail());
        post.getBids().add(bid);
        return postRepository.save(post);
    }

    // ------------------- UPDATE -------------------
    public Post updatePost(String postId, Post updatedData, String userEmail) {
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!existingPost.getOwnerEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to edit this post");
        }

        existingPost.setTitle(updatedData.getTitle());
        existingPost.setDescription(updatedData.getDescription());
        existingPost.setStartingPrice(updatedData.getStartingPrice());
        existingPost.setDeadline(updatedData.getDeadline());
        existingPost.setExpired(updatedData.getDeadline().isBefore(LocalDateTime.now()));
        return postRepository.save(existingPost);
    }

    // ------------------- DELETE -------------------
    public void deletePost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getOwnerEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        postRepository.deleteById(postId);
    }

    // ------------------- UTIL -------------------
    private void updatePostExpirationStatus(Post post) {
        boolean shouldBeExpired = post.getDeadline().isBefore(LocalDateTime.now());
        if (shouldBeExpired && !post.isExpired()) {
            post.setExpired(true);
            postRepository.save(post);
        }
    }
}
