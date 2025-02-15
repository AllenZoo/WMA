package com.vlf.wma.api.features.exercise.exercise_set;

import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
import com.vlf.wma.api.features.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import static com.vlf.wma.api.features.exercise.exercise_set.ExerciseSetSpecifications.*;


@Service
public class ExerciseSetService implements IExerciseSetService{

    @Autowired
    private ExerciseSetRepository exerciseSetRepository;

    @Override
    public List<ExerciseSet> getCompletedSets(ExerciseEntity exerciseEntity, UserEntity user) {
        return exerciseSetRepository.findAll(orderByCompletedOn(
                byCompletion(true)
                        .and(byExercise(exerciseEntity))
                        .and(byUser(user))
        ));
    }
}
