package com.vlf.wma.api.features.exercise.entity;

import com.vlf.wma.api.features.exercise.enums.*;
import com.vlf.wma.api.features.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "exercises", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "user_id"})
})
public class ExerciseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    /**
     * Default exercises will have no user. EG. user == null.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity user;

    @Column(name = "name", nullable = false)
    private String name;

    @ElementCollection(targetClass = String.class)
    @CollectionTable(name = "exercise_entity_aliases", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "aliases")
    private List<String> aliases;

    @Column(name = "video_link")
    private String demoVideoLink;

    @ElementCollection(targetClass = ExerciseMuscleGroup.class)
    @CollectionTable(name = "exercise_muscle_groups", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "muscle_group")
    @Enumerated(EnumType.STRING)
    private List<ExerciseMuscleGroup> muscleGroups;

    @ElementCollection(targetClass = ExerciseMetricType.class)
    @CollectionTable(name = "exercise_metric_type", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "metric_type")
    @Enumerated(EnumType.STRING)
    private List<ExerciseMetricType> metricTypes;

    @ElementCollection(targetClass = ExerciseEquipmentType.class)
    @CollectionTable(name = "exercise_equipment_types", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "equipment_type")
    @Enumerated(EnumType.STRING)
    private List<ExerciseEquipmentType> equipmentTypes;

    @Column(name = "difficulty")
    @Enumerated(EnumType.STRING)
    private ExerciseDifficulty difficulty;

    @Column(name = "recovery_demand")
    @Enumerated(EnumType.STRING)
    private ExerciseRecoveryDemand recoveryDemand;

    @Column(name = "plate_colour")
    private String plateColour;
}
