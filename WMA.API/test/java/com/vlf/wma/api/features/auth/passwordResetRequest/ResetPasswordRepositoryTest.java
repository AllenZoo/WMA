package com.vlf.wma.api.features.auth.passwordResetRequest;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cglib.core.Local;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ResetPasswordRepositoryTest {

    @Autowired
    private ResetPasswordRepository resetPasswordRepository;

    @BeforeEach
    public void setUp() {
        // clear previous adds
        resetPasswordRepository.deleteAll();
    }

    @Test
    public void testFindByEmail() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("test@example.com");
        request.setToken("testToken");
        request.setExpirationDate(LocalDateTime.now().plusDays(1));
        resetPasswordRepository.save(request);

        // Act
        Optional<ResetPasswordRequest> foundRequest = resetPasswordRepository.findByEmail("test@example.com");

        // Assert
        assertTrue(foundRequest.isPresent());
        assertEquals("test@example.com", foundRequest.get().getEmail());
        assertEquals("testToken", foundRequest.get().getToken());
    }

    @Test
    public void testUpdateSignUpRequestByEmail() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("test@example.com");
        request.setToken("oldToken");
        request.setExpirationDate(LocalDateTime.now().plusDays(1));
        resetPasswordRepository.save(request);

        ResetPasswordRequest updatedRequest = new ResetPasswordRequest();
        updatedRequest.setToken("newToken");

        LocalDateTime updatedTime = LocalDateTime.of(2024, 8, 6, 4, 4);
        updatedRequest.setExpirationDate(updatedTime);

        // Act
        resetPasswordRepository.updateSignUpRequestByEmail("test@example.com", updatedRequest);
        Optional<ResetPasswordRequest> foundRequest = resetPasswordRepository.findByEmail("test@example.com");

        // Assert
        assertTrue(foundRequest.isPresent());
        assertEquals("newToken", foundRequest.get().getToken());
        assertEquals(updatedRequest.getExpirationDate(), foundRequest.get().getExpirationDate());
    }
}