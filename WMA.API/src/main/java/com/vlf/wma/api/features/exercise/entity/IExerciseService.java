package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.user.UserEntity;

import java.util.List;

public interface IExerciseService {

    List<ExerciseEntity> getAllExercises();

    /**
     * Gets all default exercises.
     * @return
     */
    List<ExerciseEntity> getDefaultExercises();

    /**
     * Gets all exercises belonging to user with userId. Excludes default exercises.
     *
     * @param user
     * @return
     */
    List<ExerciseEntity> getExerciseByUser(UserEntity user);
    List<ExerciseEntity> getExerciseByUserId(Long userId);
    ExerciseEntity getExerciseById(Long exerciseId);
    List<ExerciseEntity> getExercises(ExerciseFilterRequest filterRequest);

    ExerciseEntity addExercise(ExerciseEntity exerciseEntity);
    ExerciseEntity patchExercise(Long exerciseId, ExerciseEntity exerciseEntity);
    void deleteExercise(Long exerciseId);
    void deleteExercisesByUser(UserEntity user);
}
