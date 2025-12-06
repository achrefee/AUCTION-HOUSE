package com.bidek.BidEk.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String title;
    private String description;
    private double startingPrice;
    private double highestBid;
    private String highestBidderEmail;
    private LocalDateTime deadline;
    private String ownerEmail;
    private String imageUrl;
    private boolean expired = false;
    private List<Bid> bids = new ArrayList<>();
}
