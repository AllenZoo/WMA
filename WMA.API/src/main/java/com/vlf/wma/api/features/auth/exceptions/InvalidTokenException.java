package com.vlf.wma.api.features.auth.exceptions;

public class InvalidTokenException extends RuntimeException{
    public InvalidTokenException(String msg) {
        super(msg);
    }
}
