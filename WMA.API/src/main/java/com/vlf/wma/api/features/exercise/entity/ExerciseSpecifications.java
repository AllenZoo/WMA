package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.user.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;


public class ExerciseSpecifications {
    public static Specification<ExerciseEntity> withFilters(ExerciseFilterRequest filter) {
        return (root, query, builder) -> {
            Predicate predicate = builder.conjunction(); // Start with a true predicate

            if (filter.getSearchName() != null && !filter.getSearchName().isEmpty()) {
                Predicate namePred = builder.disjunction(); // Start with false

                // Check if searchName is a prefix of name
                namePred = builder.or(namePred, builder.like(builder.lower(root.get("name")),
                        filter.getSearchName().trim().toLowerCase() + "%"));

                // Check if searchName is a prefix of any alias
                Join<ExerciseEntity, String> aliasJoin = root.join("aliases", JoinType.LEFT);
                namePred = builder.or(namePred, builder.like(builder.lower(aliasJoin),
                        filter.getSearchName().trim().toLowerCase() + "%"));

                // Think if we want aliases to also be prefixed match instead of just equality match only
                // namePred = builder.or(namePred, builder.isMember(filter.getSearchName().trim().toLowerCase(), root
                // .get
                // ("aliases")));

                predicate = builder.and(predicate, namePred);
            }

            if (filter.getMuscleGroup() != null) {
                predicate = builder.and(predicate, builder.isMember(filter.getMuscleGroup(), root.get("muscleGroups")));
            }

            if (filter.getDifficulty() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("difficulty"), filter.getDifficulty()));
            }

            if (filter.getRecoveryDemand() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("recoveryDemand"), filter.getRecoveryDemand()));
            }

            if (filter.getEquipmentType() != null) {
                predicate = builder.and(predicate, builder.isMember(filter.getEquipmentType(), root.get("equipmentTypes")));
            }

            return predicate;
        };
    }

    public static Specification<ExerciseEntity> defaultAndSpecified(UserEntity user) {
        return (root, query, builder) -> {
            Predicate predicate = builder.disjunction(); // Start with a false predicate
            predicate = builder.or(predicate, builder.isNull(root.get("user"))); // Default exercises are null

            if (user != null) {
                predicate = builder.or(predicate, builder.equal(root.get("user"), user));
            }

            return predicate;
        };
    }

    public static Specification<ExerciseEntity> specifiedOnly(UserEntity user) {
        return (root, query, builder) -> {
            Predicate predicate = builder.disjunction(); // Start with a false predicate
            predicate = builder.or(predicate, builder.equal(root.get("user"), user));
            return predicate;
        };
    }

    public static Specification<ExerciseEntity> specifiedOnly(Long userId) {
        System.out.println("NOTICE!! THIS FUNCTION HAS NOT BEEN TESTED TO GURANTEE ACCURATE RESULTS!");
        return (root, query, builder) -> {
            Predicate predicate = builder.disjunction(); // Start with a false predicate
            predicate = builder.or(predicate, builder.equal(root.get("user").get("id"), userId));
            return predicate;
        };
    }
}