package com.vlf.wma.api.features.workout.template;

import com.vlf.wma.api.exceptions.EntityNotFoundException;
import com.vlf.wma.api.features.workout.WorkoutSpecifications;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.session.WorkoutSession;
import com.vlf.wma.api.util.Patcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class WorkoutTemplateService implements IWorkoutTemplateService{

    @Autowired
    private WorkoutTemplateRepository workoutTemplateRepository;

    @Override
    public List<WorkoutTemplate> getAllWorkoutTemplates() {
        return workoutTemplateRepository.findAll();
    }

    @Override
    public WorkoutTemplate getWorkoutTemplateById(Long workoutTemplateId) {
        return workoutTemplateRepository.findById(workoutTemplateId).get();
    }

    @Override
    public List<WorkoutTemplate> getWorkoutTemplateFiltered(WorkoutFilterRequest filterRequest) {
        return workoutTemplateRepository.findAll(WorkoutSpecifications.workoutTemplateByFilter(filterRequest));
    }

    @Override
    public WorkoutTemplate addWorkoutTemplate(WorkoutTemplate workoutTemplate) {
        return workoutTemplateRepository.save(workoutTemplate);
    }

    @Override
    public WorkoutTemplate editWorkoutTemplate(Long id, WorkoutTemplate patch) {
        WorkoutTemplate existingEntity = workoutTemplateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Workout with id [%s] not found in database!", id)
                ));

        try {
            // Patch the non-collection fields of the workout session
            Patcher.patchEntity(existingEntity, patch);

            // IMPORTANT: do not make existingEntity have a reference to a NEW List<ExerciseGroup> doing so
            //            will cause a persistence error.
            // Patch collection fields of the workout session
            // Handle ExerciseSets if present in the patch
            existingEntity.clearExerciseGroup();

            // Set Display Order and reset parent/bidirectional relation
            AtomicInteger curOrder = new AtomicInteger(1);
            patch.getExerciseGroups().forEach(exerciseGroup -> {
                exerciseGroup.setDisplayOrder(curOrder.getAndIncrement());
                existingEntity.addExerciseGroup(exerciseGroup);
                exerciseGroup.setParent(existingEntity);
            });

            // Use EntityManager to merge the updated entity
            return workoutTemplateRepository.save(existingEntity);
        } catch (IllegalAccessException e) {
            System.out.println("Error during patching: " + e);
            throw new RuntimeException(e); // Re-throw exception to see full stack trace
        }
    }

    @Override
    public void deleteWorkoutTemplate(Long workoutId) {
        workoutTemplateRepository.deleteById(workoutId);
    }

}
