package com.vlf.wma.api.features.exercise.exercise_set;

import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup_;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserEntity_;
import com.vlf.wma.api.features.workout.WorkoutBase_;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public interface ExerciseSetSpecifications {

    /**
     * Filters out rows by completion.
     * @param completed
     * @return
     */
    static Specification<ExerciseSet> byCompletion(boolean completed) {
        return (root, query, builder) -> {
            Predicate predicate = builder.equal(root.get(ExerciseSet_.COMPLETED), completed);
            return predicate;
        };
    }

    /**
     * Get exercise sets by exercise.
     * @param exercise
     * @return
     */
    static Specification<ExerciseSet> byExercise(ExerciseEntity exercise) {
        return (root, query, builder) -> {
          var exerciseGroupJoin = root.join(ExerciseSet_.exerciseGroup);
          return builder.equal(exerciseGroupJoin.get(ExerciseGroup_.exerciseEntity), exercise);
        };
    }

    /**
     * Get exercise sets by user.
     */
    static Specification<ExerciseSet> byUser(UserEntity user) {
        return (root, query, builder) -> {
            // TODO: think about assigning userId to every entity to avoid having to do multiple joins.
            var exerciseGroupJoin = root.join(ExerciseSet_.exerciseGroup);
            var workoutBaseJoin = exerciseGroupJoin.join(ExerciseGroup_.parent);
            return builder.equal(workoutBaseJoin.get(WorkoutBase_.user).get(UserEntity_.username), user.getUsername());
        };
    }

    /**
     * Orders rows by COMPLETED_AT in DESC order.
     * @param spec
     * @return
     */
    static Specification<ExerciseSet> orderByCompletedOn(Specification<ExerciseSet> spec) {
        return (root, query, builder) -> {
            query.orderBy(builder.desc(root.get(ExerciseSet_.COMPLETED_AT)));
            return spec.toPredicate(root, query, builder);
        };
    }
}
