package com.vlf.wma.api.features.workout.template;

import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;

import java.util.List;

public interface IWorkoutTemplateService {
    List<WorkoutTemplate> getAllWorkoutTemplates();
    WorkoutTemplate getWorkoutTemplateById(Long workoutTemplateId);
    List<WorkoutTemplate> getWorkoutTemplateFiltered(WorkoutFilterRequest filterRequest);
    WorkoutTemplate addWorkoutTemplate(WorkoutTemplate workoutTemplate);
    WorkoutTemplate editWorkoutTemplate(Long id, WorkoutTemplate patch);
    void deleteWorkoutTemplate(Long workoutId);
}
