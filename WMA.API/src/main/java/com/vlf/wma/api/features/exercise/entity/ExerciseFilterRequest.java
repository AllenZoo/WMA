package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.exercise.enums.ExerciseDifficulty;
import com.vlf.wma.api.features.exercise.enums.ExerciseEquipmentType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import com.vlf.wma.api.features.exercise.enums.ExerciseRecoveryDemand;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ExerciseFilterRequest {
    private String searchName;
    private ExerciseMuscleGroup muscleGroup;
    private ExerciseDifficulty difficulty;
    private ExerciseRecoveryDemand recoveryDemand;
    private ExerciseEquipmentType equipmentType;
}
