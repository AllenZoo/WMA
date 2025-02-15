package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.config.TestSecurityConfig;
import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.exercise.entity.ExerciseFilterRequest;
import com.vlf.wma.api.features.exercise.entity.ExerciseRepository;
import com.vlf.wma.api.features.exercise.entity.ExerciseSpecifications;
import com.vlf.wma.api.features.exercise.enums.ExerciseDifficulty;
import com.vlf.wma.api.features.exercise.enums.ExerciseEquipmentType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMetricType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import com.vlf.wma.api.features.user.UserEntity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.List;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Import(TestSecurityConfig.class)
public class ExerciseRepositoryTest {

    @Autowired
    private ExerciseRepository exerciseRepository;

    private static final UserEntity USER1 = UserEntity.builder().userId(8L).build();

    private static final ExerciseEntity EXERCISE1 = ExerciseEntity.builder()
            .aliases(Arrays.asList("BIG BOI CURLS"))
            .demoVideoLink("youtube.com")
            .difficulty(ExerciseDifficulty.GODZILLA)
            .equipmentTypes(Arrays.asList(ExerciseEquipmentType.DUMBBELL))
            .metricTypes(Arrays.asList(ExerciseMetricType.REPS, ExerciseMetricType.WEIGHTED))
            .muscleGroups(Arrays.asList(ExerciseMuscleGroup.ARMS))
            .name("Bicep Curls")
            .user(null)
            .build();

    private static final ExerciseEntity EXERCISE2 = ExerciseEntity.builder()
            .aliases(Arrays.asList("Squatty potty"))
            .demoVideoLink("youtube.com")
            .difficulty(ExerciseDifficulty.GODZILLA)
            .equipmentTypes(Arrays.asList(ExerciseEquipmentType.BARBELL))
            .metricTypes(Arrays.asList(ExerciseMetricType.REPS, ExerciseMetricType.WEIGHTED))
            .muscleGroups(Arrays.asList(ExerciseMuscleGroup.LEGS))
            .name("Barbell Squat")
            .user(null)
            .build();

    @BeforeEach
    public void setUp() {
        exerciseRepository.deleteAll();
        exerciseRepository.save(EXERCISE1);
        exerciseRepository.save(EXERCISE2);
    }

    @Test
    public void ExerciseRepository_GetAll_ReturnsAllExercises() {
        List<ExerciseEntity> res = exerciseRepository.findAll();
        Assertions.assertNotNull(res);
        Assertions.assertEquals(2, res.size());
    }

    @Test
    public void ExerciseRepository_FindByExerciseId_ReturnsExercise() {
        // 1. Create Exercise Entity
        ExerciseEntity createdExercise = ExerciseEntity.builder()
                .aliases(Arrays.asList("BIG BOI CURLS 2"))
                .demoVideoLink("youtube.com")
                .difficulty(ExerciseDifficulty.GODZILLA)
                .equipmentTypes(Arrays.asList(ExerciseEquipmentType.BARBELL))
                .metricTypes(Arrays.asList(ExerciseMetricType.REPS, ExerciseMetricType.WEIGHTED))
                .muscleGroups(Arrays.asList(ExerciseMuscleGroup.ARMS))
                .name("Bicep Curls2")
                .user(null)
                .build();
        // 2. Save so we have a reference to the object and thus the assigned exerciseId.
        ExerciseEntity savedExercise = exerciseRepository.save(createdExercise);

        // 3. PROFIT
        ExerciseEntity foundExercise = exerciseRepository.findById(savedExercise.getId()).orElse(null);
        Assertions.assertNotNull(foundExercise);
        Assertions.assertEquals(savedExercise.getName(), foundExercise.getName());
    }

    @Test
    public void ExerciseRepository_FilterAlias_ReturnsExercise() {
        ExerciseFilterRequest filterRequest = ExerciseFilterRequest.builder()
                .searchName("BIG BOI CURLS")
                .build();
        List<ExerciseEntity> exercises = exerciseRepository.findAll(ExerciseSpecifications.withFilters(filterRequest));

        Assertions.assertNotNull(exercises);
        Assertions.assertEquals(1, exercises.size());
    }

    @Test
    public void ExerciseRepository_GetAllDefault_ReturnsExercise() {
        List<ExerciseEntity> exercises = exerciseRepository.findAll(ExerciseSpecifications.defaultAndSpecified(null));

        Assertions.assertNotNull(exercises);
        Assertions.assertEquals(2, exercises.size());
    }

    @Test
    public void ExerciseRepository_GetOnlySpecifiedByUser_ReturnsExercise() {
        List<ExerciseEntity> exercises = exerciseRepository.findAll(ExerciseSpecifications.specifiedOnly(USER1));

        Assertions.assertNotNull(exercises);
        Assertions.assertEquals(0, exercises.size());
    }

}
