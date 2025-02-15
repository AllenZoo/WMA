package com.vlf.wma.api.features.auth;

import com.vlf.wma.api.features.user.UserEntity;

public interface IAuthService {

    AuthResponse requestLogin(AuthRequest req);

    AuthResponse refreshTokens(String refreshToken);

    AuthResponse oauth2Login(String email);
}
