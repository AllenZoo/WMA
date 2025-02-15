package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.workout.WorkoutBase;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import com.vlf.wma.api.features.workout.template.WorkoutTemplate;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Workout Session that tracks the workout data of a user who is/was in a session.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)

@Entity
@Table(name = "workout_sessions", uniqueConstraints = {
        //@UniqueConstraint(name = "UniqueUserIdAndWorkoutNameConstraint", columnNames = {"user_id", "workout_name"})
})
@DiscriminatorValue("SESSION")
public class WorkoutSession extends WorkoutBase {

    /**
     * Many Workout Sessions to One Workout Template.
     * NULLABLE, OPTIONAL
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", referencedColumnName = "id")
    private WorkoutTemplate template;

    /**
     * Workout Session Name
     */
    @Column(name = "workout_name", nullable = false)
    private String name;


    /**
     * Time Completed
     * NULLABLE
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Workout Duration
     */
    @Column(name = "duration")
    private Duration duration;

    /**
     * Time Started
     */
    @Column(name = "started_at")
    private LocalDateTime startedAt;

    // TODO: remove this isCompleted field after integration of status field.
    //          Or maybe we can keep?
    /**
     * If Workout Session is Completed
     */
    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WorkoutSessionStatus status;

    @PrePersist
    private void onCreate() {
        startedAt = LocalDateTime.now();
    }

//    @PostUpdate
//    private void onComplete() {
//        if (startedAt != null && completedAt != null) {
//            duration = Duration.between(startedAt, completedAt);
//        }
//    }
}
