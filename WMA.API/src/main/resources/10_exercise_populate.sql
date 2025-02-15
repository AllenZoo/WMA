-- Insert data into exercises table
INSERT INTO exercises (id, user_id, name, video_link, difficulty, recovery_demand, plate_colour)
VALUES
(1, NULL, 'Push Up', 'https://example.com/push-up', 'EASY', 'LOW', 'blue'),
(2, NULL, 'Pull Up', 'https://example.com/pull-up', 'MEDIUM', 'MODERATE', 'green'),
(3, NULL, 'Squat', 'https://example.com/squat', 'HARD', 'HIGH', 'red'),
(4, NULL, 'Deadlift', 'https://example.com/deadlift', 'HARD', 'HIGH', 'black'),
(5, NULL, 'Bench Press', 'https://example.com/bench-press', 'MEDIUM', 'MODERATE', 'silver'),
(6, NULL, 'Overhead Press', 'https://example.com/overhead-press', 'MEDIUM', 'HIGH', 'gold'),
(7, NULL, 'Plank', 'https://example.com/plank', 'EASY', 'LOW', 'yellow'),
(8, NULL, 'Lunges', 'https://example.com/lunges', 'MEDIUM', 'MODERATE', 'purple'),
(9, NULL, 'Bicep Curl', 'https://example.com/bicep-curl', 'EASY', 'LOW', 'orange'),
(10, NULL, 'Tricep Dip', 'https://example.com/tricep-dip', 'EASY', 'LOW', 'pink');

-- Insert aliases for each exercise
INSERT INTO exercise_entity_aliases (exercise_id, aliases)
VALUES
(1, 'Press-Up'),
(2, 'Chin-Up'),
(3, 'Bodyweight Squat'),
(4, 'Barbell Deadlift'),
(5, 'Flat Bench'),
(6, 'Shoulder Press'),
(7, 'Core Hold'),
(8, 'Split Squat'),
(9, 'Arm Curl'),
(10, 'Dip');

-- Insert muscle groups for each exercise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group)
VALUES
(1, 'CHEST'),
(2, 'BACK'),
(3, 'LEGS'),
(4, 'BACK'),
(4, 'LEGS'),
(5, 'CHEST'),
(6, 'SHOULDERS'),
(7, 'CORE'),
(8, 'LEGS'),
(9, 'ARMS'),
(10, 'ARMS');

-- Insert metric types for each exercise
INSERT INTO exercise_metric_type (exercise_id, metric_type)
VALUES
(1, 'REPS'),
(2, 'REPS'),
(3, 'WEIGHT'),
(4, 'WEIGHT'),
(5, 'WEIGHT'),
(6, 'REPS'),
(7, 'TIME'),
(8, 'REPS'),
(9, 'REPS'),
(10, 'REPS');

-- Insert equipment types for each exercise
INSERT INTO exercise_equipment_types (exercise_id, equipment_type)
VALUES
(1, 'BODYWEIGHT'),
(2, 'BODYWEIGHT'),
(3, 'BODYWEIGHT'),
(4, 'BARBELL'),
(5, 'BARBELL'),
(6, 'DUMBBELL'),
(7, 'BODYWEIGHT'),
(8, 'BODYWEIGHT'),
(9, 'DUMBBELL'),
(10, 'BODYWEIGHT');
