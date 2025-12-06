package com.bidek.BidEk.models;

import java.util.Collection;
import java.util.Collections;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
@Document(collection = "users")

public class User implements UserDetails {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private Role role;

    public String getId() {
      return this.id;
    }
    public void setId(String value) {
      this.id = value;
    }

    
    public void setUsername(String value) {
      this.username = value;
    }

    public String getname() {
      return username;
  }
    
    public void setPassword(String value) {
      this.password = value;
    }

    public String getEmail() {
      return this.email;
    }
    public void setEmail(String value) {
      this.email = value;
    }

    public Role getRole() {
      return this.role;
    }
    public void setRole(Role value) {
      this.role = value;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // Modify to return roles if needed
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}