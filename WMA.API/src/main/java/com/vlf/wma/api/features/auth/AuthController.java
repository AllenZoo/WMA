package com.vlf.wma.api.features.auth;

import com.vlf.wma.api.features.auth.passwordResetRequest.PasswordDto;
import com.vlf.wma.api.features.auth.passwordResetRequest.ResetPasswordRequest;
import com.vlf.wma.api.features.auth.passwordResetRequest.ResetPasswordService;
import com.vlf.wma.api.features.user.IUserService;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.signUpRequest.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @Autowired
    private ResetPasswordService resetPasswordService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody AuthRequest authRequest) {
        AuthResponse res = authService.requestLogin(authRequest);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshTokens(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        AuthResponse res = authService.refreshTokens(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/oauth2")
    public ResponseEntity<?> oauthLogin(@AuthenticationPrincipal OAuth2User principal) {
        String userEmail = principal.getAttribute("email");
        AuthResponse res = authService.oauth2Login(userEmail);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/resetPasswordRequest")
    public ResponseEntity<?> resetPasswordRequest(@RequestBody ResetPasswordRequest request) {
        ResetPasswordRequest savedRequest = resetPasswordService.saveResetRequest(request);
        if (savedRequest == null) {
            return ResponseEntity.badRequest().body("Invalid Reset Password Request.");
        }

        String emailBody = String.format(
                "Hi,\n\n" +
                        "We received a request to reset the password associated with this email address. If you made this request, please click the link below to reset your password. If you did not make this request, you can ignore this email.\n\n" +
                        "Reset your password: %s\n\n" +
                        "Please note that this link will expire in 30 minutes. If you need a new link, you can " +
                        "request" +
                        " another password reset.\n\n" +
                        "Thank you,\n" +
                        "Your Company Team",
                "https:somesupercoolresetlinkpagefromwma");
        emailService.sendSimpleEmail(request.getEmail(), "Reset Password Request!", emailBody);
        return ResponseEntity.ok(savedRequest);
    }

    @PatchMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody PasswordDto passwordDto) {
        if (!passwordDto.isValid()) {
            return ResponseEntity.badRequest().body("Invalid Reset Password Request. Missing email or new password!");
        }

        if (!resetPasswordService.verifyToken(token, passwordDto.getEmail())) {
            // Invalid password request token.
            return ResponseEntity.badRequest().body("Invalid Password Reset Request Token! Token is either expired or" +
                    " invalid.");
        }

        // Token is valid, update user with new password
        UserEntity updatedUser = resetPasswordService.updateUserPassword(passwordDto.getEmail(),
                passwordDto.getNewPassword());

        return ResponseEntity.ok(updatedUser);
    }
}
