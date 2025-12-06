package com.bidek.BidEk.repositories;

import com.bidek.BidEk.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByOwnerEmail(String email);
    
}
