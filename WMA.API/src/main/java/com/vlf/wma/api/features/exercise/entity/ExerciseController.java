package com.vlf.wma.api.features.exercise.entity;


import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSet;
import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSetDTO;
import com.vlf.wma.api.features.exercise.exercise_set.IExerciseSetService;
import com.vlf.wma.api.features.user.IUserService;
import com.vlf.wma.api.features.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.vlf.wma.api.features.exercise.enums.*;

import java.util.*;
import java.util.stream.Collectors;

import static com.vlf.wma.api.util.EnumConverterClass.convertToEnum;
import static com.vlf.wma.api.util.EnumConverterClass.convertToEnumList;

@RestController
@RequestMapping(value = "/exercise")
public class ExerciseController {

    @Autowired
    private IExerciseService exerciseService;

    @Autowired
    private IExerciseSetService exerciseSetService;

    @Autowired
    private IUserService userService;

    /**
     * Gets all exercises stored in DB regardless of the custom exercises created by different users.
     * @return
     */
    @GetMapping
    public ResponseEntity<List<ExerciseEntityDTO>> getAllExercises() {
        List<ExerciseEntity> res = exerciseService.getAllExercises();
        List<ExerciseEntityDTO> resDTO = entityToDTO(res);
        return ResponseEntity.ok(resDTO);
    }

    /**
     * Get all exercises created by specified User. Excludes default exercises.
     * @return
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExerciseEntityDTO>> getAllExercisesForUser(@PathVariable Long userId) {
        List<ExerciseEntity> userExercises = exerciseService.getExerciseByUserId(userId);
        List<ExerciseEntityDTO> userExercisesDTO = entityToDTO(userExercises);
        return ResponseEntity.ok(userExercisesDTO);
    }

    /**
     * Gets a particular exercise by its id.
     * @param exerciseId
     * @return
     */
    @GetMapping("/{exerciseId}")
    public ResponseEntity<ExerciseEntityDTO> getExerciseEntityById(@PathVariable Long exerciseId) {
        ExerciseEntity exerciseEntity = exerciseService.getExerciseById(exerciseId);
        ExerciseEntityDTO dto = entityToDTO(exerciseEntity);
        return ResponseEntity.ok(dto);
    }

    /**
     * Get Default Exercises.
     * @return
     */
    @GetMapping("/default")
    public ResponseEntity<List<ExerciseEntityDTO>> getDefaultExercises() {
        List<ExerciseEntity> defaultExercises = exerciseService.getDefaultExercises();
        List<ExerciseEntityDTO> defaultExercisesDTO = entityToDTO(defaultExercises);
        return ResponseEntity.ok(defaultExercisesDTO);
    }

    @GetMapping("/history/{exerciseId}")
    public ResponseEntity<List<ExerciseSetDTO>> getExerciseSessionHistory(@PathVariable Long exerciseId,
                                                                     @AuthenticationPrincipal
                                                                    UserDetails userDetails) {
        ExerciseEntity exerciseEntity = exerciseService.getExerciseById(exerciseId);
        
        // Note: @AuthenticationPrincipal will fill out username even if we login with email instead.
        UserEntity user = UserEntity.builder().username(userDetails.getUsername()).build();
        List<ExerciseSet> exerciseSets = exerciseSetService.getCompletedSets(exerciseEntity, user);
        List<ExerciseSetDTO> exerciseSetDTOS = exerciseSetListEntityToDto(exerciseSets);
        return ResponseEntity.ok(exerciseSetDTOS);
    }

    @PostMapping("/filterRequest")
    public ResponseEntity<List<ExerciseEntityDTO>> getFilteredExercises(@RequestBody ExerciseFilterRequestDTO dto) {
        ExerciseFilterRequest filterRequest = dtoToEntity(dto);
        List<ExerciseEntity> filteredExercises = exerciseService.getExercises(filterRequest);
        List<ExerciseEntityDTO> filteredExercisesDTO = entityToDTO(filteredExercises);
        return ResponseEntity.ok(filteredExercisesDTO);
    }

