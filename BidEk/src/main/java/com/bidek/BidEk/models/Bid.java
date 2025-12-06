package com.bidek.BidEk.models;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bid {
    private String bidderEmail;
    private double amount;
    private LocalDateTime bidTime;
}