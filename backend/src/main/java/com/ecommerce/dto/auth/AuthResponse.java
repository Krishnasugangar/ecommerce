package com.ecommerce.dto.auth;

import com.ecommerce.dto.user.UserResponse;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private long expiresInMs;
    private UserResponse user;
}
