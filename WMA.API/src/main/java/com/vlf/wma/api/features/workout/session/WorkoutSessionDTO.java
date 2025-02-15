package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroupDTO;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSessionDTO {
    private Long id;

    /**
     * Many Workout Sessions to One Workout Template.
     * NULLABLE, OPTIONAL
     */
    private Long templateId;

    /**
     * Many Workout Sessions to One User.
     * NULLABLE, OPTIONAL
     */
    private Long userId;

    /**
     * Workout Session Name
     */
    private String name;

    /**
     * One Workout Session to Many Exercise Groups
     */
    private List<ExerciseGroupDTO> exerciseGroups = new ArrayList<>();

    /**
     * Time Completed
     * NULLABLE
     */
    private LocalDateTime completedAt;

    /**
     * Workout Duration
     */
    private Duration duration;

    /**
     * Time Started
     */
    private LocalDateTime startedAt;

    /**
     * If Workout Session is Completed
     */
    private Boolean isCompleted;

    /**
     * Workout Session Status. One of ACTIVE, COMPLETED, CANCELLED
     */
    private WorkoutSessionStatus status;
}
