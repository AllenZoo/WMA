package com.vlf.wma.api.features.user.signUpRequest;

import com.vlf.wma.api.config.TestSecurityConfig;
import com.vlf.wma.api.features.user.UserEntity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.NoSuchElementException;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Import(TestSecurityConfig.class)
public class SignUpRequestRepositoryTest {

    @Autowired
    private SignUpRequestRepository requestRepository;

    private static SignUpRequest REQUEST1 = SignUpRequest.builder()
            .email("123@gmail.com")
            .code("V47lk")
            .expirationDate(LocalDateTime.parse("2024-07-23T14:30:45"))
            .username("jesus")
            .password("christ")
            .build();

    private static SignUpRequest REQUEST2 = SignUpRequest.builder()
            .email("123@gmail.com")
            .code("Hdya8a")
            .expirationDate(LocalDateTime.parse("2024-07-23T15:00:45"))
            .username("jesus8")
            .password("christmas")
            .build();

    @BeforeEach
    public void setUp() {
        requestRepository.deleteAll();
        requestRepository.save(REQUEST1);
    }

    @Test
    public void SignUpRequestRepository_FindByEmail_ReturnRequest() {
        SignUpRequest request1 = requestRepository.findByEmail(REQUEST1.getEmail()).get();
        Assertions.assertNotNull(request1);
        Assertions.assertEquals(REQUEST1.getEmail(), request1.getEmail());
    }

    @Test
    public void SignUpRequestRepository_FindByEmail_ReturnNull() {
        try {
            SignUpRequest requestNull = requestRepository.findByEmail("email_THAT_DOESNT_EXISTS").get();
            Assertions.fail();
        } catch (NoSuchElementException e) {

        }
    }

    @Test
    public void SignUpRequestRepository_UpdateByEmail_ReturnVoid_CheckRequest() {
        requestRepository.deleteAll();
        SignUpRequest request1 = requestRepository.save(REQUEST1);

        requestRepository.updateSignUpRequestByEmail(REQUEST1.getEmail(), REQUEST2);

        // Find the updated query to verify the changes
        SignUpRequest updatedRequest = requestRepository.findById(request1.getId()).get();

        Assertions.assertEquals(REQUEST2.getEmail(), updatedRequest.getEmail());
        Assertions.assertEquals(REQUEST2.getCode(), updatedRequest.getCode());
        Assertions.assertEquals(REQUEST2.getExpirationDate(), updatedRequest.getExpirationDate());
        Assertions.assertEquals(REQUEST2.getUsername(), updatedRequest.getUsername());
        Assertions.assertEquals(REQUEST2.getPassword(), updatedRequest.getPassword());
    }

    /**
     * Test for attempt to update by email where the email doesn't exist in the DB yet.
     * Expected behaviour should be for the DB to do nothing.
     */
    @Test
    public void SignUpRequestRepository_UpdateByNonExistingEmail_ReturnVoid_CheckRequest() {
        requestRepository.deleteAll();
        requestRepository.updateSignUpRequestByEmail("verynotcool@email.com", REQUEST2);

        try {
            SignUpRequest request = requestRepository.findByEmail(REQUEST2.getEmail()).get();
            Assertions.fail();
        } catch (NoSuchElementException e) {

        }
    }

}
