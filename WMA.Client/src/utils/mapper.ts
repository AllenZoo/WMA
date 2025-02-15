// File that stores helper map functions

import { PlateInfo } from "@/components/dynamic_assets/Barbell";
import { Exercise } from "@/stores/@types/exercise.store";
import { ExerciseGroup, ExerciseGroupDto } from "@/stores/@types/workout.store";

// Map exercise list to plate info lists
export const mapExercisesToPlates = (exercises: Exercise[]): PlateInfo[] => {
  return exercises.map((exercise) => ({
    colour: exercise.plateColour || "",
  }));
};

// Map exercise groups to plate info
export const mapExerciseGroupsToPlates = (
  exerciseGroups: ExerciseGroup[]
): PlateInfo[] => {
  return exerciseGroups.flatMap((group) =>
    // If exercise is not null, map the exercise to plates, otherwise return an empty array
    group.exercise ? mapExercisesToPlates([group.exercise]) : []
  );
};
