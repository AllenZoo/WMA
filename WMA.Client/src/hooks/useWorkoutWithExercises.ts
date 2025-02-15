// import { useExerciseStore } from "@/stores/exercise.store";
// import { useWorkoutStore } from "@/stores/workout.store";
// import { useMemo } from "react";

// // TODO: figure out better logic.
// export const useWorkoutWithExercises = (workoutId?: string) => {
//   const workoutTemplates = useWorkoutStore((state) => state.workoutTemplates);
//   const exercises = useExerciseStore((state) => state.exercises);

//   // Get a single workout if ID is provided
//   const workout = useMemo(() => {
//     if (!workoutId) return null;
//     return workoutTemplates.find((w) => w.id === workoutId);
//   }, [workoutTemplates, workoutId]);

//   // Get unique muscle groups for a single workout
//   const workoutMuscleGroups = useMemo(() => {
//     if (!workout) return new Set<string>();

//     const muscleGroups = new Set<string>();
//     workout.exerciseGroups.forEach((group) => {
//       const exercise = exercises.find(
//         // TODO: make sure exerciseId! won't break.
//         (e) => e.exerciseId!.toString() === group.exerciseId
//       );
//       if (exercise?.muscleGroups) {
//         exercise.muscleGroups.forEach((mg) => muscleGroups.add(mg));
//       }
//     });

//     return muscleGroups;
//   }, [workout, exercises]);

//   // Enrich all workouts with exercise details
//   const enrichedWorkouts = useMemo(() => {
//     return workoutTemplates.map((workout) => ({
//       ...workout,
//       exerciseGroups: workout.exerciseGroups.map((group) => {
//         const exercise = exercises.find(
//           // TODO: check logic of exerciseId never being null
//           (e) => e.exerciseId!.toString() === group.exerciseId
//         );
//         return {
//           ...group,
//           muscleGroups: exercise?.muscleGroups || [],
//           name: exercise?.name,
//           difficulty: exercise?.difficulty,
//           // Add other exercise fields you need
//         };
//       }),
//     }));
//   }, [workoutTemplates, exercises]);

//   return {
//     workout, // Single workout if ID provided
//     workoutMuscleGroups, // Set of unique muscle groups for single workout
//     enrichedWorkouts, // All workouts with exercise details
//     isLoading: exercises.length === 0 || workoutTemplates.length === 0,
//   };
// };
