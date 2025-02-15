package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.exceptions.EntityNotFoundException;

import com.vlf.wma.api.features.workout.execeptions.InvalidWorkoutSessionRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;
import resources.MockSource;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class WorkoutSessionServiceTest {

    @InjectMocks
    private WorkoutSessionService workoutSessionService;

    @Mock
    private WorkoutSessionRepository workoutSessionRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllWorkoutSessions() {
        List<WorkoutSession> mockWorkoutSessions = Arrays.asList(new WorkoutSession(), new WorkoutSession());
        when(workoutSessionRepository.findAll()).thenReturn(mockWorkoutSessions);

        List<WorkoutSession> result = workoutSessionService.getAllWorkoutSessions();

        assertEquals(2, result.size());
        verify(workoutSessionRepository).findAll();
    }

    @Test
    void getWorkoutSessionsFiltered() {
        WorkoutFilterRequest filterRequest = new WorkoutFilterRequest();
        List<WorkoutSession> mockWorkoutSessions = Arrays.asList(new WorkoutSession(), new WorkoutSession());
        when(workoutSessionRepository.findAll(any(Specification.class))).thenReturn(mockWorkoutSessions);

        List<WorkoutSession> result = workoutSessionService.getWorkoutSessionsFiltered(filterRequest);

        assertEquals(2, result.size());
        verify(workoutSessionRepository).findAll(any(Specification.class));
    }

    @Test
    void getWorkoutSessionById() {
        Long id = 1L;
        WorkoutSession mockWorkoutSession = WorkoutSession.builder().id(id).build();
        when(workoutSessionRepository.findById(id)).thenReturn(Optional.of(mockWorkoutSession));

        WorkoutSession result = workoutSessionService.getWorkoutSessionById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(workoutSessionRepository).findById(id);
    }

    @Test
    void startWorkoutSession_NonOngoing() {
        WorkoutSession workoutSession = MockSource.WORKOUT_SESSION_PRE_SAVE;
        WorkoutSession postSave = MockSource.WORKOUT_SESSION_POST_SAVE;

        // [Set up]
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(postSave);

        // Simulate no ongoing session by returning empty list
        when(workoutSessionRepository.findAll(any(Specification.class)))
                .thenReturn(new ArrayList());

        // [Run]
        WorkoutSession result = workoutSessionService.startWorkoutSession(workoutSession);

        // [Verify]
        assertNotNull(result);
        verify(workoutSessionRepository).save(workoutSession);
        assertEquals(postSave.getId(), result.getId());
    }

    @Test
    void startWorkoutSession_HasOngoing() {
        WorkoutSession workoutSession = MockSource.WORKOUT_SESSION_PRE_SAVE;

        // [Set up]
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(workoutSession);

        // Simulate an ongoing session by returning a non-empty list
        when(workoutSessionRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(new WorkoutSession()));

        try {
            // [Run]
            WorkoutSession result = workoutSessionService.startWorkoutSession(workoutSession);

            // If no exception is thrown, fail the test
            Assertions.fail("Expected InvalidWorkoutSessionRequest Exception to be thrown. Got nothing thrown.");
        } catch (InvalidWorkoutSessionRequest e) {
            // Expected exception - no action needed
        } catch (Exception ex) {
            // Fail the test for any unexpected exceptions
            Assertions.fail("Unexpected exception thrown: " + ex.getMessage());
        }

        // [Verify]
        verify(workoutSessionRepository, never()).save(workoutSession); // Save should not be called if there's an ongoing session
    }

    @Test
    void editWorkout() {
        WorkoutSession existingWorkoutSession = MockSource.WORKOUT_SESSION_POST_SAVE;
        WorkoutSession patchWorkoutSession = MockSource.WORKOUT_SESSION_PATCH;

        WorkoutSession postPatch = MockSource.WORKOUT_SESSION_POST_PATCH;

        when(workoutSessionRepository.findById(existingWorkoutSession.getId())).thenReturn(Optional.of(existingWorkoutSession));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(postPatch);

        WorkoutSession result = workoutSessionService.editWorkoutSession(existingWorkoutSession.getId(), patchWorkoutSession);

        assertNotNull(result);
        assertEquals(1, result.getExerciseGroups().size());
        verify(workoutSessionRepository).findById(existingWorkoutSession.getId());
        verify(workoutSessionRepository).save(existingWorkoutSession);
    }

    @Test
    void editWorkout_notFound() {
        Long workoutId = 1L;
        WorkoutSession patchWorkoutSession = new WorkoutSession();

        when(workoutSessionRepository.findById(workoutId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> workoutSessionService.editWorkoutSession(workoutId, patchWorkoutSession));
    }

    @Test
    void completeWorkoutSession_Success() {
        // [Set up]
        LocalDateTime startTime = LocalDateTime.now().minusHours(1);
        WorkoutSession workoutSession = WorkoutSession.builder()
                .id(1L)
                .startedAt(startTime)
                .isCompleted(false)
                .build();

        when(workoutSessionRepository.findById(1L)).thenReturn(Optional.of(workoutSession));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(workoutSession);

        // [Run]
        WorkoutSession result = workoutSessionService.completeWorkoutSession(1L);

        // [Verify]
        assertNotNull(result);
        assertTrue(result.getIsCompleted());
        assertNotNull(result.getCompletedAt());
        assertNotNull(result.getDuration());
        verify(workoutSessionRepository).findById(1L);
        verify(workoutSessionRepository).save(workoutSession);
    }

    @Test
    void completeWorkoutSession_NonExistent() {
        // [Set up]
        when(workoutSessionRepository.findById(1L)).thenReturn(Optional.empty());

        // [Run & Verify]
        InvalidWorkoutSessionRequest exception = assertThrows(
                InvalidWorkoutSessionRequest.class,
                () -> workoutSessionService.completeWorkoutSession(1L)
        );

        assertEquals(
                "Tried to complete non-existing workout session with id: 1",
                exception.getMessage()
        );
        verify(workoutSessionRepository).findById(1L);
        verify(workoutSessionRepository, never()).save(any(WorkoutSession.class));
    }

    @Test
    void completeWorkoutSession_AlreadyCompleted() {
        // [Set up]
        LocalDateTime startTime = LocalDateTime.now().minusHours(1);
        LocalDateTime completedTime = LocalDateTime.now().minusMinutes(30);
        Duration duration = Duration.between(startTime, completedTime);

        WorkoutSession workoutSession = WorkoutSession.builder()
                .id(1L)
                .startedAt(startTime)
                .completedAt(completedTime)
                .duration(duration)
                .isCompleted(true)
                .build();

        when(workoutSessionRepository.findById(1L)).thenReturn(Optional.of(workoutSession));

        // [Run]
        WorkoutSession result = workoutSessionService.completeWorkoutSession(1L);

        // [Verify]
        assertNotNull(result);
        assertEquals(completedTime, result.getCompletedAt());
        assertEquals(duration, result.getDuration());
        verify(workoutSessionRepository).findById(1L);
        verify(workoutSessionRepository, never()).save(any(WorkoutSession.class));
    }

    @Test
    void deleteWorkout() {
        Long workoutId = 1L;

        workoutSessionService.deleteWorkoutSession(workoutId);

        verify(workoutSessionRepository).deleteById(workoutId);
    }
}
