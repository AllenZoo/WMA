package com.vlf.wma.api.features.exercise.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ExerciseFilterRequestDTO {
    String searchName;
    String muscleGroup;
    String difficulty;
    String recoveryDemand;
    String equipmentType;
}
