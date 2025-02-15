package com.vlf.wma.api.features.auth.passwordResetRequest;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.features.user.exceptions.UserNotFoundException;
import com.vlf.wma.api.util.ExpirationDateGenerator;
import com.vlf.wma.api.util.Salter;
import com.vlf.wma.api.util.SecureTokenGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResetPasswordServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ResetPasswordRepository requestRepository;

    @InjectMocks
    private ResetPasswordService resetPasswordService;

    @BeforeEach
    public void setup() {
        // Setup code, if necessary
    }

    @Test
    public void testSaveResetRequest_EmailIsNull() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail(null);

        // Act
        ResetPasswordRequest result = resetPasswordService.saveResetRequest(request);

        // Assert
        assertNull(result);
    }

    @Test
    public void testSaveResetRequest_UserNotFound() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> resetPasswordService.saveResetRequest(request));
    }

    @Test
    public void testSaveResetRequest_Success() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new UserEntity()));
        when(requestRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(requestRepository.save(any(ResetPasswordRequest.class))).thenReturn(request);

        // Mocking the static methods
        try (MockedStatic<SecureTokenGenerator> tokenMock = mockStatic(SecureTokenGenerator.class);
             MockedStatic<Salter> salterMock = mockStatic(Salter.class);
             MockedStatic<ExpirationDateGenerator> expMock = mockStatic(ExpirationDateGenerator.class)) {

            tokenMock.when(SecureTokenGenerator::generateToken).thenReturn("token");
            salterMock.when(() -> Salter.hashPassword("token")).thenReturn("hashedToken");
            expMock.when(ExpirationDateGenerator::generateExpirationDate).thenReturn(LocalDateTime.now().plusDays(1));

            // Act
            ResetPasswordRequest result = resetPasswordService.saveResetRequest(request);

            // Assert
            assertNotNull(result);
            assertEquals("token", result.getToken());
        }
    }

    @Test
    public void testVerifyToken_TokenInvalid() {
        // Arrange
        String email = "test@example.com";
        String token = "token";

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail(email);
        request.setToken("hashedToken");
        request.setExpirationDate(LocalDateTime.now().plusDays(1));

        when(requestRepository.findByEmail(email)).thenReturn(Optional.of(request));

        // Mocking the static method
        try (MockedStatic<Salter> salterMock = mockStatic(Salter.class)) {
            salterMock.when(() -> Salter.checkPassword(token, "hashedToken")).thenReturn(false);

            // Act
            boolean result = resetPasswordService.verifyToken(token, email);

            // Assert
            assertFalse(result);
        }
    }

    @Test
    public void testVerifyToken_TokenValid() {
        // Arrange
        String email = "test@example.com";
        String token = "token";

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail(email);
        request.setToken("hashedToken");
        request.setExpirationDate(LocalDateTime.now().plusDays(1));

        when(requestRepository.findByEmail(email)).thenReturn(Optional.of(request));

        // Mocking the static method
        try (MockedStatic<Salter> salterMock = mockStatic(Salter.class)) {
            salterMock.when(() -> Salter.checkPassword(token, "hashedToken")).thenReturn(true);

            // Act
            boolean result = resetPasswordService.verifyToken(token, email);

            // Assert
            assertTrue(result);
        }
    }

    @Test
    public void testVerifyToken_TokenExpired() {
        // Arrange
        String email = "test@example.com";
        String token = "token";

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail(email);
        request.setToken("hashedToken");
        request.setExpirationDate(LocalDateTime.now().minusDays(1));

        when(requestRepository.findByEmail(email)).thenReturn(Optional.of(request));

        // Mocking the static method
        try (MockedStatic<Salter> salterMock = mockStatic(Salter.class)) {
            salterMock.when(() -> Salter.checkPassword(token, "hashedToken")).thenReturn(true);

            // Act
            boolean result = resetPasswordService.verifyToken(token, email);

            // Assert
            assertFalse(result);
        }
    }

    @Test
    public void testUpdateUserPasswordByEmail_UserNotFound() {
        // Arrange
        String email = "test@example.com";
        String plainPassword = "newPassword";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> resetPasswordService.updateUserPassword(email, plainPassword));
    }

    @Test
    public void testUpdateUserPasswordByEmail_Success() {
        // Arrange
        String email = "test@example.com";
        String plainPassword = "newPassword";
        UserEntity user = new UserEntity();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);

        try (MockedStatic<Salter> salterMock = mockStatic(Salter.class)) {
            salterMock.when(() -> Salter.hashPassword(plainPassword)).thenReturn("hashedPassword");

            // Act
            UserEntity updatedUser = resetPasswordService.updateUserPassword(email, plainPassword);

            // Assert
            assertNotNull(updatedUser);
            assertEquals("hashedPassword", updatedUser.getPassword());
            verify(userRepository).save(user);
        }
    }

    @Test
    public void testUpdateUserPasswordById_UserNotFound() {
        // Arrange
        Long userId = 1L;
        String plainPassword = "newPassword";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> resetPasswordService.updateUserPassword(userId, plainPassword));
    }

    @Test
    public void testUpdateUserPasswordById_Success() {
        // Arrange
        Long userId = 1L;
        String plainPassword = "newPassword";
        UserEntity user = new UserEntity();
        user.setUserId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);

        try (MockedStatic<Salter> salterMock = mockStatic(Salter.class)) {
            salterMock.when(() -> Salter.hashPassword(plainPassword)).thenReturn("hashedPassword");

            // Act
            UserEntity updatedUser = resetPasswordService.updateUserPassword(userId, plainPassword);

            // Assert
            assertNotNull(updatedUser);
            assertEquals("hashedPassword", updatedUser.getPassword());
            verify(userRepository).save(user);
        }
    }
}
