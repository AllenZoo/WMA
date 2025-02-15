package com.vlf.wma.api.features.auth;

import com.vlf.wma.api.features.auth.exceptions.InvalidCredentialsException;
import com.vlf.wma.api.features.auth.exceptions.InvalidTokenException;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.util.JWTTokenUtil;
import com.vlf.wma.api.util.Salter;
import com.vlf.wma.api.util.TokenType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private JWTTokenUtil jwtTokenUtil;

    @Mock
    private UserRepository userRepo;

    private static final AuthRequest AUTH_REQUEST_VALID = AuthRequest.builder()
            .email("bob123@gmail.com")
            .password("plain_password")
            .build();

    private static final AuthRequest AUTH_REQUEST_INVALID = AuthRequest.builder()
            .email("bob123@gmail.com")
            .password("wrong_password")
            .build();

    // Relevant User from DB with salted and hashed password.
    private static final UserEntity USER = UserEntity.builder()
            .userId(1L)
            .username("bob")
            .email("bob123@gmail.com")
            .password(Salter.hashPassword("plain_password"))
            .build();

    @Test
    public void AuthService_RequestLogin_ReturnsAuthResponse() {
        when(userRepo.findByEmail(AUTH_REQUEST_VALID.getEmail())).thenReturn(Optional.of(USER));
        when(jwtTokenUtil.generateToken(USER.getUsername())).thenReturn("access_token");
        when(jwtTokenUtil.generateRefreshToken(USER.getUsername())).thenReturn("refresh_token");

        AuthResponse response = authService.requestLogin(AUTH_REQUEST_VALID);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("access_token", response.getAccessToken());
        Assertions.assertEquals("refresh_token", response.getRefreshToken());
    }

    @Test
    public void AuthService_RequestLogin_ThrowsInvalidCredentialsException() {
        when(userRepo.findByEmail(AUTH_REQUEST_INVALID.getEmail())).thenReturn(Optional.of(USER));

        Assertions.assertThrows(InvalidCredentialsException.class, () -> {
            authService.requestLogin(AUTH_REQUEST_INVALID);
        });
    }

    @Test
    public void AuthService_RefreshToken_ReturnsAuthResponse() {
        String refreshToken = "valid_refresh_token";
        when(jwtTokenUtil.validateRefreshToken(refreshToken)).thenReturn(true);
        when(jwtTokenUtil.extractUsername(refreshToken, TokenType.REFRESH)).thenReturn(USER.getUsername());
        when(jwtTokenUtil.generateToken(USER.getUsername())).thenReturn("new_access_token");
        when(jwtTokenUtil.generateRefreshToken(USER.getUsername())).thenReturn("new_refresh_token");

        AuthResponse response = authService.refreshTokens(refreshToken);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("new_access_token", response.getAccessToken());
        Assertions.assertEquals("new_refresh_token", response.getRefreshToken());
    }

    @Test
    public void AuthService_RefreshToken_ThrowsInvalidTokenException() {
        String invalidRefreshToken = "invalid_refresh_token";
        when(jwtTokenUtil.validateRefreshToken(invalidRefreshToken)).thenReturn(false);

        Assertions.assertThrows(InvalidTokenException.class, () -> {
            authService.refreshTokens(invalidRefreshToken);
        });
    }
}
