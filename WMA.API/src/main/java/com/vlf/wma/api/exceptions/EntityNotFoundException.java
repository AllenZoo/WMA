package com.vlf.wma.api.exceptions;

import java.lang.reflect.Type;

public class EntityNotFoundException extends RuntimeException{
    public EntityNotFoundException(String message) {
        super(message);
    }
    public EntityNotFoundException(Type type) {
        super(String.format("Entity of type [%s] not found.",  type.getTypeName()));
    }
}
