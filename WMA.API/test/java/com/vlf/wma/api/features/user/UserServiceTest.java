package com.vlf.wma.api.features.user;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.vlf.wma.api.features.user.exceptions.UserNotFoundException;
import com.vlf.wma.api.features.user.role.Role;
import com.vlf.wma.api.util.Salter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserService userService;

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

    // User1 before password hash.
    private static final UserEntity USER1_PREHASH = UserEntity.builder()
            .userId(1L)
            .username("Bob")
            .email("bob123@hotmail.com")
            .password("12345678")
            .roles(Collections.singleton(USER_ROLE))
            .build();

    // User1 with updated info
    private static final UserEntity USER1_UPDATED = UserEntity.builder()
            .userId(1L)
            .username("Bobi")
            .email("bobi123@hotmail.com")
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
    public void UserService_GetAllUsers_ReturnsUsers() {

        when(userRepo.findAll()).thenReturn(Arrays.asList(USER1, USER2));
        List<UserEntity> allUsers = userService.getAllUsers();

        Assertions.assertTrue(allUsers != null);
        Assertions.assertTrue(allUsers.size() == 2);
    }

    @Test
    public void UserService_GetUserByUsername_ReturnsUser() {
        when(userRepo.findByUsername(USER1.getUsername())).thenReturn(Optional.of(USER1));
        when(userRepo.findByUsername(USER2.getUsername())).thenReturn(Optional.of(USER2));

        UserEntity foundUser1 = userService.getUserByUsername(USER1.getUsername());
        UserEntity foundUser2 = userService.getUserByUsername(USER2.getUsername());

        Assertions.assertNotNull(foundUser1);
        Assertions.assertNotNull(foundUser2);

        Assertions.assertEquals(USER1.getUserId(), foundUser1.getUserId());
        Assertions.assertEquals(USER2.getUserId(), foundUser2.getUserId());

        Assertions.assertEquals(USER1.getUsername(), foundUser1.getUsername());
        Assertions.assertEquals(USER2.getUsername(), foundUser2.getUsername());
    }

    @Test
    public void UserService_GetUserDetailsByUserName_ReturnsUserDetails() {
        when(userRepo.findByUsername(USER1.getUsername())).thenReturn(Optional.of(USER1));

        UserDetails userDetails = userService.getUserDetailsByUsername(USER1.getUsername());

        Assertions.assertNotNull(userDetails);
        Assertions.assertEquals(USER1.getUsername(), userDetails.getUsername());
    }

    @Test
    public void UserService_GetUserByEmail_ReturnsUser() {
        when(userRepo.findByEmail(USER1.getEmail())).thenReturn(Optional.of(USER1));

        UserEntity foundUser1 = userService.getUserByEmail(USER1.getEmail());

        Assertions.assertNotNull(foundUser1);
        Assertions.assertEquals(USER1.getEmail(), foundUser1.getEmail());
        Assertions.assertEquals(USER1.getUserId(), foundUser1.getUserId());
    }

    @Test
    public void UserService_GetUserById_ReturnsUser() {
        when(userRepo.findById(USER1.getUserId())).thenReturn(Optional.of(USER1));

        UserEntity foundUser1 = userService.getUserById(USER1.getUserId());

        Assertions.assertNotNull(foundUser1);
        Assertions.assertEquals(USER1.getUserId(), foundUser1.getUserId());
        Assertions.assertEquals(USER1.getUsername(), foundUser1.getUsername());
    }

    @Test
    public void UserService_RegisterUser_ReturnsUser() {
        try (MockedStatic<Salter> mockedSalter = Mockito.mockStatic(Salter.class)) {
            // Mock the static method
            mockedSalter.when(() -> Salter.hashPassword(USER1_PREHASH.getPassword()))
                    .thenReturn(USER1.getPassword());

            when(userRepo.save(any(UserEntity.class))).thenReturn(USER1);
            UserEntity registeredUser = userService.registerUser(USER1_PREHASH, true);

            // Capture the argument passed to the save method
            ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
            verify(userRepo).save(userCaptor.capture());
            UserEntity savedUser = userCaptor.getValue();

            // Assert the result
            Assertions.assertNotNull(registeredUser);
            Assertions.assertEquals(USER1.getUsername(), registeredUser.getUsername());
            Assertions.assertEquals(USER1.getEmail(), registeredUser.getEmail());
            Assertions.assertEquals(USER1.getPassword(), registeredUser.getPassword());

            Assertions.assertEquals(USER1.getPassword(), savedUser.getPassword());
        }
    }

    @Test
    public void UserService_UpdateUser_ReturnsUser() {
        when(userRepo.findById(USER1.getUserId())).thenReturn(Optional.of(USER1));
        when(userRepo.save(USER1_UPDATED)).thenReturn(USER1_UPDATED);

        UserEntity updatedUser = userService.updateUser(USER1.getUserId(), USER1_UPDATED);

        Assertions.assertNotNull(updatedUser);
        Assertions.assertEquals(USER1.getUserId(), updatedUser.getUserId());
        Assertions.assertEquals(USER1_UPDATED.getUsername(), updatedUser.getUsername());
        Assertions.assertEquals(USER1_UPDATED.getEmail(), updatedUser.getEmail());

    }

    @Test
    public void UserService_UpdateUserNonExistingID_ReturnsUser() {
        when(userRepo.findById(Mockito.any())).thenReturn(Optional.empty());
        when(userRepo.save(USER1_UPDATED)).thenReturn(USER1_UPDATED);

        UserEntity updatedUser = userService.updateUser(USER1.getUserId(), USER1_UPDATED);

        Assertions.assertNotNull(updatedUser);
        Assertions.assertEquals(USER1.getUserId(), updatedUser.getUserId());
        Assertions.assertEquals(USER1_UPDATED.getUsername(), updatedUser.getUsername());
        Assertions.assertEquals(USER1_UPDATED.getEmail(), updatedUser.getEmail());
    }

    @Test
    public void UserService_RemoveUserById_ReturnsVoid() {
        when(userRepo.findById(USER1.getUserId())).thenReturn(Optional.of(USER1));
        try {
            userService.removeUserById(USER1.getUserId());
        } catch (UserNotFoundException ex) {
            Assertions.fail("Unexpected UserNotFoundException Caught");
        }
    }

    @Test
    public void UserService_RemoveUserById_ThrowsUserNotFoundException() {
        when(userRepo.findById(USER1.getUserId())).thenReturn(Optional.empty());
        try {
            userService.removeUserById(USER1.getUserId());
            Assertions.fail("UserNotFoundException not caught!");
        } catch (UserNotFoundException ex) {

        }
    }
}

