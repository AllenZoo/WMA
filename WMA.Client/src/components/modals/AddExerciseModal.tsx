import { Modal, View, Text, Pressable, TextInput } from "react-native";
import DarkenedBlurOverlay from "./DarkenedBlurOverlay";
import Button from "../buttons/Button";
import FilterTag from "../buttons/FilterTag";
import {
  BG_COLOUR_SECONDARY_2,
  TEXT_HEADING_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import { IconCloseButton } from "../buttons/IconButton";
import AddIcon from "../../../assets/svgs/add-icon.svg";
import TextBox from "../inputs/TextBox";
import { useRef, useState } from "react";
import { handleErrors } from "@/utils/inputErrors";
import { Exercise } from "@/stores/@types/exercise.store";
import useErrorTracker from "@/hooks/useErrorTracker";
import {
  EQUIPMENT_TYPES,
  EXERCISE_RECOVERY_DEMAND,
  MUSCLE_GROUPS,
} from "@/stores/@constants/exercise";
import { PaperProvider } from "react-native-paper";

interface IAddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
}

const AddExerciseModal = ({
  visible,
  onClose,
  onAdd,
}: IAddExerciseModalProps) => {
  // [0] For tracking error state of nameInput
  const { errors, hasErrors, onErrors, resetErrorState } = useErrorTracker(1);

  const exerciseNameRef = useRef<TextInput | null>(null);
  const [exerciseNameInput, setExerciseNameInput] = useState("");

  // Custom exercise object to be added to the store. Initialized with default values.
  const defaultExercise: Exercise = {
    name: "",
    muscleGroups: [MUSCLE_GROUPS[0]],
    equipmentTypes: [EQUIPMENT_TYPES[0]],
    recoveryDemand: EXERCISE_RECOVERY_DEMAND[0],
  };

  const [customExercise, setCustomExercise] =
    useState<Exercise>(defaultExercise);

  const handleSelect =
    (key: keyof Exercise, isArray: boolean) => (selection: string) => {
      setCustomExercise((prev) => {
        if (isArray) {
          return { ...prev, [key]: [selection] };
        }
        return { ...prev, [key]: selection };
      });
    };

  const handleOnAdd = () => {
    if (hasErrors) {
      // No need for error feedback since input handles this itself.
      // TODO: (Button should be disabled if hasErrors is true)
      console.log("Errors in input fields");
      return;
    }

    if (!customExercise) {
      console.log(
        "No exercise to add (should not happen if we handle errors correctly)"
      );
      return;
    }

    onAdd(customExercise);
    handleOnClose();
  };

  // Handles logic for closing the modal.
  const handleOnClose = () => {
    resetErrorState();
    // Reset the input fields
    setCustomExercise(defaultExercise);

    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleOnClose}
    >
      <PaperProvider>
        <DarkenedBlurOverlay>
          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "transparent",
              },
            ]}
            onPress={handleOnClose}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                className={`${BG_COLOUR_SECONDARY_2} p-6 rounded-3xl w-[100%] flex-col items-center`}
              >
                <View className="flex-col pl-2 w-full">
                  {/* HEADER */}
                  <View className="flex-row items-center w-full justify-between">
                    <View className="flex-row items-center">
                      <AddIcon width={38} height={38} fill="#000" />
                      <Text className={`${TEXT_HEADING_M}`}>Add Exercise</Text>
                    </View>
                    <View>
                      <IconCloseButton onPress={handleOnClose} iconSize={18} />
                    </View>
                  </View>

                  {/* BODY */}
                  <View className="flex-col gap-5 mt-1">
                    <View>
                      <TextBox
                        ref={exerciseNameRef}
                        legendText="Exercise Name"
                        useLegend
                        onErrors={(state) => {
                          onErrors(state, 0);
                        }}
                        onChangeText={(text) => setExerciseNameInput(text)}
                        inputErrors={{
                          required: true,
                          format: {
                            regex: /^[a-zA-Z\s]+$/,
                            message: "Only letters and spaces are allowed",
                          },
                        }}
                        onBlur={() => {
                          handleSelect("name", false)(exerciseNameInput);
                        }}
                      ></TextBox>
                    </View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>
                        Muscle Category
                      </Text>
                      <FilterTag
                        selection={customExercise.muscleGroups![0]}
                        onRemove={() => {}}
                        selections={[...MUSCLE_GROUPS]}
                        onSelect={handleSelect("muscleGroups", true)}
                        onPress={() => {}}
                      />
                    </View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>Equipment</Text>
                      <FilterTag
                        selection={customExercise.equipmentTypes![0]}
                        onRemove={() => {}}
                        selections={[...EQUIPMENT_TYPES]}
                        onSelect={handleSelect("equipmentTypes", true)}
                        onPress={() => {}}
                      />
                    </View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>
                        Recovery Demand
                      </Text>
                      <FilterTag
                        selection={customExercise.recoveryDemand!}
                        onRemove={() => {}}
                        selections={[...EXERCISE_RECOVERY_DEMAND]}
                        onSelect={handleSelect("recoveryDemand", false)}
                        onPress={() => {}}
                      />
                    </View>
                  </View>
                </View>

                {/* APPLY BUTTON */}
                <View className="pt-12">
                  <Button
                    text="Add"
                    onPress={() => {
                      handleOnAdd();
                    }}
                    className=""
                    disabled={hasErrors}
                  />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </DarkenedBlurOverlay>
      </PaperProvider>
    </Modal>
  );
};

export default AddExerciseModal;
