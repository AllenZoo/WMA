package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IWorkoutSessionService {
    List<WorkoutSession> getAllWorkoutSessions();
    List<WorkoutSession> getWorkoutSessionsFiltered(WorkoutFilterRequest filterRequest);
    WorkoutSession getWorkoutSessionById(Long id);

    /**
     * Creates an ongoing workout session for user.
     * If user is already in an on-going session, throw an error.
     * @param workoutSession
     * @return
     */
    WorkoutSession startWorkoutSession(WorkoutSession workoutSession);

    /**
     * Cancels an ongoing workout session for user.
     */
    WorkoutSession cancelWorkoutSession(Long workoutSessionId);

    /**
     * Completes an ongoing workout session for user. Logs completed time and duration of workout.
     * If specified workout session is already completed. Do nothing and return the session.
     * @param workoutSessionId
     * @return
     */
    WorkoutSession completeWorkoutSession(Long workoutSessionId);

    /**
     * Modify workout session by ID.
     * @param workoutId
     * @param workoutSession
     * @return
     */
    WorkoutSession editWorkoutSession(Long workoutId, WorkoutSession workoutSession);
    void deleteWorkoutSession(Long workoutId);
}
