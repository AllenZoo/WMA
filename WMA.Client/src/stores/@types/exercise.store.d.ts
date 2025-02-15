import {
  MUSCLE_GROUPS,
  EXERCISE_DIFFICULTIES,
  EXERCISE_RECOVERY_DEMAND,
  EXERCISE_TYPES,
  EQUIPMENT_TYPES,
} from "../@constants/exercise";

export type ExerciseFilter = {
  searchName?: string | null;
  muscleGroup?: MuscleGroup | null;
  difficulty?: Difficulty | null;
  recoveryDemand?: RecoveryDemand | null;
  equipmentType?: EquipmentType | null;
  exerciseType?: ExerciseType | null;
};

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];
export type RecoveryDemand = (typeof RECOVERY_DEMANDS)[number];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

// Main Exercise Store Config
export interface ExerciseStoreConfig {
  exercises: Exercise[];
  filteredExercises: Exercise[];

  // API Calls
  getExercises: () => Promise<Exercise[]>;
  getExercisesByUser: (userId: number) => Promise<void>;
  getExerciseByFilter: (filter: ExerciseFilter) => Promise<Exercise[]>;
  createExercise: (exercise: Exercise) => Promise<void>;
  updateExercise: (exercise: Exercise) => Promise<void>;
  deleteExercise: (id: number) => Promise<void>;

  // Store/Cache calls.
  getExerciseById: (id: number) => Exercise | undefined;
}

export type Exercise = {
  exerciseId?: number;
  userId?: number;
  name?: string;
  aliases?: string[];
  demoVideoLink?: string;
  muscleGroups?: string[];
  metricTypes?: string[];
  equipmentTypes?: string[];
  difficulty?: string;
  recoveryDemand?: string;
  plateColour?: string;
};
