package com.vlf.wma.api.features.exercise.exercise_group;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSetDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseGroupDTO {
    private Long id;

    /**
     * Many Exercise Groups to One Exercise Entity
     */
    @JsonProperty("exerciseId")
    private Long exerciseEntityId;

    /**
     * One ExerciseGroup to Many ExerciseSets
     */
    @JsonProperty("exerciseSets")
    private List<ExerciseSetDTO> exerciseSetList;


    /**
     * The ID column to store the reference
     */
    private Long workoutId;


    /**
     * Contains order of this exercise group within the set.
     */
    private Integer displayOrder;

    /**
     * Time Created
     */
    private LocalDateTime createdAt;

    /**
     * Time Updated
     */
    private LocalDateTime updatedAt;
}
