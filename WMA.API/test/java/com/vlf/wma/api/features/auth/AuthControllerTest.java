package com.vlf.wma.api.features.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vlf.wma.api.config.TestSecurityConfig;
import com.vlf.wma.api.features.auth.passwordResetRequest.PasswordDto;
import com.vlf.wma.api.features.auth.passwordResetRequest.ResetPasswordRequest;
import com.vlf.wma.api.features.auth.passwordResetRequest.ResetPasswordService;
import com.vlf.wma.api.features.user.IUserService;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.signUpRequest.EmailService;
import com.vlf.wma.api.util.JWTTokenUtil;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@WebMvcTest(AuthController.class)
@ExtendWith({ SpringExtension.class, MockitoExtension.class })
@Import(TestSecurityConfig.class)
public class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private IAuthService authService;

        @MockBean
        private IUserService userService;

        @MockBean
        private ResetPasswordService resetPasswordService;

        @MockBean
        private EmailService emailService;

        @MockBean
        private JWTTokenUtil jwtTokenUtil;

        @Autowired
        private ObjectMapper objectMapper;

        private static final AuthRequest AUTH_REQUEST = AuthRequest.builder()
                        .email("bob123@gmail.com")
                        .password("plain_password")
                        .build();

        private static final RefreshTokenRequest REFRESH_TOKEN_REQUEST = RefreshTokenRequest.builder()
                        .refreshToken("valid_refresh_token")
                        .build();

        private static final AuthResponse AUTH_RESPONSE = new AuthResponse("access_token", "refresh_token", 1L);

        @BeforeEach
        void setUp() {
                // Any setup needed before each test
        }

        @Test
        public void AuthController_LoginUser_ReturnsAuthResponse() throws Exception {
                when(authService.requestLogin(any(AuthRequest.class))).thenReturn(AUTH_RESPONSE);

                ResultActions response = mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(AUTH_REQUEST)));

                response.andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken", CoreMatchers.is("access_token")))
                                .andExpect(jsonPath("$.refreshToken", CoreMatchers.is("refresh_token")));
        }

        @Test
        public void AuthController_RefreshTokens_ReturnsAuthResponse() throws Exception {
                when(authService.refreshTokens(any(String.class))).thenReturn(AUTH_RESPONSE);

                ResultActions response = mockMvc.perform(post("/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(REFRESH_TOKEN_REQUEST)));

                response.andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken", CoreMatchers.is("access_token")))
                                .andExpect(jsonPath("$.refreshToken", CoreMatchers.is("refresh_token")));
        }

        @Test
        @WithMockUser
        public void AuthController_OAuth2Login_ReturnsAuthResponse() throws Exception {
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                Map<String, Object> attributes = new HashMap<>();
                String userEmail = "bob123@gmail.com";
                attributes.put("name", "bobby");
                attributes.put("email", userEmail);
                OAuth2User user = new DefaultOAuth2User(authorities, attributes, "name");

                when(authService.oauth2Login(userEmail)).thenReturn(AUTH_RESPONSE);

                AuthResponse test = authService.oauth2Login(userEmail);

                ResultActions response = mockMvc.perform(post("/auth/oauth2")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(
                                                new TestingAuthenticationToken(user, null, authorities)))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(user)));

                response.andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken", CoreMatchers.is("access_token")))
                                .andExpect(jsonPath("$.refreshToken", CoreMatchers.is("refresh_token")));
        }

        @Test
        public void AuthController_ResetPasswordRequest_Success() throws Exception {
                // Arrange
                ResetPasswordRequest request = new ResetPasswordRequest();
                request.setEmail("test@example.com");

                when(resetPasswordService.saveResetRequest(any(ResetPasswordRequest.class)))
                        .thenReturn(request);

                // Act & Assert
                mockMvc.perform(post("/auth/resetPasswordRequest")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.email").value("test@example.com"));

                verify(emailService, times(1)).sendSimpleEmail(eq("test@example.com"), eq("Reset Password Request!"), anyString());
        }

        @Test
        public void AuthController_ResetPasswordRequest_InvalidRequest() throws Exception {
                // Arrange
                when(resetPasswordService.saveResetRequest(any(ResetPasswordRequest.class)))
                        .thenReturn(null);

                // Act & Assert
                mockMvc.perform(post("/auth/resetPasswordRequest")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\": \"invalid@example.com\"}"))
                        .andExpect(status().isBadRequest())
                        .andExpect(content().string("Invalid Reset Password Request."));

                verify(emailService, times(0)).sendSimpleEmail(anyString(), anyString(), anyString());
        }

        @Test
        public void AuthController_ResetPassword_Success() throws Exception {
                // Arrange
                String token = "validToken";
                PasswordDto passwordDto = new PasswordDto();
                passwordDto.setEmail("test@example.com");
                passwordDto.setNewPassword("newPassword");

                UserEntity user = new UserEntity();
                user.setUserId(1L);
                user.setEmail("test@example.com");

                when(resetPasswordService.verifyToken(token, "test@example.com")).thenReturn(true);
                when(resetPasswordService.updateUserPassword("test@example.com", "newPassword")).thenReturn(user);

                // Act & Assert
                mockMvc.perform(patch("/auth/resetPassword")
                                .param("token", token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(passwordDto)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.email").value("test@example.com"));

                verify(resetPasswordService, times(1)).verifyToken(token, "test@example.com");
                verify(resetPasswordService, times(1)).updateUserPassword("test@example.com", "newPassword");
        }

        @Test
        public void AuthController_ResetPassword_InvalidToken() throws Exception {
                // Arrange
                String token = "invalidToken";
                PasswordDto passwordDto = new PasswordDto();
                passwordDto.setEmail("test@example.com");
                passwordDto.setNewPassword("newPassword");

                when(resetPasswordService.verifyToken(token, "test@example.com")).thenReturn(false);

                // Act & Assert
                mockMvc.perform(patch("/auth/resetPassword")
                                .param("token", token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(passwordDto)))
                        .andExpect(status().isBadRequest())
                        .andExpect(content().string("Invalid Password Reset Request Token! Token is either expired or invalid."));

                verify(resetPasswordService, times(1)).verifyToken(token, "test@example.com");
                verify(resetPasswordService, times(0)).updateUserPassword(anyLong(), anyString());
        }

        @Test
        public void AuthController_ResetPassword_MissingPrimaryKey() throws Exception {
                // Arrange
                String token = "validToken";
                PasswordDto passwordDto = new PasswordDto();
                passwordDto.setEmail("test@example.com");
                passwordDto.setNewPassword("newPassword");

                // Act & Assert
                mockMvc.perform(patch("/auth/resetPassword")
                                .param("token", token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"newPassword\": \"newPassword\"}"))
                        .andExpect(status().isBadRequest());

                verify(resetPasswordService, times(0)).verifyToken(anyString(), anyString());
                verify(resetPasswordService, times(0)).updateUserPassword(anyLong(), anyString());
        }

}
