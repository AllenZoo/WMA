package com.vlf.wma.api.features.exercise.exercise_set;

import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Object that represents a set of an exercise
 */
@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "exercise_sets")
// @EntityListeners(ExerciseSetListener.class)
public class ExerciseSet {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many Exercise Sets in an Exercise Group
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "exercise_group_id", referencedColumnName = "id")
    private ExerciseGroup exerciseGroup;

    /**
     * # of Reps of Set.
     */
    @Column(name = "reps", columnDefinition = "integer default 10")
    private Integer reps;

    /**
     * Weight of sets in KG.
     * NULLABLE
     */
    @Column(name = "weight_kg")
    private Double weightKG;

    /**
     * negative weight for assisted exercises.
     */
    @Column(name = "assisted_weight_kg")
    private Double negativeWeightKG;

    /**
     * additional weight for add on exercises.
     */
    @Column(name = "add_on_weight_kg")
    private Double addOnWeightKG;

    /**
     * time/duration for exercises to require time tracking. (eg. planks)
     */
    @Column(name = "duration")
    private Duration duration;

    /**
     * Short for Rate of Perceived Exertion
     * Range should be [1-10], with 10 representing
     * maximum perceived exertion or aka. complete muscle failure
     * to do a rep with decent form.
     * NULLABLE
     */
    @Column(name = "rpe")
    private Integer rpe;

    /**
     * For tracking distance metrics.
     */
    @Column(name = "distance")
    private Double distance;

    /**
     * Order of the set within the exercise group.
     */
    @Column(name = "display_order")
    private Integer displayOrder;

    /**
     * For tracking whether user has a marked an exercise set for completion.
     */
    @Column(name = "completed")
    private Boolean completed;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private  LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @PostUpdate
    private void afterUpdate() {
        if (completed != null && completed) {
            completedAt = LocalDateTime.now();
        }
    }
}


