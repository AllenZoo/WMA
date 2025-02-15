import { Exercise } from "@/stores/@types/exercise.store";
import { useState } from "react";

type ExerciseInfoDisplayModalParams = {
  visible: boolean;
  exercise?: Exercise;
};
function useExerciseInfoModal() {
  const [exerciseInfoModalParams, setExerciseInfoModalParams] =
    useState<ExerciseInfoDisplayModalParams>({
      visible: false,
      exercise: undefined,
    });

  const openExerciseInfoModal = (exercise: Exercise) => {
    setExerciseInfoModalParams({
      visible: true,
      exercise,
    });
  };

  const closeExerciseInfoModal = () => {
    setExerciseInfoModalParams({
      visible: false,
      exercise: undefined,
    });
  };

  return {
    exerciseInfoModalParams,
    openExerciseInfoModal,
    closeExerciseInfoModal,
  };
}
export default useExerciseInfoModal;
