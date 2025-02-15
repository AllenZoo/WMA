package com.vlf.wma.api.features.workout;

import com.vlf.wma.api.features.exercise.entity.IExerciseService;
import com.vlf.wma.api.features.exercise.enums.ExerciseMuscleGroup;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroupDTO;
import com.vlf.wma.api.features.exercise.exercise_group.IExerciseGroupService;
import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSet;
import com.vlf.wma.api.features.exercise.exercise_set.ExerciseSetDTO;
import com.vlf.wma.api.features.user.IUserService;
import com.vlf.wma.api.features.workout.enums.WorkoutSessionStatus;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequestDTO;
import com.vlf.wma.api.features.workout.session.*;
import com.vlf.wma.api.features.workout.template.*;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.vlf.wma.api.util.EnumConverterClass.convertToEnum;
import static com.vlf.wma.api.util.EnumConverterClass.convertToEnumList;


@Component
@RequiredArgsConstructor
public class WorkoutDtoEntityMapper {
    private final IUserService userService;
    private final IExerciseService exerciseService;
    private final IExerciseGroupService exerciseGroupService;
    private final IWorkoutTemplateService workoutTemplateService;

    // WorkoutSession mappings
    public WorkoutSessionDTO entityToDto(WorkoutSession entity) {
        return Optional.ofNullable(entity)
                .map(session -> WorkoutSessionDTO.builder()
                        .id(session.getId())
                        .userId(Optional.ofNullable(session.getUser())
                                .map(user -> user.getUserId())
                                .orElse(null))
                        .templateId(Optional.ofNullable(session.getTemplate())
                                .map(template -> template.getId())
                                .orElse(null))
                        .name(session.getName())
                        .exerciseGroups(exerciseGroupListEntityToDto(session.getExerciseGroups()))
                        .completedAt(session.getCompletedAt())
                        .duration(session.getDuration())
                        .startedAt(session.getStartedAt())
                        .isCompleted(session.getIsCompleted())
                        .status(session.getStatus())
                        .build())
                .orElse(null);
    }

