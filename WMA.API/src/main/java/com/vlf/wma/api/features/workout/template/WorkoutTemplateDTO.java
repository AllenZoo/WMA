package com.vlf.wma.api.features.workout.template;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroupDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutTemplateDTO {
    private Long id;

    /**
     * Workout Template Name
     */
    private String name;

    /**
     * Many Workout Templates to One User.
     */
    private Long userId;

    /**
     * Workout Template CONTAINS Exercise Group (One to Many)
     */
    private List<ExerciseGroupDTO> exerciseGroups = new ArrayList<>();

    /**
     * Time Created
     */
    private LocalDateTime createdAt;

    /**
     * Time Updated
     */
    private LocalDateTime updatedAt;
}
