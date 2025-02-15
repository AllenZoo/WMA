package com.vlf.wma.api.features.user.signUpRequest;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailExistsException;
import com.vlf.wma.api.features.user.exceptions.UserWithEmailFromOauthLoginExistsException;

public interface ISignUpService {
    /**
     * Takes in a request and processes it by: <br>
     * Validation Process Checks: <br>
     *   1. If a user with the given email exists. <br>
     *   2. If the request is from logging in with OAUTH2, treat it as a special case. <br> <br>
     *
     * Processes After Validation Succeeds: <br>
     *  1. Generating a verification token. <br>
     *  2. Setting an expiration time for the token. <br>
     *  3. Salt and Hashing the password. <br>
     *  4. Adding it to the DB. <br>
     *
     * @param request the request to be processed
     * @return the request with the
     */

    SignUpRequest processSignUpRequest(SignUpRequest request) throws UserWithEmailExistsException,
            UserWithEmailFromOauthLoginExistsException;

    /**
     * Verifies signup request.
     * @param email
     * @param verificationCode
     * @return
     */
    boolean verifySignUpRequest(String email, String verificationCode);

    /**
     * Gets SignUpRequest or 'null' if email with request doesn't exist.
     * @param email
     * @return
     */
    SignUpRequest getRequestByEmail(String email);
}
