//package com.vlf.wma.api.features.workout;
//
//import com.vlf.wma.api.features.exercise.entity.ExerciseEntity;
//import com.vlf.wma.api.features.user.UserEntity;
//import com.vlf.wma.api.features.workout.filter.WorkoutFilterRequest;
//import com.vlf.wma.api.features.workout.session.WorkoutSession;
//import com.vlf.wma.api.features.workout.template.WorkoutTemplate;
//import jakarta.persistence.criteria.*;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.jpa.domain.Specification;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class WorkoutSpecificationsTest {
//
//    @Mock private Root<WorkoutSession> workoutSessionRoot;
//    @Mock private Root<WorkoutTemplate> workoutTemplateRoot;
//    @Mock private Root<ExerciseEntity> exerciseRoot;
//    @Mock private CriteriaQuery<?> query;
//    @Mock private CriteriaBuilder criteriaBuilder;
//    @Mock private Path<Object> userPath;
//    @Mock private Path<String> namePath;
//    @Mock private Predicate predicate;
//
//    @Test
//    void byWorkout_Success() {
//        // [Set up]
//        WorkoutSession workoutSession = new WorkoutSession();
//        when(exerciseRoot.get("workout")).thenReturn(userPath);
//        when(criteriaBuilder.equal(userPath, workoutSession)).thenReturn(predicate);
//        when(criteriaBuilder.disjunction()).thenReturn(predicate);
//        when(criteriaBuilder.or(any(Predicate.class), any(Predicate.class))).thenReturn(predicate);
//
//        // [Run]
//        Specification<ExerciseEntity> spec = WorkoutSpecifications.byWorkout(workoutSession);
//        Predicate result = spec.toPredicate(exerciseRoot, query, criteriaBuilder);
//
//        // [Verify]
//        assertNotNull(result);
//        verify(exerciseRoot).get("workout");
//        verify(criteriaBuilder).equal(userPath, workoutSession);
//    }
//
//    @Test
//    void getOngoingSessions_Success() {
//        // [Set up]
//        UserEntity user = new UserEntity();
//        when(workoutSessionRoot.get("isCompleted")).thenReturn(userPath);
//        when(workoutSessionRoot.get("user")).thenReturn(userPath);
//        when(criteriaBuilder.equal(userPath, false)).thenReturn(predicate);
//        when(criteriaBuilder.equal(userPath, user)).thenReturn(predicate);
//        when(criteriaBuilder.and(any(Predicate[].class))).thenReturn(predicate);
//
//        // [Run]
//        Specification<WorkoutSession> spec = WorkoutSpecifications.getOngoingSessions(user);
//        Predicate result = spec.toPredicate(workoutSessionRoot, query, criteriaBuilder);
//
//        // [Verify]
//        assertNotNull(result);
//        verify(workoutSessionRoot).get("isCompleted");
//        verify(workoutSessionRoot).get("user");
//        verify(criteriaBuilder, times(2)).equal(any(), any());
//    }
//
//    @Test
//    void getOngoingSessions_NullUser() {
//        // [Set up & Run & Verify]
//        assertThrows(IllegalArgumentException.class,
//                () -> WorkoutSpecifications.getOngoingSessions(null));
//    }
//
//    @Test
//    void workoutSessionsByFilter_Success() {
//        // [Set up]
//        WorkoutFilterRequest filter = new WorkoutFilterRequest();
//        UserEntity user = new UserEntity();
//        filter.setUser(user);
//        filter.setSearchString("test");
//
//        when(workoutSessionRoot.get("user")).thenReturn(userPath);
//        when(workoutSessionRoot.get("name")).thenReturn(namePath);
//        when(criteriaBuilder.conjunction()).thenReturn(predicate);
//        when(criteriaBuilder.equal(userPath, user)).thenReturn(predicate);
//        when(criteriaBuilder.lower(namePath)).thenReturn(namePath);
//        when(criteriaBuilder.like(any(), any())).thenReturn(predicate);
//        when(criteriaBuilder.and(any(Predicate.class), any(Predicate.class))).thenReturn(predicate);
//
//        // [Run]
//        Specification<WorkoutSession> spec = WorkoutSpecifications.workoutSessionsByFilter(filter);
//        Predicate result = spec.toPredicate(workoutSessionRoot, query, criteriaBuilder);
//
//        // [Verify]
//        assertNotNull(result);
//        verify(workoutSessionRoot).get("user");
//        verify(workoutSessionRoot).get("name");
//        verify(criteriaBuilder).like(any(), contains("%test%"));
//    }
//
//    @Test
//    void workoutTemplateByFilter_Success() {
//        // [Set up]
//        WorkoutFilterRequest filter = new WorkoutFilterRequest();
//        UserEntity user = new UserEntity();
//        filter.setUser(user);
//        filter.setSearchString("test");
//
//        when(workoutTemplateRoot.get("user")).thenReturn(userPath);
//        when(workoutTemplateRoot.get("name")).thenReturn(namePath);
//        when(criteriaBuilder.conjunction()).thenReturn(predicate);
//        when(criteriaBuilder.equal(userPath, user)).thenReturn(predicate);
//        when(criteriaBuilder.lower(namePath)).thenReturn(namePath);
//        when(criteriaBuilder.like(any(), any())).thenReturn(predicate);
//        when(criteriaBuilder.and(any(Predicate.class), any(Predicate.class))).thenReturn(predicate);
//
//        // [Run]
//        Specification<WorkoutTemplate> spec = WorkoutSpecifications.workoutTemplateByFilter(filter);
//        Predicate result = spec.toPredicate(workoutTemplateRoot, query, criteriaBuilder);
//
//        // [Verify]
//        assertNotNull(result);
//        verify(workoutTemplateRoot).get("user");
//        verify(workoutTemplateRoot).get("name");
//        verify(criteriaBuilder).like(any(), contains("%test%"));
//    }
//}