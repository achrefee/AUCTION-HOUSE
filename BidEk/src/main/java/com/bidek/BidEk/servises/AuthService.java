package com.bidek.BidEk.servises;



import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bidek.BidEk.models.Role;
import com.bidek.BidEk.models.User;
import com.bidek.BidEk.repositories.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public User register(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Email and Password must not be null");
        }
    
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already in use");
        }
    
        // Encode password
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
    
        // Ensure role is set
        if (user.getRole() == null) {
            user.setRole(Role.USER); // Default role
        }
    
        // Save user
        return userRepository.save(user);
    }
    

    public String login(User user) {
    User existingUser = userRepository.findByEmail(user.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    
    if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
    );

    return jwtService.generateToken(existingUser);
}

}