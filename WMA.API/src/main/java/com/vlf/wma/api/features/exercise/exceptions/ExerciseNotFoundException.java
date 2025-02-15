package com.vlf.wma.api.features.exercise.exceptions;

public class ExerciseNotFoundException extends RuntimeException{
    public ExerciseNotFoundException(String message) {
        super(message);
    }
}
