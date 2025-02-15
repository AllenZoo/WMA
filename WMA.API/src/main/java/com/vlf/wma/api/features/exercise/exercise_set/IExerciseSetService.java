package com.vlf.wma.api.features.exercise.exercise_set;

import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.user.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IExerciseSetService {
    List<ExerciseSet> getCompletedSets(ExerciseEntity exerciseEntity, UserEntity user);
}
