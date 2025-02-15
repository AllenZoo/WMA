package com.vlf.wma.api.features.workout.template;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutTemplateRepository extends JpaRepository<WorkoutTemplate, Long>,
        JpaSpecificationExecutor<WorkoutTemplate> {
}
