package com.vlf.wma.api.features.exercise.enums;

/**
 * Used in Exercise Tags to specify what the measuring metrics is for exercises.
 * Note that an exercise can have multiple ExerciseMetricTypes.
 * However some combinations are forbidden:
 *    - REPS + TIMED
 *    - WEIGHTED + ASSISTED
 *    - WEIGHTED + LEVEL_SYSTEM
 *    - LEVEL_SYSTEM + ASSISTED
 */
public enum ExerciseMetricType {
    WEIGHTED,    // eg. bicep curl
    ASSISTED,    // eg. assisted pull up
    REPS,        // eg. push up
    TIMED,       // eg. plank
    LEVEL_SYSTEM, // eg. treadmill
    DISTANCE
}
