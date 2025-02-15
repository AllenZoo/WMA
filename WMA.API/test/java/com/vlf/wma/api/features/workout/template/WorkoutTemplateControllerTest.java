package com.vlf.wma.api.features.workout.template;

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

class WorkoutTemplateControllerTest {

    @InjectMocks
    private WorkoutTemplateController workoutTemplateController;

    @Mock
    private IWorkoutTemplateService templateService;

    @Mock
    private WorkoutDtoEntityMapper mapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllWorkouts_Success() {
        // [Set up]
        List<WorkoutTemplate> mockTemplates = Arrays.asList(new WorkoutTemplate(), new WorkoutTemplate());
        List<WorkoutTemplateDTO> mockDTOs = Arrays.asList(new WorkoutTemplateDTO(), new WorkoutTemplateDTO());

        when(templateService.getAllWorkoutTemplates()).thenReturn(mockTemplates);
        when(mapper.workoutTemplateListEntityToDto(mockTemplates)).thenReturn(mockDTOs);

        // [Run]
        ResponseEntity<List<WorkoutTemplateDTO>> response = workoutTemplateController.getAllWorkouts();

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDTOs, response.getBody());
        verify(templateService).getAllWorkoutTemplates();
        verify(mapper).workoutTemplateListEntityToDto(mockTemplates);
    }

    @Test
    void getWorkoutsFiltered_Success() {
        // [Set up]
        WorkoutFilterRequestDTO filterDTO = new WorkoutFilterRequestDTO();
        WorkoutFilterRequest filterRequest = new WorkoutFilterRequest();
        List<WorkoutTemplate> mockTemplates = Arrays.asList(new WorkoutTemplate(), new WorkoutTemplate());
        List<WorkoutTemplateDTO> mockDTOs = Arrays.asList(new WorkoutTemplateDTO(), new WorkoutTemplateDTO());

        when(mapper.dtoToEntity(filterDTO)).thenReturn(filterRequest);
        when(templateService.getWorkoutTemplateFiltered(filterRequest)).thenReturn(mockTemplates);
        when(mapper.workoutTemplateListEntityToDto(mockTemplates)).thenReturn(mockDTOs);

        // [Run]
        ResponseEntity<List<WorkoutTemplateDTO>> response = workoutTemplateController.getWorkoutsFiltered(filterDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDTOs, response.getBody());
        verify(mapper).dtoToEntity(filterDTO);
        verify(templateService).getWorkoutTemplateFiltered(filterRequest);
        verify(mapper).workoutTemplateListEntityToDto(mockTemplates);
    }

    @Test
    void createWorkoutTemplate_Success() {
        // [Set up]
        WorkoutTemplateDTO inputDTO = new WorkoutTemplateDTO();
        WorkoutTemplate workoutTemplate = new WorkoutTemplate();
        WorkoutTemplate createdTemplate = new WorkoutTemplate();
        WorkoutTemplateDTO responseDTO = new WorkoutTemplateDTO();

        when(mapper.dtoToEntity(inputDTO)).thenReturn(workoutTemplate);
        when(templateService.addWorkoutTemplate(workoutTemplate)).thenReturn(createdTemplate);
        when(mapper.entityToDto(createdTemplate)).thenReturn(responseDTO);

        // [Run]
        ResponseEntity<WorkoutTemplateDTO> response = workoutTemplateController.createWorkoutTemplate(inputDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(mapper).dtoToEntity(inputDTO);
        verify(templateService).addWorkoutTemplate(workoutTemplate);
        verify(mapper).entityToDto(createdTemplate);
    }

    @Test
    void patchWorkout_Success() {
        // [Set up]
        Long templateId = 1L;
        WorkoutTemplateDTO inputDTO = new WorkoutTemplateDTO();
        WorkoutTemplate workoutTemplate = new WorkoutTemplate();
        WorkoutTemplate patchedTemplate = new WorkoutTemplate();
        WorkoutTemplateDTO responseDTO = new WorkoutTemplateDTO();

        when(mapper.dtoToEntity(inputDTO)).thenReturn(workoutTemplate);
        when(templateService.editWorkoutTemplate(templateId, workoutTemplate)).thenReturn(patchedTemplate);
        when(mapper.entityToDto(patchedTemplate)).thenReturn(responseDTO);

        // [Run]
        ResponseEntity<WorkoutTemplateDTO> response = workoutTemplateController.patchWorkout(templateId, inputDTO);

        // [Verify]
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(mapper).dtoToEntity(inputDTO);
        verify(templateService).editWorkoutTemplate(templateId, workoutTemplate);
        verify(mapper).entityToDto(patchedTemplate);
    }

    @Test
    void deleteWorkout_Success() {
        // [Set up]
        Long templateId = 1L;

        // [Run]
        workoutTemplateController.deleteWorkout(templateId);

        // [Verify]
        verify(templateService).deleteWorkoutTemplate(templateId);
    }
}