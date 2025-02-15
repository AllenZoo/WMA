package com.vlf.wma.api.features.workout.template;

import com.vlf.wma.api.features.workout.WorkoutDtoEntityMapper;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout/template")
public class WorkoutTemplateController {
    @Autowired
    private IWorkoutTemplateService templateService;

    @Autowired
    private WorkoutDtoEntityMapper mapper;

    @GetMapping
    ResponseEntity<List<WorkoutTemplateDTO>> getAllWorkouts() {
        List<WorkoutTemplate> workoutTemplates = templateService.getAllWorkoutTemplates();
        List<WorkoutTemplateDTO> workoutSessionDTOS = mapper.workoutTemplateListEntityToDto(workoutTemplates);
        return ResponseEntity.ok(workoutSessionDTOS);
    }

    @PostMapping("/filter")
    ResponseEntity<List<WorkoutTemplateDTO>> getWorkoutsFiltered(@RequestBody WorkoutFilterRequestDTO filterRequestDTO) {
        WorkoutFilterRequest request = mapper.dtoToEntity(filterRequestDTO);
        List<WorkoutTemplate> workoutTemplates = templateService.getWorkoutTemplateFiltered(request);
        List<WorkoutTemplateDTO> workoutSessionDTOS = mapper.workoutTemplateListEntityToDto(workoutTemplates);
        return ResponseEntity.ok(workoutSessionDTOS);
    }

    /**
     * Creates a workout TEMPLATE.
     * @param dto
     * @return
     */
    @PostMapping
    ResponseEntity<WorkoutTemplateDTO> createWorkoutTemplate(@RequestBody WorkoutTemplateDTO dto) {
        WorkoutTemplate workoutTemplate = mapper.dtoToEntity(dto);

        int order = 1;
        for (ExerciseGroup exerciseGroup : workoutTemplate.getExerciseGroups()) {
            exerciseGroup.setDisplayOrder(order);
            order++;
        }

        WorkoutTemplate createdWorkoutSession = templateService.addWorkoutTemplate(workoutTemplate);
        WorkoutTemplateDTO createdWorkoutSessionDTO = mapper.entityToDto(createdWorkoutSession);
        return ResponseEntity.ok(createdWorkoutSessionDTO);
    }


    /**
     * Update Workout Session. Called when User edits the Session.
     * @param id
     * @param dto
     * @return
     */
    @PatchMapping("/{id}")
    ResponseEntity<WorkoutTemplateDTO> patchWorkout(@PathVariable Long id, @RequestBody WorkoutTemplateDTO dto) {
        WorkoutTemplate workoutTemplate = mapper.dtoToEntity(dto);
        WorkoutTemplate patchedTemplate = templateService.editWorkoutTemplate(id, workoutTemplate);
        WorkoutTemplateDTO patchedTemplateDTO = mapper.entityToDto(patchedTemplate);
        return ResponseEntity.ok(patchedTemplateDTO);
    }

    @DeleteMapping("/{id}")
    void deleteWorkout(@PathVariable Long id) {
        templateService.deleteWorkoutTemplate(id);
    }
}
