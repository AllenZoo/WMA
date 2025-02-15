package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.exceptions.EntityNotFoundException;
import com.vlf.wma.api.features.exercise.exceptions.ExerciseNotFoundException;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.util.Patcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService implements IExerciseService{

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Override
    public List<ExerciseEntity> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @Override
    public List<ExerciseEntity> getDefaultExercises() {
        Specification<ExerciseEntity> spec = ExerciseSpecifications.defaultAndSpecified(null);
        return exerciseRepository.findAll(spec);
    }

    @Override
    public List<ExerciseEntity> getExerciseByUser(UserEntity user) {
        Specification<ExerciseEntity> spec = ExerciseSpecifications.specifiedOnly(user);
        return exerciseRepository.findAll(spec);
    }

    @Override
    public List<ExerciseEntity> getExerciseByUserId(Long userId) {
        Specification<ExerciseEntity> spec = ExerciseSpecifications.specifiedOnly(userId);
        return exerciseRepository.findAll(spec);
    }

    @Override
    public ExerciseEntity getExerciseById(Long exerciseId) {
        return exerciseRepository.findById(exerciseId)
                .orElseThrow(()-> new ExerciseNotFoundException(
                        String.format("Could not find exercise with id %s", exerciseId)));
    }

    @Override
    public List<ExerciseEntity> getExercises(ExerciseFilterRequest filterRequest) {
        Specification<ExerciseEntity> spec = ExerciseSpecifications.withFilters(filterRequest);
        return exerciseRepository.findAll(spec);
    }

    @Override
    public ExerciseEntity addExercise(ExerciseEntity exerciseEntity) {
        return exerciseRepository.save(exerciseEntity);
    }

    @Override
    public ExerciseEntity patchExercise(Long exerciseId, ExerciseEntity patch) {
        ExerciseEntity existingEntity = exerciseRepository.findById(exerciseId).orElseThrow(() -> {
            throw new EntityNotFoundException(String.format("Exercise with id [%s] not found in database!",
                    exerciseId));
        });

        try {
            Patcher.patchEntity(existingEntity, patch);
            exerciseRepository.save(existingEntity);
        } catch (IllegalAccessException e) {
            System.out.println(e);
        }
        return existingEntity;
    }

    @Override
    public void deleteExercise(Long exerciseId) {
        exerciseRepository.deleteById(exerciseId);
    }

    @Override
    public void deleteExercisesByUser(UserEntity user) {
        exerciseRepository.delete(ExerciseSpecifications.specifiedOnly(user));
    }
}
