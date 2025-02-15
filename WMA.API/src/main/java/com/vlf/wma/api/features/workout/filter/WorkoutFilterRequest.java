package com.vlf.wma.api.features.workout.filter;

import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutFilterRequest {
    private UserEntity user;
    private String searchString;
    private WorkoutSessionStatus sessionStatus;
    private List<ExerciseMuscleGroup> muscleGroups;
    private Integer maxNumExercise;
    private Boolean mostRecentFirst;
}
