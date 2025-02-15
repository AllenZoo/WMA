import { WorkoutTemplate } from "@/stores/@types/workout.store";
import { View, Text } from "react-native";
import { Modal, Portal } from "react-native-paper";
import StickFigureRunIcon from "../../../../assets/svgs/stick-figure-run.svg";
import {
  BG_COLOUR_PRIMARY_1,
  BG_COLOUR_SECONDARY_1,
  BG_COLOUR_SECONDARY_2,
  TEXT_BODY_L,
  TEXT_BODY_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import Barbell from "@/components/dynamic_assets/Barbell";
import Button from "@/components/buttons/Button";
import Plate from "@/components/dynamic_assets/Plate";
import { ScrollView } from "react-native-gesture-handler";

interface IWorkoutTemplateInfoDisplayProps {
  workout: WorkoutTemplate | undefined;
  onClose?: () => void;
  onStartWorkout?: (workout: WorkoutTemplate) => void;
  visible: boolean;
  setVisible?: (visible: boolean) => void;
}

// For Starting and Viewing a workout
const WorkoutTemplateInfoDisplay = ({
  workout,
  onClose,
  onStartWorkout,
  visible,
}: IWorkoutTemplateInfoDisplayProps) => {
  const handleStartWorkout = () => {
    if (!workout) {
      console.log("Workout is undefined");
      return;
    }
    onStartWorkout?.(workout);
  };

  const handleCancelWorkout = () => {
    onClose?.();
  };

  // Renders plate, exercise x # of sets
  const renderExercisesDisplay = (workout: WorkoutTemplate | null) => {
    if (!workout) return null;

    return (
      // Convert this to flat list (scrollable) and set max height

      <ScrollView
        className="w-full flex-col gap-y-2 m-0 pl-3"
        style={{ minHeight: 100, maxHeight: 200 }}
      >
        {workout.exerciseGroups.map((exerciseGroup, index) => (
          <View
            key={index}
            className={`flex-row justify-start gap-x-[8] items-center`}
          >
            <Plate
              radius={24}
              holeRadius={8}
              colour={exerciseGroup.exercise.plateColour ?? "gray"}
            />

            <Text className={`${TEXT_BODY_M} text-[#ffffff]`}>
              {exerciseGroup.exercise.name}
            </Text>
            <Text className={`${TEXT_BODY_M} text-[#ffffff]`}>x</Text>
            <Text className={`${TEXT_BODY_M} text-[#ffffff]`}>
              {exerciseGroup.exerciseSets?.length ?? "0*"}
            </Text>
          </View>
        ))}
        <View className="pb-2"></View>
      </ScrollView>
    );
  };

  // Renders button options to start or cancel workout
  const renderOptionButtons = () => {
    return (
      // {/* Start/Cancel Buttons */}
      <View className="flex-row mt-4 mb-2">
        <Button
          additionalStyleContainer="w-[50%] mr-1 active:opacity-70"
          onPress={handleStartWorkout}
          backgroundColor={"#a0ff90"}
          textColor={"#05080a"}
          text="Start"
        />
        <Button
          additionalStyleContainer="w-[50%] ml-1 active:opacity-70"
          onPress={handleCancelWorkout}
          backgroundColor={"#5a5761"}
          text="Cancel"
        />
      </View>
    );
  };
  return (
    <View>
      <Portal>
        {/* If modal closes twice when closing via pressing out of area, refer to:
        https://github.com/callstack/react-native-paper/issues/4140 for fix. Requires modifying Modal source code. */}
        <Modal
          visible={visible}
          onDismiss={handleCancelWorkout}
          dismissable={true}
        >
          <View
            className={`${BG_COLOUR_SECONDARY_2} p-4 mx-4 flex-col items-center rounded-xl`}
          >
            <StickFigureRunIcon height={50} width={50} />
            <Text className={`${TEXT_HEADING_S} text-[#ffffff]`}>
              Start Workout
            </Text>
            <Text className={`${TEXT_BODY_L} text-[#a0ff90] text-center`}>
              You're about to start:{" "}
              <Text className={`whitespace-nowrap `}>
                {"\n"}
                {workout?.name ?? "undefined"}
              </Text>
            </Text>
            <Barbell workout={workout} />
            {renderExercisesDisplay(workout ?? null)}
            {renderOptionButtons()}
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
export default WorkoutTemplateInfoDisplay;
