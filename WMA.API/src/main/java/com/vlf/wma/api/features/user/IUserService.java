package com.vlf.wma.api.features.user;

import com.vlf.wma.api.util.Salter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IUserService {

    List<UserEntity> getAllUsers();
    UserEntity getUserByUsername(String username);

    /**
     * This is specifically for converting UserEntity to UserDetails for Spring Security.
     * Could make sense to refactor this and move to different class to handle such conversion.
     * @param username
     * @return
     */
    UserDetails getUserDetailsByUsername(String username);
    UserEntity getUserByEmail(String email);
    UserEntity getUserById(long id);

    /**
     * Registers new User. Salts and Hashes password before storage into Database.
     * @param user
     */
    UserEntity registerUser(UserEntity user, boolean shouldEncryptPassword);
    UserEntity updateUser(Long oldUserId, UserEntity newUser);

    void removeUserById(Long id);
}
