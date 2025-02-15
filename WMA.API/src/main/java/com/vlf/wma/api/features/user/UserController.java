package com.vlf.wma.api.features.user;

import java.util.Collections;
import java.util.List;

import com.vlf.wma.api.features.user.signUpRequest.EmailService;
import com.vlf.wma.api.features.user.signUpRequest.ISignUpService;
import com.vlf.wma.api.features.user.signUpRequest.SignUpRequest;
import com.vlf.wma.api.features.user.signUpRequest.SignUpService;
import com.vlf.wma.api.features.user.role.IRoleService;
import com.vlf.wma.api.features.user.role.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private IUserService userService;

    @Autowired
    private ISignUpService signUpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private IRoleService roleService;

    @PostMapping("/signUpRequest")
    public ResponseEntity<?> requestSignUp(@RequestBody SignUpRequest request) {
        SignUpRequest insertedRequest = signUpService.processSignUpRequest(request);
        String emailBody = String.format(
                "Hello,\n\n" +
                        "Thank you for signing up for WMA! To complete your registration, please verify your email address.\n\n" +
                        "Your verification code is:\n\n" +
                        "    %s\n\n" +
                        "This code will expire in 30 minutes. \n" +
                        "Alternatively, you can verify your account by clicking the following link:\n" +
                        "(WIP - Verification Link)\n\n" +
                        "If you did not sign up for WMA, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "The WMA Team",
                request.getCode()
        );
        emailService.sendSimpleEmail(request.getEmail(), "WMA - Verify Your Account!", emailBody);

        return ResponseEntity.ok(insertedRequest);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String code, @RequestParam String email) {
        // Your implementation here
        if (signUpService.verifySignUpRequest(email, code)) {
            // Add User
            SignUpRequest signUpRequest = signUpService.getRequestByEmail(email);
            Role userRole = roleService.getRoleByName("USER");

            // Note: password field from SignUpRequest is already encrypted!
            UserEntity userToAdd = UserEntity.builder()
                    .username(signUpRequest.getUsername())
                    .password(signUpRequest.getPassword())
                    .email(signUpRequest.getEmail())
                    .roles(Collections.singleton(userRole))
                    .initializedViaEmailPass(true)
                    .build();
            UserEntity res = userService.registerUser(userToAdd, false);
            return ResponseEntity.ok(res);
        } else {
            // Failed to verify user.
            return ResponseEntity.badRequest().body("Failed to verify user.");
        }
    }

    @PostMapping
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserEntity userEntity) {
        // 1. Query for 'USER' role. Note that all users made through registration will
        // only
        // have the 'USER' role. 'ADMIN' users can only be made through manual insertion
        // into DB.
        Role userRole = roleService.getRoleByName("USER");

        // 2. Create new User Entity based on passed in body request.
        // This is necessary in order for our server to assign a valid ID to the user.
        UserEntity userToAdd = UserEntity.builder()
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .roles(Collections.singleton(userRole))
                .initializedViaEmailPass(true)
                .build();

        // 3. Register User via IUserService
        UserEntity addedUser = userService.registerUser(userToAdd, true);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedUser);
    }

    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        UserEntity user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserEntity> getUserByEmail(@RequestParam("email") String email) {
        UserEntity user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/by-username")
    public ResponseEntity<UserEntity> getUserByUsername(@RequestParam("username") String username) {
        UserEntity user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<?> updateUserById(@RequestParam("id") Long id,
            @RequestBody UserEntity newUser) {
        return ResponseEntity.ok(userService.updateUser(id, newUser));
    }

    @DeleteMapping
    public void deleteUserById(@RequestParam("id") Long id) {
        // TODO: make user deletion possible only by ADMIN.
        userService.removeUserById(id);
    }
}
