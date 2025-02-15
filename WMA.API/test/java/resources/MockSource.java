package resources;

import com.vlf.wma.api.features.exercise.exercise_group.ExerciseGroup;
import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.workout.session.WorkoutSession;

import java.util.ArrayList;
import java.util.List;

/**
 * Class Contains Reusable Mock Entities.
 */
public class MockSource {
    // User Mocks
    public static final UserEntity USER_MOCK_1 = UserEntity.builder()
            .username("testerman")
            .password("abcdefghijkl")
            .email("ahtenaon@dojo.com")
            .initializedViaEmailPass(false)
            .build();

    // Exercise Group Mocks
    public static final ExerciseGroup EXERCISE_GROUP_MOCK = ExerciseGroup.builder().build();

    // Workout Session Mocks
    public static final WorkoutSession WORKOUT_SESSION_PRE_SAVE = WorkoutSession.builder()
            .name("Workout Session 1")
            .user(USER_MOCK_1)
            .exerciseGroups(new ArrayList<>())
            .build();
    public static final WorkoutSession WORKOUT_SESSION_POST_SAVE = WORKOUT_SESSION_PRE_SAVE.toBuilder()
            .id(1L)
            .build();

    public static final WorkoutSession WORKOUT_SESSION_PATCH = WorkoutSession.builder()
            .exerciseGroups(List.of(EXERCISE_GROUP_MOCK))
            .build();

    public static final WorkoutSession WORKOUT_SESSION_POST_PATCH = WORKOUT_SESSION_POST_SAVE.toBuilder()
            .exerciseGroups(List.of(EXERCISE_GROUP_MOCK))
            .build();
}
