package com.vlf.wma.api.features.workout.filter;

import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutFilterRequestDTO {
    private Long userId;
    private String searchString;
    private String sessionStatus;
    private List<String> muscleGroups;
    private Integer maxNumExercise;
    private Boolean mostRecentFirst;
}
