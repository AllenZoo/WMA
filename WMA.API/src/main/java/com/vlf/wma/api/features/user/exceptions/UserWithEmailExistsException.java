package com.vlf.wma.api.features.user.exceptions;

public class UserWithEmailExistsException extends RuntimeException{
    public UserWithEmailExistsException(String message) {
        super(message);
    }
}