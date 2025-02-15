package com.vlf.wma.api.features.exercise.exercise_set;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ExerciseSetDTO {

    private Long id;

    /**
     * Many Exercise Sets in an Exercise Group
     */
    private Long exerciseGroupId;

    /**
     * # of Reps of Set.
     */
    private Integer reps;

    /**
     * Weight of sets in KG.
     * NULLABLE
     */
    private Double weightKG;

    /**
     * negative weight for assisted exercises.
     */
    private Double negativeWeightKG;

    /**
     * additional weight for add on exercises.
     */
    private Double addOnWeightKG;

    /**
     * time/duration for exercises to require time tracking. (eg. planks)
     */
    private Duration duration;

    /**
     * Short for Rate of Perceived Exertion
     * Range should be [1-10], with 10 representing
     * maximum perceived exertion or aka. complete muscle failure
     * to do a rep with decent form.
     * NULLABLE
     */
    private Integer rpe;

    /**
     * For tracking distance metrics.
     */
    private Double distance;

    /**
     * Order of the set within the exercise group.
     */
    private Integer displayOrder;

    /**
     * For tracking whether user has a marked an exercise set for completion.
     */
    private Boolean completed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
