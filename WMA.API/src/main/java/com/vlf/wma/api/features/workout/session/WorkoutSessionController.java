package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.user.IUserService;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserStreakService;
import com.vlf.wma.api.features.workout.WorkoutDtoEntityMapper;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout/session")
public class WorkoutSessionController {

    @Autowired
    private IWorkoutSessionService workoutSessionService;

    @Autowired
    private IUserService userService;

    @Autowired
    private UserStreakService userStreakService;

    @Autowired
    private WorkoutDtoEntityMapper mapper;

    @GetMapping
    ResponseEntity<List<WorkoutSessionDTO>> getAllWorkouts() {
        List<WorkoutSession> workoutSessions = workoutSessionService.getAllWorkoutSessions();
        List<WorkoutSessionDTO> workoutSessionDTOS = mapper.workoutSessionListEntityToDto(workoutSessions);
        return ResponseEntity.ok(workoutSessionDTOS);
    }

    @PostMapping("/filter")
    ResponseEntity<List<WorkoutSessionDTO>> getWorkoutsFiltered(@RequestBody WorkoutFilterRequestDTO filterRequestDTO,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        if (filterRequestDTO.getUserId() == -1) {
            // Note: @AuthenticationPrincipal will fill out username even if we login with email instead.
            UserEntity user = userService.getUserByUsername(userDetails.getUsername());
            filterRequestDTO.setUserId(user.getUserId());
        }

        WorkoutFilterRequest request = mapper.dtoToEntity(filterRequestDTO);

        List<WorkoutSession> workoutSessions = workoutSessionService.getWorkoutSessionsFiltered(request);
        List<WorkoutSessionDTO> workoutSessionDTOS = mapper.workoutSessionListEntityToDto(workoutSessions);
        return ResponseEntity.ok(workoutSessionDTOS);
    }

    /**
     * Creates a workout TEMPLATE.
     * @param dto
     * @return
     */
    @PostMapping
    ResponseEntity<WorkoutSessionDTO> startWorkoutSession(@RequestBody WorkoutSessionDTO dto) {
        WorkoutSession workoutSession = mapper.dtoToEntity(dto);

        // Mark all Exercise set readonly as false, since we should expect templates to be modified.
        int order = 1;
        for (ExerciseGroup exerciseGroup : workoutSession.getExerciseGroups()) {
            exerciseGroup.setDisplayOrder(order);
            order++;
        }

        WorkoutSession createdWorkoutSession = workoutSessionService.startWorkoutSession(workoutSession);
        WorkoutSessionDTO createdWorkoutSessionDTO = mapper.entityToDto(createdWorkoutSession);
        return ResponseEntity.ok(createdWorkoutSessionDTO);
    }

    /**
     * Request to complete a workout session.
     * @param id
     * @return
     */
    @PatchMapping("/cancel/{id}")
    ResponseEntity<?> cancelWorkout(@PathVariable Long id) {
        WorkoutSession res = workoutSessionService.cancelWorkoutSession(id);
        return ResponseEntity.ok(mapper.entityToDto(res));
    }

    /**
     * Request to complete a workout session.
     * @param id
     * @return
     */
    @PatchMapping("/completion/{id}")
    ResponseEntity<?> completeWorkout(@PathVariable Long id) {
        WorkoutSession res = workoutSessionService.completeWorkoutSession(id);
        userStreakService.updateStreakForUser(res.getUser());
        return ResponseEntity.ok(mapper.entityToDto(res));
    }

    /**
     * Update Workout Session. Called when User edits the Session.
     * @param id
     * @param dto
     * @return
     */
    @PatchMapping("/{id}")
    ResponseEntity<WorkoutSessionDTO> patchWorkout(@PathVariable Long id, @RequestBody WorkoutSessionDTO dto) {
        WorkoutSession workoutSession = mapper.dtoToEntity(dto);
        WorkoutSession patchedWorkoutSession = workoutSessionService.editWorkoutSession(id, workoutSession);
        WorkoutSessionDTO patchedWorkoutSessionDTO = mapper.entityToDto(patchedWorkoutSession);
        return ResponseEntity.ok(patchedWorkoutSessionDTO);
    }

    @DeleteMapping("/{id}")
    void deleteWorkout(@PathVariable Long id) {
        workoutSessionService.deleteWorkoutSession(id);
    }
}
