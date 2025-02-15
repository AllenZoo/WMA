package com.vlf.wma.api.features.workout;


import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.session.WorkoutSession;
import com.vlf.wma.api.features.workout.session.WorkoutSession_;
import com.vlf.wma.api.features.workout.template.WorkoutTemplate;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public interface WorkoutSpecifications {

    /**
     * Orders rows by COMPLETED_AT in DESC order.
     * @param spec
     * @return
     */
    static Specification<WorkoutSession> orderByCompletedOn(Specification<WorkoutSession> spec) {
        return (root, query, builder) -> {
            query.orderBy(builder.desc(root.get(WorkoutSession_.completedAt)));
            return spec.toPredicate(root, query, builder);
        };
    }

    /**
     * Get all workout sessions that are on-going for user.
     * Eg. status == ACTIVE
     * @param user
     * @return
     */
     static Specification<WorkoutSession> getOngoingSessions(UserEntity user) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Null check for user
            if (user == null) {
                throw new IllegalArgumentException("User cannot be null");
            }

            predicates.add(builder.equal(root.get("status"), WorkoutSessionStatus.ACTIVE));
            predicates.add(builder.equal(root.get("user"), user));

            // Optional: Add additional conditions for what constitutes "ongoing"
            // predicates.add(builder.isNull(root.get("completedAt")));

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Filters Workout Sessions by Filter Request.
     * @param filter
     * @return
     */
    static Specification<WorkoutSession> workoutSessionsByFilter(WorkoutFilterRequest filter) {
        return (root, query, builder) -> {
            // Make the query distinct to avoid duplicates from joins
            query.distinct(true);
            return buildFilterPredicate(filter, root, root.get("user"), root.get("name"), builder, query);
        };
    }

    /**
     * Filters Workout Sessions by Filter Request.
     * @param filter
     * @return
     */
    static Specification<WorkoutTemplate> workoutTemplateByFilter(WorkoutFilterRequest filter) {
        return (root, query, builder) -> {
            // Make the query distinct to avoid duplicates from joins
            query.distinct(true);
            return buildFilterPredicate(filter, root, root.get("user"), root.get("name"), builder, query);
        };
    }

    /**
     * private helper to build the filter predicate used by both workout session and template.
     * @param filter
     * @param userPath
     * @param namePath
     * @param builder
     * @return
     */
    private static <T> Predicate buildFilterPredicate(
            WorkoutFilterRequest filter,
            Root<T> root,
            Path<?> userPath,
            Path<String> namePath,
            CriteriaBuilder builder,
            CriteriaQuery<?> query) {

        List<Predicate> predicates = new ArrayList<>();

        if (filter.getUser() != null) {
            predicates.add(builder.equal(userPath, filter.getUser()));
        }

        if (filter.getSearchString() != null && !filter.getSearchString().trim().isEmpty()) {
            predicates.add(builder.like(
                    builder.lower(namePath),
                    "%" + filter.getSearchString().toLowerCase() + "%"
            ));
        }

        if (filter.getSessionStatus() != null) {
            predicates.add(builder.equal(root.get("status"), filter.getSessionStatus()));
        }

        // Handle muscle groups filtering
        if (filter.getMuscleGroups() != null && !filter.getMuscleGroups().isEmpty()) {
            // Join to exercise groups
            Join<T, ExerciseGroup> exerciseGroupsJoin = root.join("exerciseGroups", JoinType.LEFT);

            Join<ExerciseGroup, ExerciseEntity> exerciseJoin = exerciseGroupsJoin.join("exerciseEntity", JoinType.LEFT);

            // Join to the muscle_groups collection table
            Join<ExerciseEntity, Object> muscleGroupJoin = exerciseJoin.join("muscleGroups", JoinType.LEFT);

            // Create a predicate for muscle groups
            predicates.add(muscleGroupJoin.in(filter.getMuscleGroups()));
        }

        if (filter.getMaxNumExercise() != null) {
            predicates.add(builder.le(root.get("maxNumExercise"), filter.getMaxNumExercise()));
        }

        // Handles sorting by date if necessary. (only for Workouts that have field 'completedAt')
        if (filter.getMostRecentFirst() != null) {
            try {
                // Check if the completedAt field exists in the entity
                root.getModel().getAttribute("completedAt");

                Path<LocalDateTime> completedAtPath = root.get("completedAt");
                if (filter.getMostRecentFirst()) {
                    query.orderBy(builder.desc(completedAtPath));
                } else {
                    query.orderBy(builder.asc(completedAtPath));
                }
            } catch (IllegalArgumentException e) {
                // Field doesn't exist - skip sorting
                // You might want to log this situation
                // logger.debug("Sorting by completedAt was requested but the entity doesn't have this field");
            }
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
