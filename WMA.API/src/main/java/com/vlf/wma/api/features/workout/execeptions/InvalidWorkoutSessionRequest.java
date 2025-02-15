package com.vlf.wma.api.features.workout.execeptions;

public class InvalidWorkoutSessionRequest extends RuntimeException {
    public InvalidWorkoutSessionRequest(String message) {
        super(message);
    }
}
