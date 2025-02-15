package com.vlf.wma.api.features.user.signUpRequest;


import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.features.user.UserService;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailExistsException;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailFromOauthLoginExistsException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class SignUpRequestServiceTest {

    @Mock
    private SignUpRequestRepository requestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SignUpService signUpService;

    @Test
    public void SignUpService_ProcessRequestExistingUser_ThrowsUserWithEmailExistsException() {
        SignUpRequest request =SignUpRequest.builder()
                .email("existing@example.com")
                .password("2j0athaoay565a")
                .build();
        UserEntity existingUser = UserEntity.builder()
                .initializedViaEmailPass(true)
                .build();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

        assertThrows(UserWithEmailExistsException.class, () -> signUpService.processSignUpRequest(request));
    }

    @Test
    public void SignUpService_ProcessRequestExistingUser_ThrowsUserWithEmailFromOauthLoginExistsException() {
        SignUpRequest request =SignUpRequest.builder()
                .email("existing@example.com")
                .password("2j0athaoay565a")
                .build();
        UserEntity existingUser = UserEntity.builder()
                .initializedViaEmailPass(false)
                .build();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

        assertThrows(UserWithEmailFromOauthLoginExistsException.class, () -> signUpService.processSignUpRequest(request));
    }

    @Test
    public void SignupService_ProcessRequestWithExistingEmailRequest_UpdatesRequest() {
        SignUpRequest request = SignUpRequest.builder()
                .email("existing@example.com")
                .password("2j0athaoay565a")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));

        signUpService.processSignUpRequest(request);

        verify(requestRepository, times(1)).updateSignUpRequestByEmail(eq(request.getEmail()), any(SignUpRequest.class));
        verify(requestRepository, times(0)).save(any(SignUpRequest.class));
    }

    @Test
    public void SignUpService_ProcessNewRequest_AddsRequest() {
        SignUpRequest request = SignUpRequest.builder()
                .email("new@example.com")
                .password("2j0athaoay565a")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        signUpService.processSignUpRequest(request);

        verify(requestRepository, times(0)).updateSignUpRequestByEmail(eq(request.getEmail()), any(SignUpRequest.class));
        verify(requestRepository, times(1)).save(any(SignUpRequest.class));
    }

    @Test
    public void SignUpService_VerifySignUpRequestValid_Success() {
        SignUpRequest request = SignUpRequest.builder()
                .email("verify@example.com")
                .code("123456")
                .expirationDate(LocalDateTime.now().plusDays(1))
                .build();

        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));

        boolean result = signUpService.verifySignUpRequest(request.getEmail(), "123456");

        Assertions.assertTrue(result);
    }

    @Test
    public void SignUpService_VerifySignUpRequestInvalidExpirationDate_Failure() {
        SignUpRequest request = SignUpRequest.builder()
                .email("verify@example.com")
                .code("123456")
                .expirationDate(LocalDateTime.now().minusDays(1))
                .build();

        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));

        boolean result = signUpService.verifySignUpRequest(request.getEmail(), "123456");

        Assertions.assertFalse(result);
    }

    @Test
    public void SignUpService_VerifySignUpRequest_InvalidCode() {
        SignUpRequest request = SignUpRequest.builder()
                .email("verify@example.com")
                .code("123456")
                .expirationDate(LocalDateTime.now().plusDays(1))
                .build();

        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));

        boolean result = signUpService.verifySignUpRequest(request.getEmail(), "654321");

        Assertions.assertFalse(result);
    }

    @Test
    public void SignUpService_GetRequestByEmail_Success() {
        SignUpRequest request = SignUpRequest.builder()
                .email("get@example.com")
                .build();

        when(requestRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));

        SignUpRequest result = signUpService.getRequestByEmail(request.getEmail());

        Assertions.assertNotNull(result);
        Assertions.assertEquals(request.getEmail(), result.getEmail());
    }

    @Test
    public void SignUpService_GetRequestByEmail_NotFound() {
        when(requestRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        SignUpRequest result = signUpService.getRequestByEmail("notfound@example.com");

        Assertions.assertNull(result);
    }
}
