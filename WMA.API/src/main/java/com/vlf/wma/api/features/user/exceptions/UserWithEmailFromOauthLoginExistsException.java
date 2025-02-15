package com.vlf.wma.api.features.user.exceptions;

public class UserWithEmailFromOauthLoginExistsException extends RuntimeException{
    public UserWithEmailFromOauthLoginExistsException(String message) {
        super(message);
    }
}