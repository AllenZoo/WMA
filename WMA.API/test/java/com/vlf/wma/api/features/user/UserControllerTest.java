package com.vlf.wma.api.features.user;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.vlf.wma.api.features.user.exceptions.UserWithEmailExistsException;
import com.vlf.wma.api.features.user.signUpRequest.EmailService;
import com.vlf.wma.api.features.user.signUpRequest.ISignUpService;
import com.vlf.wma.api.features.user.signUpRequest.SignUpRequest;
import com.vlf.wma.api.features.user.role.IRoleService;
import com.vlf.wma.api.features.user.role.Role;
import com.vlf.wma.api.util.JWTTokenUtil;
import org.hamcrest.CoreMatchers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.Collections;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith({ MockitoExtension.class })
class UserControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private IUserService userService;

        @MockBean
        private IRoleService roleService;

        @MockBean
        private EmailService emailService;

        @MockBean
        private ISignUpService signUpService;

        @MockBean
        private JWTTokenUtil jwtTokenUtil;

        @Autowired
        private ObjectMapper objectMapper;

        private static final Role USER_ROLE = Role.builder()
                        .id(0L)
                        .name("USER")
                        .build();

        private static final UserEntity USER1 = UserEntity.builder()
                        .userId(1L)
                        .username("Bob")
                        .email("bob123@hotmail.com")
                        .password("dogharh4hw0q856hs0ujij")
                        .roles(Collections.singleton(USER_ROLE))
                        .build();

        private static final UserEntity USER2 = UserEntity.builder()
                        .userId(2L)
                        .username("Bob2")
                        .email("bob2123@hotmail.com")
                        .password("2dogharh4hw0q856hs0ujij")
                        .roles(Collections.singleton(USER_ROLE))
                        .build();

        @Test
        public void UserController_RegisterUser_ReturnCreated() throws Exception {
                when(userService.registerUser(Mockito.any(UserEntity.class), Mockito.eq(true))).thenReturn(USER1);

                ResultActions response = mockMvc.perform(post("/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(USER1)));

                response.andExpect(MockMvcResultMatchers.status().isCreated())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.username",
                                                CoreMatchers.is(USER1.getUsername())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(USER1.getEmail())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.password",
                                                CoreMatchers.is(USER1.getPassword())));
        }

        @Test
        public void UserController_GetAllUsers_ReturnUsers() throws Exception {
                when(userService.getAllUsers()).thenReturn(Arrays.asList(USER1, USER2));

                ResultActions response = mockMvc.perform(get("/user")
                                .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.length()")
                                                .value(2));
        }

        @Test
        public void UserController_GetUser_ById() throws Exception {
                when(userService.getUserById(USER1.getUserId())).thenReturn(USER1);

                ResultActions response = mockMvc.perform(get("/user/{id}", USER1.getUserId())
                                .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.username",
                                                CoreMatchers.is(USER1.getUsername())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(USER1.getEmail())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.password",
                                                CoreMatchers.is(USER1.getPassword())));
        }

        @Test
        public void UserController_GetUser_ByEmail() throws Exception {
                when(userService.getUserByEmail(USER1.getEmail())).thenReturn(USER1);

                ResultActions response = mockMvc.perform(get("/user/by-email")
                                .param("email", USER1.getEmail())
                                .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.username",
                                                CoreMatchers.is(USER1.getUsername())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(USER1.getEmail())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.password",
                                                CoreMatchers.is(USER1.getPassword())));
        }

        @Test
        public void UserController_GetUser_ByUsername() throws Exception {
                when(userService.getUserByUsername(USER1.getUsername())).thenReturn(USER1);

                ResultActions response = mockMvc.perform(get("/user/by-username")
                                .param("username", USER1.getUsername())
                                .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.username",
                                                CoreMatchers.is(USER1.getUsername())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(USER1.getEmail())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.password",
                                                CoreMatchers.is(USER1.getPassword())));
        }

        @Test
        public void UserController_UpdateUser_ById() throws Exception {
                UserEntity updatedUser = UserEntity.builder()
                                .userId(USER1.getUserId())
                                .username("UpdatedBob")
                                .email("updated_bob123@hotmail.com")
                                .password("updated_password")
                                .roles(Collections.singleton(USER_ROLE))
                                .build();

                when(userService.updateUser(eq(USER1.getUserId()), eq(updatedUser))).thenReturn(updatedUser);
                ResultActions response = mockMvc.perform(put("/user")
                                .param("id", String.valueOf(USER1.getUserId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedUser)));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.username",
                                                CoreMatchers.is(updatedUser.getUsername())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email",
                                                CoreMatchers.is(updatedUser.getEmail())))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.password",
                                                CoreMatchers.is(updatedUser.getPassword())));
        }

        @Test
        public void UserController_DeleteUser_ById() throws Exception {
                doNothing().when(userService).removeUserById(USER1.getUserId());

                ResultActions response = mockMvc.perform(delete("/user")
                                .param("id", String.valueOf(USER1.getUserId()))
                                .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk());
        }

        @Test
        public void UserController_RequestSignUp_ReturnsInsertedRequest() throws Exception {
                String email = "newuser@example.com";
                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .email(email)
                        .password("password123")
                        .username("newuser")
                        .build();

                when(signUpService.processSignUpRequest(any(SignUpRequest.class))).thenReturn(signUpRequest);

                ResultActions response = mockMvc.perform(post("/user/signUpRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(signUpRequest.getEmail())))
                        .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(signUpRequest.getUsername())))
                        .andExpect(MockMvcResultMatchers.jsonPath("$.password", CoreMatchers.is(signUpRequest.getPassword())));

                Mockito.verify(emailService, times(1)).sendSimpleEmail(eq(email), anyString(), anyString());
        }

        @Test
        public void UserController_RequestSignUpExistingUserEmail_ThrowsUserExistsException() throws Exception {
                String email = "newuser@example.com";
                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .email(email)
                        .password("password123")
                        .username("newuser")
                        .build();

                when(signUpService.processSignUpRequest(any(SignUpRequest.class))).thenThrow(new UserWithEmailExistsException(""));

                ResultActions response = mockMvc.perform(post("/user/signUpRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)));

                response.andExpect(MockMvcResultMatchers.status().isBadRequest());
                Mockito.verify(emailService, times(0)).sendSimpleEmail(eq(email), anyString(), anyString());
        }

        @Test
        public void UserController_VerifyUser_Success() throws Exception {
                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .email("verify@example.com")
                        .password("password123")
                        .username("verifyuser")
                        .code("123456")
                        .build();

                when(signUpService.verifySignUpRequest(signUpRequest.getEmail(), signUpRequest.getCode())).thenReturn(true);
                when(signUpService.getRequestByEmail(signUpRequest.getEmail())).thenReturn(signUpRequest);
                when(roleService.getRoleByName("USER")).thenReturn(USER_ROLE);

                UserEntity newUser = UserEntity.builder()
                        .username(signUpRequest.getUsername())
                        .password(signUpRequest.getPassword())
                        .email(signUpRequest.getEmail())
                        .roles(Collections.singleton(USER_ROLE))
                        .build();

                when(userService.registerUser(any(UserEntity.class), eq(false))).thenReturn(newUser);

                ResultActions response = mockMvc.perform(get("/user/verify")
                        .param("code", signUpRequest.getCode())
                        .param("email", signUpRequest.getEmail())
                        .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isOk())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(signUpRequest.getUsername())))
                        .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(signUpRequest.getEmail())))
                        .andExpect(MockMvcResultMatchers.jsonPath("$.password", CoreMatchers.is(signUpRequest.getPassword())));
        }

        @Test
        public void UserController_VerifyUser_Failure() throws Exception {
                when(signUpService.verifySignUpRequest("invalid@example.com", "123456")).thenReturn(false);

                ResultActions response = mockMvc.perform(get("/user/verify")
                        .param("code", "123456")
                        .param("email", "invalid@example.com")
                        .contentType(MediaType.APPLICATION_JSON));

                response.andExpect(MockMvcResultMatchers.status().isBadRequest())
                        .andExpect(MockMvcResultMatchers.content().string("Failed to verify user."));
        }
}
