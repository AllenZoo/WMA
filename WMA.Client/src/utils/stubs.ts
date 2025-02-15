// Class for reusing stubs

import { Exercise } from "@/stores/@types/exercise.store";
import {
  ExerciseGroup,
  ExerciseSet,
  WorkoutSession,
  WorkoutTemplate,
} from "@/stores/@types/workout.store";

export const EXERCISE_STUB_1: Exercise = {
  exerciseId: 1,
  userId: 123,
  name: "Bench Press",
  aliases: ["Chest Press", "BP"],
  demoVideoLink: "https://example.com/demo/bench-press",
  muscleGroups: ["Chest", "Triceps", "Shoulders"],
  metricTypes: ["Reps", "Weight"],
  equipmentTypes: ["Barbell", "Bench"],
  difficulty: "Intermediate",
  recoveryDemand: "Moderate",
  plateColour: "purple",
};

export const EXERCISE_STUB_2: Exercise = {
  exerciseId: 2,
  userId: 123,
  name: "Push up",
  aliases: ["Chest Press", "BP"],
  demoVideoLink: "https://example.com/demo/bench-press",
  muscleGroups: ["Chest", "Triceps", "Shoulders"],
  metricTypes: ["Reps", "Weight"],
  equipmentTypes: ["None"],
  difficulty: "Intermediate",
  recoveryDemand: "Moderate",
  plateColour: "gray",
};

export const EXERCISES_STUB = [EXERCISE_STUB_1, EXERCISE_STUB_2];

export const ALL_EXERCISES_STUB: Exercise[] = [
  {
    exerciseId: 1,
    userId: 123,
    name: "Bench Press",
    aliases: ["Chest Press", "BP"],
    demoVideoLink: "https://example.com/demo/bench-press",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    metricTypes: ["Reps", "Weight"],
    equipmentTypes: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    recoveryDemand: "Moderate",
    plateColour: "purple",
  },
  {
    exerciseId: 2,
    userId: 123,
    name: "Squat",
    aliases: ["SQ"],
    demoVideoLink: "https://example.com/demo/squat",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    metricTypes: ["Reps", "Weight"],
    equipmentTypes: ["Barbell", "Rack"],
    difficulty: "Intermediate",
    recoveryDemand: "High",
    plateColour: "blue",
  },
  {
    exerciseId: 3,
    userId: 123,
    name: "Deadlift",
    aliases: ["DL"],
    demoVideoLink: "https://example.com/demo/deadlift",
    muscleGroups: ["Back", "Glutes", "Hamstrings"],
    metricTypes: ["Reps", "Weight"],
    equipmentTypes: ["Barbell"],
    difficulty: "Intermediate",
    recoveryDemand: "High",
    plateColour: "red",
  },
  {
    exerciseId: 4,
    userId: 123,
    name: "Pull Up",
    aliases: ["PU"],
    demoVideoLink: "https://example.com/demo/pull-up",
    muscleGroups: ["Back", "Biceps"],
    metricTypes: ["Reps", "Weight"],
    equipmentTypes: ["Pull Up Bar"],
    difficulty: "Intermediate",
    recoveryDemand: "Moderate",
    plateColour: "green",
  },
  {
    exerciseId: 5,
    userId: 123,
    name: "Push Up",
    aliases: ["PU"],
    demoVideoLink: "https://example.com/demo/push-up",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    metricTypes: ["Reps", "Weight"],
    equipmentTypes: ["Bodyweight"],
    difficulty: "Beginner",
    recoveryDemand: "Low",
    plateColour: "yellow",
  },
];

export const EXERCISE_STUB_3: Exercise = {
  exerciseId: 1,
  userId: 123,
  name: "Bench Press",
  aliases: ["Chest Press", "BP"],
  demoVideoLink: "https://example.com/demo/bench-press",
  muscleGroups: ["Chest", "Triceps", "Shoulders"],
  metricTypes: ["Reps", "Weight"],
  equipmentTypes: ["Barbell", "Bench"],
  difficulty: "Intermediate",
  recoveryDemand: "Moderate",
  plateColour: "purple",
};

export const EXERCISE_SET_STUB: ExerciseSet = {
  id: "",
  exerciseGroupId: "",
  reps: 10,
  weightKG: 100,
  negativeWeightKG: 0,
  addOnWeightKG: 0,
  duration: 0,
  rpe: 0,
  distance: 0,
  displayOrder: 0,
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const EXERCISE_GROUP_STUB: ExerciseGroup = {
  id: "1",
  exercise: EXERCISE_STUB_1,
  exerciseSets: [EXERCISE_SET_STUB, EXERCISE_SET_STUB, EXERCISE_SET_STUB],
  workoutId: "",
  displayOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const WORKOUT_TEMPLATE_STUB: WorkoutTemplate = {
  id: "1",
  userId: 123,
  name: "Chest Day",
  exerciseGroups: [EXERCISE_GROUP_STUB],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const WORKOUT_SESSION_STUB: WorkoutSession = {
  id: "1",
  userId: 0,
  name: "Chest Day",
  exerciseGroups: [EXERCISE_GROUP_STUB, EXERCISE_GROUP_STUB],
  duration: 0,
  startedAt: new Date(),
  isCompleted: false,
};
