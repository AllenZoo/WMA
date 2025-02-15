package com.vlf.wma.api.features.workout.session;

import com.vlf.wma.api.features.user.UserEntity;
import com.vlf.wma.api.features.workout.session.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long>, JpaSpecificationExecutor<WorkoutSession> {
    @Query("SELECT ws.completedAt FROM WorkoutSession ws " +
            "WHERE ws.user = :user AND ws.isCompleted = :isCompleted " +
            "ORDER BY ws.completedAt DESC LIMIT 1")
    Optional<LocalDateTime> findLastWorkoutDateTime(
            @Param("user") UserEntity user,
            @Param("isCompleted") boolean isCompleted
    );
}
