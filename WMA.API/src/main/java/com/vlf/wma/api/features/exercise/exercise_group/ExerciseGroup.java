package com.vlf.wma.api.features.exercise.exercise_group;

import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.workout.WorkoutBase;
import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSet;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode
public class ExerciseGroup {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many Exercise Groups to One Exercise Entity
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", referencedColumnName = "id")
    private ExerciseEntity exerciseEntity;

    /**
     * One ExerciseGroup to Many ExerciseSets
     */
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseSet> exerciseSetList;

    /**
     * Polymorphic relationship to either WorkoutTemplate or WorkoutSession
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", referencedColumnName = "id")
    private WorkoutBase parent;

    /**
     * Contains order of this exercise group within the set.
     */
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    /**
     * Time Created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Time Updated
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * HELPERS
     */
    public void addExerciseSet(ExerciseSet exerciseSet) {
        exerciseSetList.add(exerciseSet);
    }

    public void removeExerciseSet(ExerciseSet exerciseSet) {
        exerciseSetList.remove(exerciseSet);
    }
}