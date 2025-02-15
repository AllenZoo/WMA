package com.vlf.wma.api.features.workout.template;

import com.vlf.wma.api.features.workout.WorkoutBase;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Entity Class: Workout Template
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode

@Entity
@Table(name = "workout_templates", uniqueConstraints = {
        //@UniqueConstraint(name = "UniqueUserIdAndWorkoutNameConstraint", columnNames = {"user_id", "workout_name"})
})
@DiscriminatorValue("TEMPLATE")
public class WorkoutTemplate extends WorkoutBase {

    /**
     * Workout Template Name
     */
    @Column(name = "workout_name", nullable = false)
    private String name;

    /**
     * Time Created
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Time Updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PostUpdate
    private void onUpdate() {updatedAt = LocalDateTime.now();}
}
