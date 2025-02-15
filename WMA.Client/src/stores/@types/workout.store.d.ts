export interface WorkoutSessionDto {
  id: number;
  templateId?: string;
  userId: number;
  name: string;
  exerciseGroups: ExerciseGroupDto[];
  completedAt?: Date;
  duration: number;
  startedAt: Date;
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  templateId?: string | null;
  userId: number; // Number since we are using the user id from the store.
  name: string;
  exerciseGroups: ExerciseGroup[];
  completedAt?: Date;
  duration: number;
  startedAt: Date;
  isCompleted: boolean;
}

export interface WorkoutTemplateDto {
  id: number;
  name: string;
  userId: number;
  exerciseGroups: ExerciseGroupDto[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutTemplate {
  id: string | null; // null if default template (quickstart)
  name: string;
  userId: number; // Number since we are using the user id from the store.
  exerciseGroups: ExerciseGroup[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseGroupDto {
  id: number;
  exerciseId: number;
  exerciseSets: ExerciseSetDto[];
  workoutId: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseGroup {
  id: string;
  exercise: Exercise;
  exerciseSets: ExerciseSet[];
  workoutId: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSetDto {
  id: number;
  exerciseGroupId: number;
  reps: number;
  weightKG: number;
  negativeWeightKG: number;
  addOnWeightKG: number;
  duration: number;
  rpe: number;
  distance: number;
  displayOrder: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSet {
  id: string;
  exerciseGroupId: string;
  reps: number;
  weightKG: number;
  negativeWeightKG: number;
  addOnWeightKG: number;
  duration: number;
  rpe: number;
  distance: number;
  displayOrder: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutFilterDto {
  userId?: number;
  searchString?: string | null;
  sessionStatus?: string | null;
  muscleGroups?: string[] | null;
  mostRecentFirst?: boolean | null;
  //maxNumExercise?: number | null;
}

export interface WorkoutStoreConfig {
  // Template CRUD
  workoutTemplates: WorkoutTemplate[];
  filteredWorkoutTemplates: WorkoutTemplate[];
  getWorkoutTemplates: () => Promise<WorkoutTemplateDto[]>;
  getWorkoutTemplatesFiltered: (
    filter: WorkoutFilterDto
  ) => Promise<WorkoutTemplateDto[]>;
  addWorkoutTemplate: (
    workout: WorkoutTemplateDto
  ) => Promise<WorkoutTemplateDto>;
  removeWorkoutTemplate: (id: string) => void;
  editWorkoutTemplate: (
    templateId: string,
    patchWorkout: WorkoutTemplateDto
  ) => Promise<WorkoutTemplateDto>;

  // Session CRUD
  workoutSessions: WorkoutSession[];
  filteredWorkoutSessions: WorkoutSession[];
  getWorkoutSessions: () => Promise<WorkoutSessionDto[]>;
  getWorkoutSessionsFiltered: (
    filter: WorkoutFilterDto
  ) => Promise<WorkoutSessionDto[]>;
  startWorkoutSession: (
    workout: WorkoutSessionDto
  ) => Promise<WorkoutSessionDto>;
  completeWorkoutSession: (id: string) => Promise<WorkoutSessionDto>;
  cancelWorkoutSession: (id: string) => Promise<WorkoutSessionDto>;
  editWorkoutSession: (
    sessionId: string,
    patchWorkout: WorkoutSessionDto
  ) => Promise<WorkoutSessionDto>;
  removeWorkoutSession: (id: string) => Promise<void>;
}
