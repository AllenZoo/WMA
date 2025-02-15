package com.vlf.wma.api.features.exercise.exercise_set;

import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.user.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseSetServiceTest {

    @Mock
    private ExerciseSetRepository exerciseSetRepository;

    @InjectMocks
    private ExerciseSetService exerciseSetService;

    private ExerciseEntity exerciseEntity;
    private UserEntity user;
    private ExerciseGroup exerciseGroup;
    private List<ExerciseSet> expectedSets;

    @BeforeEach
    void setUp() {
        // Set up User
        user = new UserEntity();
        user.setUserId(1L);

        // Set up Exercise
        exerciseEntity = ExerciseEntity.builder()
                .id(1L)
                .name("Bench Press")
                .user(user)
                .build();

        // Set up Exercise Group
        exerciseGroup = ExerciseGroup.builder()
                .id(1L)
                .exerciseEntity(exerciseEntity)
                .displayOrder(1)
                .build();

        // Set up Exercise Sets
        ExerciseSet set1 = ExerciseSet.builder()
                .id(1L)
                .exerciseGroup(exerciseGroup)
                .reps(10)
                .weightKG(60.0)
                .completed(true)
                .completedAt(LocalDateTime.now().minusHours(1))
                .build();

        ExerciseSet set2 = ExerciseSet.builder()
                .id(2L)
                .exerciseGroup(exerciseGroup)
                .reps(8)
                .weightKG(65.0)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();

        expectedSets = Arrays.asList(set1, set2);
        exerciseGroup.setExerciseSetList(expectedSets);
    }

    @Test
    void getCompletedSets_ShouldReturnCompletedSetsForExerciseAndUser() {
        // Arrange
        when(exerciseSetRepository.findAll(any(Specification.class)))
                .thenReturn(expectedSets);

        // Act
        List<ExerciseSet> actualSets = exerciseSetService.getCompletedSets(exerciseEntity, user);

        // Assert
        assertEquals(expectedSets, actualSets);
        verify(exerciseSetRepository, times(1)).findAll(any(Specification.class));

        // Verify the returned sets have the correct relationships
        actualSets.forEach(set -> {
            assertTrue(set.getCompleted());
            assertNotNull(set.getCompletedAt());
            assertEquals(exerciseEntity, set.getExerciseGroup().getExerciseEntity());
            assertEquals(user, set.getExerciseGroup().getExerciseEntity().getUser());
        });
    }

    @Test
    void getCompletedSets_ShouldReturnEmptyList_WhenNoCompletedSets() {
        // Arrange
        when(exerciseSetRepository.findAll(any(Specification.class)))
                .thenReturn(List.of());

        // Act
        List<ExerciseSet> actualSets = exerciseSetService.getCompletedSets(exerciseEntity, user);

        // Assert
        assertTrue(actualSets.isEmpty());
        verify(exerciseSetRepository, times(1)).findAll(any(Specification.class));
    }

    @Test
    void getCompletedSets_ShouldHandleNullUser() {
        // Arrange
        // Testing for default exercises which have no user
        exerciseEntity.setUser(null);

        when(exerciseSetRepository.findAll(any(Specification.class)))
                .thenReturn(expectedSets);

        // Act
        List<ExerciseSet> actualSets = exerciseSetService.getCompletedSets(exerciseEntity, null);

        // Assert
        assertFalse(actualSets.isEmpty());
        verify(exerciseSetRepository, times(1)).findAll(any(Specification.class));
    }
}