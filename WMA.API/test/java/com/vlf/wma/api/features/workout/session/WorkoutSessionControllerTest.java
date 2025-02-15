package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.user.UserStreakService;
import com.vlf.wma.api.features.workout.WorkoutDtoEntityMapper;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WorkoutSessionControllerTest {

    @InjectMocks
    private WorkoutSessionController workoutSessionController;

    @Mock
    private IWorkoutSessionService workoutSessionService;

    @Mock
    private UserStreakService userStreakService;

    @Mock
    private WorkoutDtoEntityMapper mapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllWorkouts_Success() {
        // [Set up]
        List<WorkoutSession> mockSessions = Arrays.asList(new WorkoutSession(), new WorkoutSession());
        List<WorkoutSessionDTO> mockDTOs = Arrays.asList(new WorkoutSessionDTO(), new WorkoutSessionDTO());

        when(workoutSessionService.getAllWorkoutSessions()).thenReturn(mockSessions);
        when(mapper.workoutSessionListEntityToDto(mockSessions)).thenReturn(mockDTOs);

        // [Run]
        ResponseEntity<List<WorkoutSessionDTO>> response = workoutSessionController.getAllWorkouts();

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDTOs, response.getBody());
        verify(workoutSessionService).getAllWorkoutSessions();
        verify(mapper).workoutSessionListEntityToDto(mockSessions);
    }

    @Test
    void getWorkoutsFiltered_Success() {
        // [Set up]
        WorkoutFilterRequestDTO filterDTO = new WorkoutFilterRequestDTO();
        WorkoutFilterRequest filterRequest = new WorkoutFilterRequest();
        List<WorkoutSession> mockSessions = Arrays.asList(new WorkoutSession(), new WorkoutSession());
        List<WorkoutSessionDTO> mockDTOs = Arrays.asList(new WorkoutSessionDTO(), new WorkoutSessionDTO());

        when(mapper.dtoToEntity(filterDTO)).thenReturn(filterRequest);
        when(workoutSessionService.getWorkoutSessionsFiltered(filterRequest)).thenReturn(mockSessions);
        when(mapper.workoutSessionListEntityToDto(mockSessions)).thenReturn(mockDTOs);

        // [Run]
        ResponseEntity<List<WorkoutSessionDTO>> response = null;//workoutSessionController.getWorkoutsFiltered
        // (filterDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDTOs, response.getBody());
        verify(mapper).dtoToEntity(filterDTO);
        verify(workoutSessionService).getWorkoutSessionsFiltered(filterRequest);
        verify(mapper).workoutSessionListEntityToDto(mockSessions);
    }

    @Test
    void startWorkoutSession_Success() {
        // [Set up]
        WorkoutSessionDTO inputDTO = new WorkoutSessionDTO();
        WorkoutSession workoutSession = new WorkoutSession();
        WorkoutSession createdSession = new WorkoutSession();
        WorkoutSessionDTO responseDTO = new WorkoutSessionDTO();

        when(mapper.dtoToEntity(inputDTO)).thenReturn(workoutSession);
        when(workoutSessionService.startWorkoutSession(workoutSession)).thenReturn(createdSession);
        when(mapper.entityToDto(createdSession)).thenReturn(responseDTO);

        // [Run]
        ResponseEntity<WorkoutSessionDTO> response = workoutSessionController.startWorkoutSession(inputDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(mapper).dtoToEntity(inputDTO);
        verify(workoutSessionService).startWorkoutSession(workoutSession);
        verify(mapper).entityToDto(createdSession);
    }

    @Test
    void completeWorkout_Success() {
        // [Set up]
        Long workoutId = 1L;
        WorkoutSession completedSession = new WorkoutSession();
        UserEntity user = new UserEntity();
        completedSession.setUser(user);
        WorkoutSessionDTO responseDTO = new WorkoutSessionDTO();

        when(workoutSessionService.completeWorkoutSession(workoutId)).thenReturn(completedSession);
        when(mapper.entityToDto(completedSession)).thenReturn(responseDTO);

        // [Run]
        ResponseEntity<?> response = workoutSessionController.completeWorkout(workoutId);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(workoutSessionService).completeWorkoutSession(workoutId);
        verify(userStreakService).updateStreakForUser(user);
        verify(mapper).entityToDto(completedSession);
    }

    @Test
    void patchWorkout_Success() {
        // [Set up]
        Long workoutId = 1L;
        WorkoutSessionDTO inputDTO = new WorkoutSessionDTO();
        WorkoutSession workoutSession = new WorkoutSession();
        WorkoutSession patchedSession = new WorkoutSession();
        WorkoutSessionDTO responseDTO = new WorkoutSessionDTO();

        when(mapper.dtoToEntity(inputDTO)).thenReturn(workoutSession);
        when(workoutSessionService.editWorkoutSession(workoutId, workoutSession)).thenReturn(patchedSession);
        when(mapper.entityToDto(patchedSession)).thenReturn(responseDTO);

        // [Run]
        ResponseEntity<WorkoutSessionDTO> response = workoutSessionController.patchWorkout(workoutId, inputDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(mapper).dtoToEntity(inputDTO);
        verify(workoutSessionService).editWorkoutSession(workoutId, workoutSession);
        verify(mapper).entityToDto(patchedSession);
    }

    @Test
    void deleteWorkout_Success() {
        // [Set up]
        Long workoutId = 1L;

        // [Run]
        workoutSessionController.deleteWorkout(workoutId);

        // [Verify]
        verify(workoutSessionService).deleteWorkoutSession(workoutId);
    }
}