package com.vlf.wma.api.features.user;

import com.vlf.wma.api.config.TestSecurityConfig;
import com.vlf.wma.api.features.user.role.Role;
import com.vlf.wma.api.features.user.role.RoleRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Import(TestSecurityConfig.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @MockBean
    private ClientRegistrationRepository registrationRepository;

    private static final Role USER_ROLE = Role.builder()
            .id(0L)
            .name("USER")
            .build();

    private static final UserEntity USER1 = UserEntity.builder()
            .userId(-1L)
            .username("Bob")
            .email("bob123@hotmail.com")
            .password("dogharh4hw0q856hs0ujij")
            .roles(Collections.singleton(USER_ROLE))
            .build();

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();


        roleRepository.save(USER_ROLE);
        userRepository.save(USER1);
    }

    @Test
    public void UserRepository_SaveAll_ReturnSavedUser() {
        // Create UserEntity
        // Usually, we would not assign userID in builder but the
        // test case runs into some weird error if we don't.
        UserEntity user1 = UserEntity.builder()
                .userId(-1L)
                .username("Bobafdhabby")
                .email("bobby123adh@hotmail.com")
                .password("doghaadfharh4hw0q856hs0ujij")
                .roles(Collections.singleton(USER_ROLE))
                .build();

        // Save to DB.
        UserEntity addedUser = userRepository.save(user1);

        // Assert that returned user is not null.
        Assertions.assertTrue(addedUser != null);

        // Assert that an ID has been assigned to User.
        Assertions.assertTrue(addedUser.getUserId() > 0);

    }

    @Test
    public void UserRepository_FindByUsername_ReturnUser() {
        // 1. Find BOB
        UserEntity bob = userRepository.findByUsername("Bob").orElse(null);

        // 2. Verify BOB
        Assertions.assertTrue(bob != null);
        Assertions.assertEquals("Bob", bob.getUsername());
        Assertions.assertEquals("bob123@hotmail.com", bob.getEmail());
        Assertions.assertEquals("dogharh4hw0q856hs0ujij", bob.getPassword());
        Assertions.assertTrue(bob.getRoles().contains(USER_ROLE));
    }

    @Test
    public void UserRepository_FindByEmail_ReturnUser() {
        // 1. Find BOB
        UserEntity bob = userRepository.findByEmail("bob123@hotmail.com").orElse(null);

        // 2. Verify BOB
        Assertions.assertTrue(bob != null);
        Assertions.assertEquals("Bob", bob.getUsername());
        Assertions.assertEquals("bob123@hotmail.com", bob.getEmail());
        Assertions.assertEquals("dogharh4hw0q856hs0ujij", bob.getPassword());
        Assertions.assertTrue(bob.getRoles().contains(USER_ROLE));
    }

    @Test
    public void UserRepository_FindById_ReturnUser() {
        // Create UserEntity
        // Usually, we would not assign userID in builder but the
        // test case runs into some weird error if we don't.
        UserEntity user1 = UserEntity.builder()
                .userId(-1L)
                .username("Bobafdhabby")
                .email("bobby123adh@hotmail.com")
                .password("doghaadfharh4hw0q856hs0ujij")
                .roles(Collections.singleton(USER_ROLE))
                .build();

        // Save to DB.
        UserEntity addedUser = userRepository.save(user1);

        Long id = addedUser.getUserId();

        // Find user by ID
        UserEntity bob = userRepository.findById(id).orElse(null);

        // Verify user
        Assertions.assertTrue(bob != null);
        Assertions.assertEquals("Bobafdhabby", bob.getUsername());
        Assertions.assertEquals("bobby123adh@hotmail.com", bob.getEmail());
        Assertions.assertEquals("doghaadfharh4hw0q856hs0ujij", bob.getPassword());
        Assertions.assertTrue(bob.getRoles().contains(USER_ROLE));
    }

    @Test
    public void UserRepository_UpdateUser_ReturnUser() {
        UserEntity bob = userRepository.findByUsername("Bob").orElse(null);
        Assertions.assertTrue(bob != null);

        UserEntity newBob = UserEntity.builder()
                .userId(bob.getUserId())
                .username("bobbbbbyyCOOl")
                .email("bobsNewEmail@yahoo.com")
                .password("newpaswdganeohraah")
                .roles(bob.getRoles())
                .build();

        UserEntity savedBob = userRepository.save(newBob);
        Assertions.assertTrue(savedBob != null);

        UserEntity foundNewBob = userRepository.findById(bob.getUserId()).orElse(null);
        Assertions.assertTrue(foundNewBob != null);

        // Verify Update went through on the User with same ID.
        Assertions.assertEquals(bob.getUserId(), foundNewBob.getUserId());
        Assertions.assertEquals("bobsNewEmail@yahoo.com", foundNewBob.getEmail());
        Assertions.assertEquals("bobbbbbyyCOOl", foundNewBob.getUsername());
        Assertions.assertEquals("newpaswdganeohraah", foundNewBob.getPassword());
        Assertions.assertTrue(bob.getRoles().contains(USER_ROLE));
    }

    @Test
    public void UserRepository_DeleteUser_FindReturnNull() {
        Long bobId = userRepository.findByUsername("Bob").get().getUserId();

        userRepository.deleteById(bobId);

        UserEntity whereIsBob = userRepository.findById(bobId).orElse(null);

        Assertions.assertTrue(whereIsBob == null);
    }
}