    public List<WorkoutSessionDTO> workoutSessionListEntityToDto(List<WorkoutSession> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // WorkoutTemplate mappings
    public WorkoutTemplateDTO entityToDto(WorkoutTemplate entity) {
        return Optional.ofNullable(entity)
                .map(template -> WorkoutTemplateDTO.builder()
                        .id(template.getId())
                        .userId(Optional.ofNullable(template.getUser())
                                .map(user -> user.getUserId())
                                .orElse(null))
                        .name(template.getName())
                        .exerciseGroups(exerciseGroupListEntityToDto(template.getExerciseGroups()))
                        .createdAt(template.getCreatedAt())
                        .updatedAt(template.getUpdatedAt())
                        .build())
                .orElse(null);
    }

    public List<WorkoutTemplateDTO> workoutTemplateListEntityToDto(List<WorkoutTemplate> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // ExerciseGroup mappings
    public ExerciseGroupDTO entityToDto(ExerciseGroup entity) {
        return Optional.ofNullable(entity)
                .map(group -> ExerciseGroupDTO.builder()
                        .id(group.getId())
                        .exerciseEntityId(Optional.ofNullable(group.getExerciseEntity())
                                .map(exercise -> exercise.getId())
                                .orElse(null))
                        .exerciseSetList(exerciseSetListEntityToDto(group.getExerciseSetList()))
                        .workoutId(group.getParent().getId())
                        .displayOrder(group.getDisplayOrder())
                        .createdAt(group.getCreatedAt())
                        .updatedAt(group.getUpdatedAt())
                        .build())
                .orElse(null);
    }

    public List<ExerciseGroupDTO> exerciseGroupListEntityToDto(List<ExerciseGroup> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // ExerciseSet mappings
    public ExerciseSetDTO entityToDto(ExerciseSet entity) {
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

    public List<ExerciseSetDTO> exerciseSetListEntityToDto(List<ExerciseSet> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // Corresponding DTO to Entity mappings

    public WorkoutSession dtoToEntity(WorkoutSessionDTO dto) {
        WorkoutSession workoutSession =  Optional.ofNullable(dto)
                .map(session -> WorkoutSession.builder()
                        .id(dto.getId())
                        .user(Optional.ofNullable(dto.getUserId())
                                .map(userService::getUserById)
                                .orElse(null))
                        .template(Optional.ofNullable(dto.getTemplateId())
                                .map(workoutTemplateService::getWorkoutTemplateById)
                                .orElse(null))
                        .name(dto.getName())
                        .exerciseGroups(exerciseGroupListDtoToEntity(dto.getExerciseGroups()))
                        .completedAt(dto.getCompletedAt())
                        .duration(dto.getDuration())
                        .startedAt(dto.getStartedAt())
                        .isCompleted(dto.getIsCompleted())
                        .build())
                .orElse(null);

        // Set bi-directional relation between workoutsession and exercisegroup
        workoutSession.getExerciseGroups().stream().forEach(exerciseGroup -> exerciseGroup.setParent(workoutSession));

        return workoutSession;
    }

    public List<WorkoutSession> workoutSessionListDtoToEntity(List<WorkoutSessionDTO> dtos) {
        return Optional.ofNullable(dtos)
                .map(list -> list.stream()
                        .map(this::dtoToEntity)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public WorkoutTemplate dtoToEntity(WorkoutTemplateDTO dto) {
        WorkoutTemplate workoutTemplate = Optional.ofNullable(dto)
                .map(template -> WorkoutTemplate.builder()
                        .id(dto.getId())
                        .user(Optional.ofNullable(dto.getUserId())
                                .map(userService::getUserById)
                                .orElse(null))
                        .name(dto.getName())
                        .exerciseGroups(exerciseGroupListDtoToEntity(dto.getExerciseGroups()))
                        .createdAt(dto.getCreatedAt())
                        .updatedAt(dto.getUpdatedAt())
                        .build())
                .orElse(null);
        workoutTemplate.getExerciseGroups().stream().forEach(group -> group.setParent(workoutTemplate));
        return workoutTemplate;
    }

    public List<WorkoutTemplate> workoutTemplateListDtoToEntity(List<WorkoutTemplateDTO> dtos) {
        return Optional.ofNullable(dtos)
                .map(list -> list.stream()
                        .map(this::dtoToEntity)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public ExerciseGroup dtoToEntity(ExerciseGroupDTO dto) {
        ExerciseGroup exerciseGroup = Optional.ofNullable(dto)
                .map(group -> {
                    if (dto.getDisplayOrder() == null) {
                        //throw new IllegalArgumentException("Display Order of ExerciseGroupDTO cannot be null!");
                    }

                    return ExerciseGroup.builder()
                            .id(dto.getId())
                            .exerciseEntity(Optional.ofNullable(dto.getExerciseEntityId())
                                    .map(exerciseService::getExerciseById)
                                    .orElse(null))
                            .exerciseSetList(exerciseSetListDtoToEntity(dto.getExerciseSetList()))
                            // TODO: perhaps not necessary to set parent of ExerciseGroup entity since relation mapped
                            //  in WorkoutBase
                            //  .parent(workout)
                            .displayOrder(dto.getDisplayOrder())
                            .createdAt(dto.getCreatedAt())
                            .updatedAt(dto.getUpdatedAt())
                            .build();
                })
                .orElse(null);

        // Set bi-directional relation between exercisegroup and exerciseset
        exerciseGroup.getExerciseSetList().stream().forEach(set -> set.setExerciseGroup(exerciseGroup));
        return exerciseGroup;
    }

    public List<ExerciseGroup> exerciseGroupListDtoToEntity(List<ExerciseGroupDTO> dtos) {
        return Optional.ofNullable(dtos)
                .map(list -> list.stream()
                        .map(this::dtoToEntity)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public ExerciseSet dtoToEntity(ExerciseSetDTO dto) {
        return Optional.ofNullable(dto)
                .map(set -> ExerciseSet.builder()
                        .id(dto.getId())
                        .exerciseGroup(Optional.ofNullable(dto.getExerciseGroupId())
                                .map(exerciseGroupService::getExerciseGroupById)
                                .orElse(null))
                        .reps(dto.getReps())
                        .weightKG(dto.getWeightKG())
                        .negativeWeightKG(dto.getNegativeWeightKG())
                        .addOnWeightKG(dto.getAddOnWeightKG())
                        .duration(dto.getDuration())
                        .rpe(dto.getRpe())
                        .displayOrder(dto.getDisplayOrder())
                        .completed(dto.getCompleted())
                        .build())
                .orElse(null);
    }

    public List<ExerciseSet> exerciseSetListDtoToEntity(List<ExerciseSetDTO> dtos) {
        return Optional.ofNullable(dtos)
                .map(list -> list.stream()
                        .map(this::dtoToEntity)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    /**
     * Filter Request
     */
    public WorkoutFilterRequestDTO entityToDto(WorkoutFilterRequest entity) {
        return Optional.ofNullable(entity)
                .map(filter -> WorkoutFilterRequestDTO.builder()
                        .userId(Optional.ofNullable(filter.getUser())
                                .map(user -> user.getUserId())
                                .orElse(null))
                        .searchString(filter.getSearchString())
                        .sessionStatus(filter.getSessionStatus().toString())
                        .muscleGroups(filter.getMuscleGroups().stream().map(Enum::name).toList())
                        .maxNumExercise(filter.getMaxNumExercise())
                        .mostRecentFirst(filter.getMostRecentFirst())
                        .build())
                .orElse(null);
    }
    public WorkoutFilterRequest dtoToEntity(WorkoutFilterRequestDTO dto) {
        return Optional.ofNullable(dto)
                .map(filter -> WorkoutFilterRequest.builder()
                        .user(Optional.ofNullable(dto.getUserId())
                                .map(userService::getUserById)
                                .orElse(null))
                        .searchString(dto.getSearchString())
                        .sessionStatus(convertToEnum(dto.getSessionStatus(), WorkoutSessionStatus.class))
                        .muscleGroups(convertToEnumList(filter.getMuscleGroups(), ExerciseMuscleGroup.class))
                        .maxNumExercise(dto.getMaxNumExercise())
                        .mostRecentFirst(dto.getMostRecentFirst())
                        .build())
                .orElse(null);
    }
    public List<WorkoutFilterRequestDTO> filterRequestListEntityToDto(List<WorkoutFilterRequest> entities) {
        return Optional.ofNullable(entities)
                .map(list -> list.stream()
                        .map(this::entityToDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
    public List<WorkoutFilterRequest> filterRequestListDtoToEntity(List<WorkoutFilterRequestDTO> dtos) {
        return Optional.ofNullable(dtos)
                .map(list -> list.stream()
                        .map(this::dtoToEntity)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
}