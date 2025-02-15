package com.vlf.wma.api.features.user.signUpRequest;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserRepository;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailExistsException;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailFromOauthLoginExistsException;
import com.vlf.wma.api.util.ExpirationDateGenerator;
import com.vlf.wma.api.util.Salter;
import com.vlf.wma.api.util.VerificationCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SignUpService implements ISignUpService {

    @Autowired
    private SignUpRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public SignUpRequest processSignUpRequest(SignUpRequest request) throws UserWithEmailExistsException,
            UserWithEmailFromOauthLoginExistsException {
        // Validate User
        Optional<UserEntity> user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()) {
            // Existing User with email exists!
            boolean isOAuthCreatedUser = !user.get().isInitializedViaEmailPass();
            if (isOAuthCreatedUser) {
                throw new UserWithEmailFromOauthLoginExistsException("User with existing email created through OAuth2! " +
                        "Would user like to bind the accounts?");
            } else {
                throw new UserWithEmailExistsException("User with existing email exists!");
            }
        }

        // Generate Token + Expiration Date + Salt and Hash password
        String code = VerificationCodeGenerator.generateVerificationCode();
        LocalDateTime expiration = ExpirationDateGenerator.generateExpirationDate();

        request.setCode(code);
        request.setExpirationDate(expiration);

        String encryptedPassword = Salter.hashPassword(request.getPassword());
        request.setPassword(encryptedPassword);


        // Add to Repo.
        //  1. First check if existing email + request exists, if so overwrite
        //  2. Add.
        SignUpRequest insertedRequest = request;
        if (requestWithEmailExists(request.getEmail())) {
            requestRepository.updateSignUpRequestByEmail(request.getEmail(), request);
        } else {
            insertedRequest = requestRepository.save(request);
        }

        return insertedRequest;
    }

    @Override
    public boolean verifySignUpRequest(String email, String verificationCode) {
        SignUpRequest request;
        try {
            request = requestRepository.findByEmail(email).get();
        } catch (NoSuchElementException e) {
            return false;
        }

        return isValidVerificationRequest(request, verificationCode);
    }

    @Override
    public SignUpRequest getRequestByEmail(String email) {
        return requestRepository.findByEmail(email).orElse(null);
    }

    private boolean requestWithEmailExists(String email) {
        return requestRepository.findByEmail(email).isPresent();
    }

    /**
     * Checks the expiration date of the request and whether the codes match.
     *
     * @param request The sign-up request to check.
     * @param code    The verification code to compare.
     * @return True if the request is valid (code matches and not expired), false otherwise.
     */
    private boolean isValidVerificationRequest(SignUpRequest request, String code) {
        if (request == null || code == null) {
            return false;
        }

        boolean isCodeValid = request.getCode().equals(code);
        boolean isNotExpired = request.getExpirationDate().isAfter(LocalDateTime.now());

        return isCodeValid && isNotExpired;
    }
}
