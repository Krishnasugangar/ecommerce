package com.ecommerce.dto.user;

import java.time.Instant;

import com.ecommerce.enums.RoleName;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private RoleName role;
    private boolean enabled;
    private Instant createdAt;
}
