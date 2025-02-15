package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.exercise.entity.*;
import com.vlf.wma.api.features.exercise.enums.ExerciseDifficulty;
import com.vlf.wma.api.features.exercise.enums.ExerciseEquipmentType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMetricType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.util.Patcher;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class ExerciseServiceTest {
    @Mock
    private ExerciseRepository exerciseRepo;
    @InjectMocks
    private ExerciseService exerciseService;

    private static final UserEntity USER1 = UserEntity.builder().userId(8L).build();
    private static final Long EXERCISE_ID = 1L;

    private static final ExerciseEntity EXERCISE1 = ExerciseEntity.builder()
            .aliases(Arrays.asList("BIG BOI CURLS"))
            .demoVideoLink("youtube.com")
            .difficulty(ExerciseDifficulty.GODZILLA)
            .equipmentTypes(Arrays.asList(ExerciseEquipmentType.DUMBBELL))
            .metricTypes(Arrays.asList(ExerciseMetricType.REPS, ExerciseMetricType.WEIGHTED))
            .muscleGroups(Arrays.asList(ExerciseMuscleGroup.ARMS))
            .name("Bicep Curls")
            //.userId(USER1_ID)
            .build();

    private static final ExerciseEntity EXERCISE2 = ExerciseEntity.builder()
            .aliases(Arrays.asList("Squatty potty"))
            .demoVideoLink("youtube.com")
            .difficulty(ExerciseDifficulty.GODZILLA)
            .equipmentTypes(Arrays.asList(ExerciseEquipmentType.BARBELL))
            .metricTypes(Arrays.asList(ExerciseMetricType.REPS, ExerciseMetricType.WEIGHTED))
            .muscleGroups(Arrays.asList(ExerciseMuscleGroup.LEGS))
            .name("Barbell Squat")
            //.userId(DEFAULT_USER_ID)
            .build();

    private static final ExerciseEntity PATCH = ExerciseEntity.builder()
            .name("Updated Bicep Curls")
            .build();

    @Test
    public void ExerciseService_GetAllExercises_ReturnsExercises() {
        when(exerciseRepo.findAll()).thenReturn(Arrays.asList(EXERCISE1, EXERCISE2));
        List<ExerciseEntity> res = exerciseService.getAllExercises();

        Assertions.assertNotNull(res);
        Assertions.assertEquals(2, res.size());
    }

    @Test
    public void ExerciseService_GetDefaultExercises_ReturnsExercises() {
        // Arrange
        ExerciseEntity exercise1 = new ExerciseEntity();
        List<ExerciseEntity> exercises = List.of(exercise1);
        Specification<ExerciseEntity> spec = ExerciseSpecifications.defaultAndSpecified(null);
        try (MockedStatic<ExerciseSpecifications> exerciseSpecMock = Mockito.mockStatic(ExerciseSpecifications.class)) {
            exerciseSpecMock.when(() -> ExerciseSpecifications.defaultAndSpecified(null)).thenReturn(spec);
            when(exerciseRepo.findAll(spec)).thenReturn(exercises);

            // Act
            List<ExerciseEntity> result = exerciseService.getDefaultExercises();

            // Assert
            Assertions.assertEquals(1, result.size());
            verify(exerciseRepo, times(1)).findAll(spec);
        }
    }


    @Test
    public void ExerciseService_GetExerciseByUserID_ReturnsExercise() {
        // Arrange
        ExerciseEntity exercise1 = new ExerciseEntity();
        List<ExerciseEntity> exercises = List.of(exercise1);
        Specification<ExerciseEntity> spec = ExerciseSpecifications.specifiedOnly(USER1.getUserId());
        try (MockedStatic<ExerciseSpecifications> exerciseSpecMock = Mockito.mockStatic(ExerciseSpecifications.class)) {
            exerciseSpecMock.when(() -> ExerciseSpecifications.specifiedOnly(USER1.getUserId())).thenReturn(spec);
            when(exerciseRepo.findAll(spec)).thenReturn(exercises);

            // Act
            List<ExerciseEntity> result = exerciseService.getExerciseByUserId(USER1.getUserId());

            // Assert
            Assertions.assertEquals(1, result.size());
            verify(exerciseRepo, times(1)).findAll(spec);
        }
    }

    @Test
    public void ExerciseService_GetExerciseByUser_ReturnsExercise() {
        // Arrange
        ExerciseEntity exercise1 = new ExerciseEntity();
        List<ExerciseEntity> exercises = List.of(exercise1);
        Specification<ExerciseEntity> spec = ExerciseSpecifications.specifiedOnly(USER1);


        try (MockedStatic<ExerciseSpecifications> exerciseSpecMock = Mockito.mockStatic(ExerciseSpecifications.class)) {
            exerciseSpecMock.when(() -> ExerciseSpecifications.specifiedOnly(USER1)).thenReturn(spec);
            when(exerciseRepo.findAll(spec)).thenReturn(exercises);

            // Act
            List<ExerciseEntity> result = exerciseService.getExerciseByUser(USER1);

            // Assert
            Assertions.assertEquals(1, result.size());
            verify(exerciseRepo, times(1)).findAll(Mockito.any(Specification.class));
        }
    }

    @Test
    public void ExerciseService_GetExerciseByExerciseID_ReturnsExercise() {
        Long exerciseID = 1L;
        when(exerciseRepo.findById(exerciseID)).thenReturn(
                Optional.of(EXERCISE1)
        );
        ExerciseEntity exerciseEntity = exerciseService.getExerciseById(exerciseID);

        Assertions.assertNotNull(exerciseEntity);
        Assertions.assertEquals(EXERCISE1.getName(), exerciseEntity.getName());

    }

    @Test
    @MockitoSettings(strictness = Strictness.LENIENT)
    public void ExerciseService_FilterExerciseAlias_ReturnExercise() {
        ExerciseFilterRequest filterRequest = ExerciseFilterRequest.builder()
                .searchName("BIG BOI CURLS")
                .build();

        when(exerciseRepo.findAll(Mockito.any(Specification.class))).thenReturn(List.of(EXERCISE1));
        List<ExerciseEntity> exerciseEntities = exerciseService.getExercises(filterRequest);

        Assertions.assertNotNull(exerciseEntities);
        Assertions.assertEquals(1, exerciseEntities.size());
    }

    @Test
    public void ExerciseService_PatchExercise_SuccessfulPatch() throws IllegalAccessException {
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.of(EXERCISE1));
        ExerciseEntity result = exerciseService.patchExercise(EXERCISE_ID, PATCH);

        verify(exerciseRepo, times(1)).save(EXERCISE1);
        Assertions.assertEquals("Updated Bicep Curls", result.getName());
    }

    // TODO: when fixed, uncomment
//    @Test
//    public void ExerciseService_PatchExercise_EntityNotFound() throws IllegalAccessException {
//        when(exerciseRepo.findByExerciseId(EXERCISE_ID)).thenReturn(Optional.empty());
//
//        Assertions.assertThrows(NoSuchElementException.class, () -> {
//            exerciseService.patchExercise(EXERCISE_ID, PATCH);
//        });
//
//        verify(exerciseRepo, never()).save(any());
//    }

    @Test
    public void ExerciseService_PatchExercise_PatchingThrowsException() throws IllegalAccessException {
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.of(EXERCISE1));

        try (MockedStatic<Patcher> patcher = Mockito.mockStatic(Patcher.class)) {
            patcher.when(() -> Patcher.patchEntity(EXERCISE1, PATCH)).thenThrow(new IllegalAccessException());
            exerciseService.patchExercise(EXERCISE_ID, PATCH);
        }

        verify(exerciseRepo, never()).save(EXERCISE1);
    }
}
