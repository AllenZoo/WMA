package com.vlf.wma.api.features.user;

import com.vlf.wma.api.features.workout.session.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

// TODO: fix this service class eventually. Currently not being used in any class but should add to Workout Session
//  Complete endpoint eventually.
@Service
public class UserStreakService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    /**
     * Updates User Streak Info.
     *
     * If user hasn't already worked out today, mark there status as worked out today = true, and add to their streak
     * .<br>
     * If user has worked out today, we do nothing.
     *
     * @param userId
     */
    public void updateStreakForUser(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();

        // TODO: replace this with WorkoutSessionRepository.
//        LocalDateTime lastWorkoutDateTime = workoutSessionRepository
//                .findAll(orderByCompletedOn(getOngoingSessions(user))).getFirst().getCompletedAt();


        // Temp:
        Optional<LocalDateTime> lastWorkoutDateTime =
                workoutSessionRepository.findLastWorkoutDateTime(user, true);

        // Check if user has worked out before with the app
        if (lastWorkoutDateTime.isPresent()) {
            user.setCurrentStreak(0);
            user.setLastWorkoutDate(null);
            userRepository.save(user);
            return;
        }

        if (user.getWorkedOutToday() != null && user.getWorkedOutToday()) {
            // User already worked out today, don't need to add to streak.
            user.setLastWorkoutDate(lastWorkoutDateTime.get());
            userRepository.save(user);
            return;
        }

        // Check if last workout was today! (between Yesterday Midnight and today midnight)
        if (lastWorkoutDateTime.get().isAfter(LocalDate.now().atTime(LocalTime.MIN)) &&
            lastWorkoutDateTime.get().isBefore(LocalDate.now().atTime(LocalTime.MAX))) {
            // Add to streak
            user.setWorkedOutToday(true);
            user.setLastWorkoutDate(lastWorkoutDateTime.get());
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            user.setLongestStreak(Math.max(user.getCurrentStreak(), user.getLongestStreak()));
        }

        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        userRepository.save(user);
    }

    /**
     * Updates User Streak Info.
     *
     * If user hasn't already worked out today, mark there status as worked out today = true, and add to their streak
     * .<br>
     * If user has worked out today, we do nothing.
     *
     * @param user
     */
    public void updateStreakForUser(UserEntity user) {
        updateStreakForUser(user.getUserId());
    }

    @Scheduled(cron = "0 0 0 * * ?")  // Run at midnight every day
    public void updateAllUserStreaks() {
        List<UserEntity> users = userRepository.findAll();
        for (UserEntity user : users) {
            if (user.getWorkedOutToday() == null || !user.getWorkedOutToday()) {
               user.setCurrentStreak(0);
            }
            user.setWorkedOutToday(false);
            userRepository.save(user);
        }
    }
}
