package com.vlf.wma.api.features.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthRequest {
    /**
     * Either Username or Email should be null as only one field can possibly be filled.
     */
    private String username;
    private String email;
    private String password;
}
