package com.vlf.wma.api.features.auth;

import com.vlf.wma.api.features.auth.exceptions.InvalidCredentialsException;
import com.vlf.wma.api.features.auth.exceptions.InvalidTokenException;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.features.user.exceptions.UserNotFoundException;
import com.vlf.wma.api.util.JWTTokenUtil;
import com.vlf.wma.api.util.Salter;
import com.vlf.wma.api.util.TokenType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JWTTokenUtil jwtTokenUtil;

    @Override
    public AuthResponse requestLogin(AuthRequest req) {
        // 1. Get user from DB.
        UserEntity userToValidate = getUserByEmailOrUsername(req);

        // 2. Validate.
        boolean hasCorrectCredentials =
                Salter.checkPassword(req.getPassword(), userToValidate.getPassword());

        if (!hasCorrectCredentials) {
            throw new InvalidCredentialsException("Incorrect password!");
        }

        // 3. Passed Validation! Create Access and Refresh Tokens.
        String accessToken = jwtTokenUtil.generateToken(userToValidate.getUsername());
        String refreshToken = jwtTokenUtil.generateRefreshToken(userToValidate.getUsername());

        // 4. Return AuthResponse with tokens.
        return new AuthResponse(accessToken, refreshToken, userToValidate.getUserId());
    }

    @Override
    public AuthResponse refreshTokens(String refreshToken) {
        if (!jwtTokenUtil.validateRefreshToken(refreshToken)) {
            throw new InvalidTokenException("Refresh token is expired");
        }

        String username = jwtTokenUtil.extractUsername(refreshToken, TokenType.REFRESH);
        String newAccessToken = jwtTokenUtil.generateToken(username);
        String newRefreshToken = jwtTokenUtil.generateRefreshToken(username);

        Long userId = userRepo.findByUsername(username).get().getUserId();

        return new AuthResponse(newAccessToken, newRefreshToken, userId);
    }

    @Override
    public AuthResponse oauth2Login(String email) {
        String newAccessToken = jwtTokenUtil.generateToken(email);
        String newRefreshToken = jwtTokenUtil.generateRefreshToken(email);

        Long userId = userRepo.findByEmail(email).get().getUserId();

        return new AuthResponse(newAccessToken, newRefreshToken, userId);
    }

    /**
     * Private helper for finding User Entity via Email or Username.
     * If username or email not found, throws exception that is caught by GlobalExceptionHandler.
     * @param req
     * @return
     */
    private UserEntity getUserByEmailOrUsername(AuthRequest req) {
        String username = req.getUsername();
        String email = req.getEmail();
        if (username!= null) {
            return userRepo.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        } else if (email != null) {
            return userRepo.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        }
        throw new IllegalArgumentException("Username or email must be provided");
    }
}
