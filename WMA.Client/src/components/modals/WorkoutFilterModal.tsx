import { WorkoutFilterDto } from "@/stores/@types/workout.store";
import { BG_COLOUR_SECONDARY_2, TEXT_BODY_L } from "@/utils/designStyles";
import { View, Text, Pressable, Keyboard } from "react-native";
import { Chip, Modal, Portal } from "react-native-paper";
import FilterModalHeader from "./headers/FilterModalHeader";
import CustomButton from "../buttons/Button";
import NumericInputBox from "../inputs/NumericInputBox";
import { useState } from "react";
import { MUSCLE_GROUPS } from "@/stores/@constants/exercise";

interface IWorkoutFilterModalProps {
  visible: boolean;
  onClose?: () => void;
  onApply?: (attr: WorkoutFilterDto) => void;
}

const WorkoutFilterModal = ({
  visible,
  onClose = () => {},
  onApply = () => {},
}: IWorkoutFilterModalProps) => {
  const [maxNumExercise, setMaxNumExercise] = useState<number>(0);
  const muscleGroups = [...MUSCLE_GROUPS];
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  // Handle chip selection. If the chip is already selected, remove it from the selectedIndexes array.
  // Otherwise, add it to the selectedIndexes array.
  const handleChipSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      setSelectedIndexes((prev) => [...prev, index]);
    }
  };

  // Prepares filter state and calls onApply callback. Closes modal afterwards.
  const handleApply = () => {
    // Create filter directly from current state values
    const filter: WorkoutFilterDto = {
      muscleGroups: selectedIndexes.map((index) => MUSCLE_GROUPS[index]),
      // maxNumExercise,
    };

    onApply(filter);
    onClose();
  };

  const renderApplyButton = () => {
    return <CustomButton text="Apply" onPress={handleApply} />;
  };

  return (
    <View>
      <Portal>
        <Modal visible={visible} onDismiss={onClose}>
          <Pressable onPress={Keyboard.dismiss}>
            <View
              className={`${BG_COLOUR_SECONDARY_2} p-4 mx-4 flex-col items-center rounded-xl`}
            >
              <View className="flex-col pl-2 w-full">
                <FilterModalHeader onClose={onClose} />

                <View className="flex-col gap-5 mt-1">
                  <View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_BODY_L}`}>
                        Muscle Categories
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {muscleGroups.map((group, index) => (
                        <Chip
                          key={index}
                          selected={selectedIndexes.includes(index)}
                          onPress={() => handleChipSelection(index)}
                        >
                          <Text>{group}</Text>
                        </Chip>
                      ))}
                    </View>
                  </View>

                  {/* <View className="flex-row justify-between content-center">
                    <Text className={`${TEXT_BODY_L}`}>
                      Maximum Number of Exercises
                    </Text>
                    <NumericInputBox
                      onChange={setMaxNumExercise}
                      maxChars={2}
                    />
                  </View> */}
                </View>
              </View>

              <View className="mt-8" />
              {renderApplyButton()}
            </View>
          </Pressable>
        </Modal>
      </Portal>
    </View>
  );
};

export default WorkoutFilterModal;