    @PostMapping
    public ResponseEntity<ExerciseEntityDTO> addExercise(@RequestBody ExerciseEntityDTO dto) {
        ExerciseEntity toInsert = dtoToEntity(dto);
        ExerciseEntity insertedEntity = exerciseService.addExercise(toInsert);
        ExerciseEntityDTO returnDto = entityToDTO(insertedEntity);
        return ResponseEntity.ok(returnDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExerciseEntityDTO> patchExercise(@PathVariable Long id, @RequestBody ExerciseEntityDTO dto) {
        ExerciseEntity exerciseEntity = dtoToEntity(dto);
        ExerciseEntity res = exerciseService.patchExercise(id, exerciseEntity);
        ExerciseEntityDTO returnDto = entityToDTO(res);
        return ResponseEntity.ok(returnDto);
    }

    @DeleteMapping("/{id}")
    public void deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
    }

    private  ExerciseEntity dtoToEntity(ExerciseEntityDTO dto) throws IllegalArgumentException {
        if (dto == null) {
            throw new IllegalArgumentException("DTO cannot be null");
        }

        ExerciseEntity entity = new ExerciseEntity();

        if (dto.getUserId() != null) {
            UserEntity user = userService.getUserById(dto.getUserId());
            entity.setUser(user);
        }
        entity.setName(dto.getName());
        entity.setAliases(dto.getAliases());
        entity.setDemoVideoLink(dto.getDemoVideoLink());

        // Convert List<String> to List<ExerciseMuscleGroup>
        entity.setMuscleGroups(convertToEnumList(dto.getMuscleGroups(), ExerciseMuscleGroup.class));

        // Convert List<String> to List<ExerciseMetricType>
        entity.setMetricTypes(convertToEnumList(dto.getMetricTypes(), ExerciseMetricType.class));

        // Convert List<String> to List<ExerciseEquipmentType>
        entity.setEquipmentTypes(convertToEnumList(dto.getEquipmentTypes(), ExerciseEquipmentType.class));

        // Convert String to ExerciseDifficulty
        entity.setDifficulty(convertToEnum(dto.getDifficulty(), ExerciseDifficulty.class));

        // Convert String to ExerciseRecoveryDemand
        entity.setRecoveryDemand(convertToEnum(dto.getRecoveryDemand(), ExerciseRecoveryDemand.class));

        entity.setPlateColour(dto.getPlateColour());

        return entity;
    }
    private ExerciseFilterRequest dtoToEntity(ExerciseFilterRequestDTO dto) throws IllegalArgumentException {
        if (dto == null) {
            throw new IllegalArgumentException("DTO cannot be null");
        }

        ExerciseFilterRequest entity = new ExerciseFilterRequest();
        entity.setSearchName(dto.searchName);
        entity.setMuscleGroup(convertToEnum(dto.muscleGroup, ExerciseMuscleGroup.class));
        entity.setDifficulty(convertToEnum(dto.difficulty, ExerciseDifficulty.class));
        entity.setRecoveryDemand(convertToEnum(dto.recoveryDemand, ExerciseRecoveryDemand.class));
        entity.setEquipmentType(convertToEnum(dto.equipmentType, ExerciseEquipmentType.class));

        return entity;
    }

    private ExerciseEntityDTO entityToDTO(ExerciseEntity exerciseEntity) {
        if (exerciseEntity == null) {
            return null;
        }

        ExerciseEntityDTO dto = new ExerciseEntityDTO();
        dto.setExerciseId(exerciseEntity.getId());
        dto.setUserId(exerciseEntity.getUser() != null ? exerciseEntity.getUser().getUserId() : null);
        dto.setName(exerciseEntity.getName());
        dto.setAliases(exerciseEntity.getAliases());
        dto.setDemoVideoLink(exerciseEntity.getDemoVideoLink());
        dto.setMuscleGroups(
                exerciseEntity.getMuscleGroups() != null ?
                        exerciseEntity.getMuscleGroups().stream().map(Enum::name).toList() : null
        );
        dto.setMetricTypes(
                exerciseEntity.getMetricTypes() != null ?
                        exerciseEntity.getMetricTypes().stream().map(Enum::name).toList() : null
        );
        dto.setEquipmentTypes(
                exerciseEntity.getEquipmentTypes() != null ?
                        exerciseEntity.getEquipmentTypes().stream().map(Enum::name).toList() : null
        );
        dto.setDifficulty(exerciseEntity.getDifficulty() != null ? exerciseEntity.getDifficulty().name() : null);
        dto.setRecoveryDemand(exerciseEntity.getRecoveryDemand() != null ? exerciseEntity.getRecoveryDemand().name() : null);
        dto.setPlateColour(exerciseEntity.getPlateColour());

        return dto;
    }
    private List<ExerciseEntityDTO> entityToDTO(List<ExerciseEntity> exerciseEntities) {
        return exerciseEntities.stream()
                .map(exerciseEntity -> entityToDTO((exerciseEntity))).toList();
    }

    // ExerciseSet mappings
    private ExerciseSetDTO entityToDto(ExerciseSet entity) {
        return Optional.ofNullable(entity)
                .map(set -> ExerciseSetDTO.builder()
                        .id(set.getId())
                        .exerciseGroupId(Optional.ofNullable(set.getExerciseGroup())
                                .map(group -> group.getId())
                                .orElse(null))
                        .reps(set.getReps())
                        .weightKG(set.getWeightKG())
                        .negativeWeightKG(set.getNegativeWeightKG())
                        .addOnWeightKG(set.getAddOnWeightKG())
                        .duration(set.getDuration())
                        .rpe(set.getRpe())
                        .displayOrder(set.getDisplayOrder())
                        .completed(set.getCompleted())
                        .build())
                .orElse(null);
    }

    private List<ExerciseSetDTO> exerciseSetListEntityToDto(List<ExerciseSet> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }



}
