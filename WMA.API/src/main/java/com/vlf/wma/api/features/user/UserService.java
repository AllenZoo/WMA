package com.vlf.wma.api.features.user;

import com.vlf.wma.api.features.user.exceptions.UserNotFoundException;
import com.vlf.wma.api.features.user.role.Role;
import com.vlf.wma.api.util.Salter;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class UserService implements IUserService{

    @Autowired
    private UserRepository userRepo;

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public UserEntity getUserByUsername(String username) {
        return userRepo.findByUsername(username).orElseThrow(
                ()-> new UserNotFoundException(String.format("User with username [%s] not found!"
                        , username)
        ));
    }

    /**
     * Fetches and converts  UserEntity into a UserDetails object for Spring Security
     * Validation.
     * @param username
     * @return
     */
    public UserDetails getUserDetailsByUsername(String username) {
        UserEntity userEntity = getUserByUsername(username);
        return new User(
                userEntity.getUsername(),
                userEntity.getPassword(),
                mapRolesToAuthorities(userEntity.getRoles()));
    }

    @Override
    public UserEntity getUserByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(
                ()-> new UserNotFoundException(String.format("User with email [%s] not found!"
                        , email)
                ));
    }

    @Override
    public UserEntity getUserById(long id) {
        return userRepo.findById(id).
                orElseThrow(()->
                        new UserNotFoundException(String.format("User with id [%d] not found!"
                , id)));
    }

    /**
     * Registers new User. Salts and Hashes password before storage into Database.
     * @param user with plain text password
     */
    @Override
    @Transactional
    public UserEntity registerUser(UserEntity user, boolean shouldEncryptPassword) {
        String hashedPassword = user.getPassword();
        if (shouldEncryptPassword) {
            hashedPassword= Salter.hashPassword(user.getPassword());
        }
        user.setPassword(hashedPassword);

        UserEntity newUser = null;
        try {
            newUser = userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            System.out.println("Caught!");
        }
        return newUser;
    }

    /**
     * Updates user in DB with associated UserID with new passed in user info.
     * If passed in UserID doesn't have an associated User, create a new User in DB!
     * @param oldUserId
     * @param newUser
     * @return
     */
    @Override
    public UserEntity updateUser(Long oldUserId, UserEntity newUser) {
        Optional<UserEntity> userToUpdate = userRepo.findById(oldUserId);

        // Instead of randomly assigning an ID to user, use the one we used
        // for the initial PUT request.
        newUser.setUserId(oldUserId);
        if (!userToUpdate.isPresent()) {
            // No existing current user with 'oldUserId'. Register a new one!
            return registerUser(newUser, true);
        }
        return userRepo.save(newUser);
    }

    /**
     * Removes a user from the DB by ID.
     * @param id
     */
    @Override
    public void removeUserById(Long id) {
        Optional<UserEntity> userToUpdate = userRepo.findById(id);
        if (!userToUpdate.isPresent()) {
            throw new UserNotFoundException(String.format("User with id %d not found!", id));
        } else {
            userRepo.deleteById(id);
        }
    }

    /**
     * Helper function that maps User Roles to Authorities.
     * @param roles
     * @return
     */
    private Collection<GrantedAuthority> mapRolesToAuthorities(List<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }
}
