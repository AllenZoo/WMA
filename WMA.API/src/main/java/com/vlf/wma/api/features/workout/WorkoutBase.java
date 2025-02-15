package com.vlf.wma.api.features.workout;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "workout_type", discriminatorType = DiscriminatorType.STRING)
public  class WorkoutBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many Workout Templates to One User.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity user;

    /**
     * One Workout Session to Many Exercise Groups
     */
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "parent")
    @CollectionTable(name = "exercise_groups", joinColumns = @JoinColumn(name = "workout_id"))
    @Column(name = "exercise_group")
    private List<ExerciseGroup> exerciseGroups = new ArrayList<>();

    public void addExerciseGroup(ExerciseGroup exerciseGroup) {
        exerciseGroups.add(exerciseGroup);
    }

    public void removeExerciseGroup(ExerciseGroup exerciseGroup) {
        exerciseGroups.remove(exerciseGroup);
    }

    public void clearExerciseGroup() {
        exerciseGroups.clear();
    }
}
