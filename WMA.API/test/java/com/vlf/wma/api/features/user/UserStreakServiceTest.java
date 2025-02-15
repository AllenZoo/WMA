package com.vlf.wma.api.features.user;


import com.vlf.wma.api.features.workout.session.WorkoutSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// TODO: fix commented out tests
@ExtendWith(MockitoExtension.class)
class UserStreakServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkoutSessionRepository workoutSessionRepository;

    @InjectMocks
    private UserStreakService userStreakService; // No @Spy

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .userId(1L)
                .username("testUser")
                .email("testUser@example.com")
                .currentStreak(0)
                .longestStreak(0)
                .build();
    }

//    @Test
//    void updateStreakForUser_NoWorkoutLogs() {
//        when(userRepository.findById(user.getUserId())).thenReturn(Optional.of(user));
//        when(workoutSessionRepository.findLastWorkoutDateTime(user, true)).thenReturn(Optional.of(null));
//
//        userStreakService.updateStreakForUser(user.getUserId());
//
//        assertEquals(0, user.getCurrentStreak());
//        assertNull(user.getLastWorkoutDate());
//        verify(userRepository).save(user);
//    }

//    @Test
//    void updateStreakForUser_WorkoutToday() {
//        LocalDateTime now = LocalDateTime.now();
//        when(userRepository.findById(user.getUserId())).thenReturn(Optional.of(user));
//        //when(workoutLogRepository.findLastWorkoutDateForUser(user.getUserId())).thenReturn(now);
//
//        userStreakService.updateStreakForUser(user.getUserId());
//
//        assertTrue(user.getWorkedOutToday());
//        assertEquals(now, user.getLastWorkoutDate());
//        assertEquals(1, user.getCurrentStreak());
//        verify(userRepository).save(user);
//    }

//    @Test
//    void updateStreakForUser_UpdateLongestStreak() {
//        user.setCurrentStreak(3);
//        user.setLongestStreak(3);
//
//        LocalDateTime now = LocalDateTime.now();
//        when(userRepository.findById(user.getUserId())).thenReturn(Optional.of(user));
//        //when(workoutLogRepository.findLastWorkoutDateForUser(user.getUserId())).thenReturn(now);
//
//        userStreakService.updateStreakForUser(user.getUserId());
//
//        assertEquals(4, user.getCurrentStreak());
//        assertEquals(4, user.getLongestStreak());
//        verify(userRepository).save(user);
//    }

    @Test
    void updateAllUserStreaks() {
        UserEntity user1 = UserEntity.builder()
                .userId(1L)
                .username("testUser1")
                .email("testUser1@example.com")
                .currentStreak(0)
                .longestStreak(0)
                .build();

        UserEntity user2 = UserEntity.builder()
                .userId(2L)
                .username("testUser2")
                .email("testUser2@example.com")
                .currentStreak(0)
                .longestStreak(0)
                .build();

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        userStreakService.updateAllUserStreaks();

        verify(userRepository).findAll(); // Ensure findAll was called
        verify(userRepository).save(user1); // Verify save was called for user1
        verify(userRepository).save(user2); // Verify save was called for user2
    }
}