package com.vlf.wma.api.features.exercise.entity;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long>, JpaSpecificationExecutor<ExerciseEntity> {
    Optional<ExerciseEntity> findById(Long exerciseId);
}
