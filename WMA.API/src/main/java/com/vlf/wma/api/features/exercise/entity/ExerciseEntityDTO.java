package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.exercise.enums.ExerciseDifficulty;
import com.vlf.wma.api.features.exercise.enums.ExerciseEquipmentType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMetricType;
import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Class to handle transference of data between FrontEnd and BackEnd. (mainly for FE to BE tho for validating inputs)
 */
@Setter
@Getter
public class ExerciseEntityDTO {
    // Generally shouldn't be provided since exerciseId is automatically assigned when saving
    // to the repo. However when going from BE to FE, we want to share exerciseId.
    private Long exerciseId;

    private Long userId;

    private String name;

    private List<String> aliases;

    private String demoVideoLink;

    private List<String> muscleGroups;

    private List<String> metricTypes;

    private List<String> equipmentTypes;

    private String difficulty;

    private String recoveryDemand;

    private String plateColour;
}
