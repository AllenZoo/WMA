package com.vlf.wma.api.features.workout.template;

import com.vlf.wma.api.exceptions.EntityNotFoundException;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WorkoutTemplateServiceTest {

    @InjectMocks
    private WorkoutTemplateService workoutTemplateService;

    @Mock
    private WorkoutTemplateRepository workoutTemplateRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllWorkoutTemplates_Success() {
        // [Set up]
        List<WorkoutTemplate> expectedTemplates = Arrays.asList(
                new WorkoutTemplate(),
                new WorkoutTemplate()
        );
        when(workoutTemplateRepository.findAll()).thenReturn(expectedTemplates);

        // [Run]
        List<WorkoutTemplate> result = workoutTemplateService.getAllWorkoutTemplates();

        // [Verify]
        assertEquals(expectedTemplates.size(), result.size());
        verify(workoutTemplateRepository).findAll();
    }

    @Test
    void getWorkoutTemplateById_Success() {
        // [Set up]
        Long templateId = 1L;
        WorkoutTemplate expectedTemplate = WorkoutTemplate.builder()
                .id(templateId)
                .name("Test Template")
                .build();
        when(workoutTemplateRepository.findById(templateId)).thenReturn(Optional.of(expectedTemplate));

        // [Run]
        WorkoutTemplate result = workoutTemplateService.getWorkoutTemplateById(templateId);

        // [Verify]
        assertNotNull(result);
        assertEquals(templateId, result.getId());
        assertEquals("Test Template", result.getName());
        verify(workoutTemplateRepository).findById(templateId);
    }

    @Test
    void getWorkoutTemplateFiltered_Success() {
        // [Set up]
        WorkoutFilterRequest filterRequest = new WorkoutFilterRequest();
        List<WorkoutTemplate> expectedTemplates = Arrays.asList(
                new WorkoutTemplate(),
                new WorkoutTemplate()
        );
        when(workoutTemplateRepository.findAll(any(Specification.class))).thenReturn(expectedTemplates);

        // [Run]
        List<WorkoutTemplate> result = workoutTemplateService.getWorkoutTemplateFiltered(filterRequest);

        // [Verify]
        assertEquals(expectedTemplates.size(), result.size());
        verify(workoutTemplateRepository).findAll(any(Specification.class));
    }

    @Test
    void addWorkoutTemplate_Success() {
        // [Set up]
        WorkoutTemplate template = WorkoutTemplate.builder()
                .name("New Template")
                .build();
        when(workoutTemplateRepository.save(template)).thenReturn(template);

        // [Run]
        WorkoutTemplate result = workoutTemplateService.addWorkoutTemplate(template);

        // [Verify]
        assertNotNull(result);
        assertEquals("New Template", result.getName());
        verify(workoutTemplateRepository).save(template);
    }

    @Test
    void editWorkoutTemplate_Success() {
        // [Set up]
        Long templateId = 1L;
        WorkoutTemplate existingTemplate = WorkoutTemplate.builder()
                .id(templateId)
                .name("Original Name")
                .exerciseGroups(new ArrayList<>())
                .build();

        WorkoutTemplate patchTemplate = WorkoutTemplate.builder()
                .name("Updated Name")
                .exerciseGroups(new ArrayList<>())
                .build();

        ExerciseGroup exerciseGroup = new ExerciseGroup();
        patchTemplate.addExerciseGroup(exerciseGroup);

        when(workoutTemplateRepository.findById(templateId)).thenReturn(Optional.of(existingTemplate));
        when(workoutTemplateRepository.save(any(WorkoutTemplate.class))).thenReturn(existingTemplate);

        // [Run]
        WorkoutTemplate result = workoutTemplateService.editWorkoutTemplate(templateId, patchTemplate);

        // [Verify]
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals(1, result.getExerciseGroups().size());
        verify(workoutTemplateRepository).findById(templateId);
        verify(workoutTemplateRepository).save(any(WorkoutTemplate.class));
    }

    @Test
    void editWorkoutTemplate_NotFound() {
        // [Set up]
        Long templateId = 1L;
        WorkoutTemplate patchTemplate = new WorkoutTemplate();
        when(workoutTemplateRepository.findById(templateId)).thenReturn(Optional.empty());

        // [Run & Verify]
        assertThrows(EntityNotFoundException.class,
                () -> workoutTemplateService.editWorkoutTemplate(templateId, patchTemplate));
        verify(workoutTemplateRepository).findById(templateId);
        verify(workoutTemplateRepository, never()).save(any(WorkoutTemplate.class));
    }

    @Test
    void deleteWorkoutTemplate_Success() {
        // [Set up]
        Long templateId = 1L;

        // [Run]
        workoutTemplateService.deleteWorkoutTemplate(templateId);

        // [Verify]
        verify(workoutTemplateRepository).deleteById(templateId);
    }
}