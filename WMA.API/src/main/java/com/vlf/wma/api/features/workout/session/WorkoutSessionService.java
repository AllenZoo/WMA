package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.exceptions.EntityNotFoundException;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.workout.WorkoutSpecifications;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import com.vlf.wma.api.features.workout.execeptions.InvalidWorkoutSessionRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.template.WorkoutTemplateRepository;
import com.vlf.wma.api.util.Patcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static com.vlf.wma.api.features.workout.WorkoutSpecifications.getOngoingSessions;

@Service
public class WorkoutSessionService implements IWorkoutSessionService {
    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private WorkoutTemplateRepository workoutTemplateRepository;

    @Override
    public List<WorkoutSession> getAllWorkoutSessions() {
        return workoutSessionRepository.findAll();
    }
    @Override
    public List<WorkoutSession> getWorkoutSessionsFiltered(WorkoutFilterRequest filterRequest) {
        return workoutSessionRepository.findAll(WorkoutSpecifications.workoutSessionsByFilter(filterRequest));
    }


    @Override
    public WorkoutSession getWorkoutSessionById(Long id) {
        return workoutSessionRepository.findById(id).get();
    }

    @Override
    @Transactional
    public WorkoutSession startWorkoutSession(WorkoutSession workoutSession) {
        UserEntity user = workoutSession.getUser();
        workoutSession.setStatus(WorkoutSessionStatus.ACTIVE);

        if (workoutSessionRepository.findAll(getOngoingSessions(user)).size() > 0) {
            // Existing ongoing session for user!
            throw new InvalidWorkoutSessionRequest(String.format("Could not start workout session for user '%s' with " +
                    "id '%s'" +
                    " since they have a current ongoing session!", user.getUsername(), user.getUserId()));
        }

        WorkoutSession savedWorkoutSession = workoutSessionRepository.save(workoutSession);
        return savedWorkoutSession;
    }

    @Override
    @Transactional
    public WorkoutSession cancelWorkoutSession(Long workoutSessionId) {
        WorkoutSession workoutSession = workoutSessionRepository.findById(workoutSessionId).orElse(null);

        if (workoutSession == null) {
            throw new InvalidWorkoutSessionRequest(String.format("Tried to cancel non-existing workout session with" +
                            " id: %s",
                    workoutSessionId));
        }

        // Check if session is active. We can only modify status == ACTIVE
        if (workoutSession.getStatus() != null && !workoutSession.getStatus().equals(WorkoutSessionStatus.ACTIVE)) {
            return workoutSession;
        }

        // Update cancellation fields
        workoutSession.setIsCompleted(false);
        workoutSession.setStatus(WorkoutSessionStatus.CANCELLED);

        // Save updated fields.
        return workoutSessionRepository.save(workoutSession);
    }

    @Override
    @Transactional
    public WorkoutSession completeWorkoutSession(Long workoutSessionId) {
        WorkoutSession workoutSession = workoutSessionRepository.findById(workoutSessionId).orElse(null);

        if (workoutSession == null) {
            throw new InvalidWorkoutSessionRequest(String.format("Tried to complete non-existing workout session with" +
                            " id: %s",
                    workoutSessionId));
        }

        // Check if session has been previously completed
        if (workoutSession.getIsCompleted() != null && workoutSession.getIsCompleted()) {
            return workoutSession;
        }

        // Update completion fields
        LocalDateTime dateCompleted = LocalDateTime.now();
        workoutSession.setCompletedAt(dateCompleted);
        workoutSession.setDuration(calculateDuration(workoutSession.getStartedAt(), dateCompleted));
        workoutSession.setIsCompleted(true);
        workoutSession.setStatus(WorkoutSessionStatus.COMPLETED);

        // Save updated fields.
        return workoutSessionRepository.save(workoutSession);
    }

    @Override
    @Transactional
    public WorkoutSession editWorkoutSession(Long workoutId, WorkoutSession patch) {
        WorkoutSession existingEntity = workoutSessionRepository.findById(workoutId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Workout with id [%s] not found in database!", workoutId)
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
            return workoutSessionRepository.save(existingEntity);
        } catch (IllegalAccessException e) {
            System.out.println("Error during patching: " + e);
            throw new RuntimeException(e); // Re-throw exception to see full stack trace
        }
    }

    @Override
    public void deleteWorkoutSession(Long workoutId) {
        workoutSessionRepository.deleteById(workoutId);
    }


    private Duration calculateDuration(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("Start time and end time must not be null");
        }
        return Duration.between(startTime, endTime);
    }
}
