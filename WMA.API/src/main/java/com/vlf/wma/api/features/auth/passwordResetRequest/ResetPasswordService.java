package com.vlf.wma.api.features.auth.passwordResetRequest;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.features.user.exceptions.UserNotFoundException;
import com.vlf.wma.api.util.ExpirationDateGenerator;
import com.vlf.wma.api.util.Salter;
import com.vlf.wma.api.util.SecureTokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResetPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResetPasswordRepository requestRepository;

    /**
     * Saves reset password request. The token is salted and hashed before being saved into database.
     * @param request
     * @return
     *  the saved request (with unhashed token) or null.
     */
    public ResetPasswordRequest saveResetRequest(ResetPasswordRequest request) {
        if (request.getEmail() == null) {
            return  null;
        }

        // Verify email exists.
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new UserNotFoundException(
                "User " +
                "with email: " + request.getEmail() + " not found!"));


        // Generate Token + Expiration Date + Salt and Hash Token
        String token = SecureTokenGenerator.generateToken();
        String seasonedToken = Salter.hashPassword(token);
        LocalDateTime expiration = ExpirationDateGenerator.generateExpirationDate();

        request.setToken(seasonedToken);
        request.setExpirationDate(expiration);

        // Check any existing requests with email.
        // Add to Repo.
        //  1. First check if existing email + request exists, if so overwrite
        //  2. Add.
        ResetPasswordRequest insertedRequest = request;
        if (requestWithEmailExists(request.getEmail())) {
            requestRepository.updateSignUpRequestByEmail(request.getEmail(), request);
        } else {
            insertedRequest = requestRepository.save(request);
        }

        // Since we want to return unseasoned token, we modify insertedRequest here:
        insertedRequest.setToken(token);

        return insertedRequest;
    }

    /**
     * Checks if given token and email exist in the database and is valid.
     * A token is valid the plain matches the hashed version, and if the expiration time
     * hasn't passed.
     * @param token
     * @param email
     * @return
     */
    public boolean verifyToken(String token, String email) {
        // Find token in database by email
        ResetPasswordRequest request = requestRepository.findByEmail(email).orElse(null);
        if (request == null) return false;

        // Verify token content
        if (!Salter.checkPassword(token, request.getToken())) {
            return false;
        }

        // Verify Expiration Date
        if (!request.getExpirationDate().isAfter(LocalDateTime.now())) {
            return false;
        }

        // Checks passed, token is valid with email.
        return true;
    }

    /**
     * Updates user password.
     * @param email
     * @param plainPassword
     * @return
     */
    public UserEntity updateUserPassword(String email, String plainPassword) {

        UserEntity toBeUpdatedUser = userRepository.findByEmail(email).orElse(null);

        if (toBeUpdatedUser == null) {
            throw new UserNotFoundException(String.format("User with email: %s doesn't exist!", email));
        }

        toBeUpdatedUser.setPassword(Salter.hashPassword(plainPassword));
        return userRepository.save(toBeUpdatedUser);
    }

    /**
     * Updates user password.
     * @param userId
     * @param plainPassword
     * @return
     */
    public UserEntity updateUserPassword(Long userId, String plainPassword) {
        UserEntity toBeUpdatedUser = userRepository.findById(userId).orElse(null);

        if (toBeUpdatedUser == null) {
            throw new UserNotFoundException(String.format("User with userId: %s doesn't exist!", userId));
        }

        toBeUpdatedUser.setPassword(Salter.hashPassword(plainPassword));
        return userRepository.save(toBeUpdatedUser);
    }

    private boolean requestWithEmailExists(String email) {
        return requestRepository.findByEmail(email).isPresent();
    }

    /**
     * Deletes all reset password requests from the database.
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // This cron expression schedules the task to run daily at midnight.
    public void deleteAllResetPasswordRequests() {
        requestRepository.deleteAll();
    }
}
