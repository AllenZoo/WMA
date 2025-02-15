import React, { useState } from "react";
import {
  BG_COLOUR_SECONDARY_1,
  BG_COLOUR_SECONDARY_2,
  TEXT_HEADING_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import { View, Text, Modal, Pressable } from "react-native";
import FilterTag from "../buttons/FilterTag";
import Button from "../buttons/Button";
import FilterIcon from "../../../assets/svgs/filter-icon.svg";
import { IconCloseButton } from "../buttons/IconButton";
import DarkenedBlurOverlay from "./DarkenedBlurOverlay";
import { ExerciseFilter } from "@/stores/@types/exercise.store";
import {
  EQUIPMENT_TYPES,
  EXERCISE_RECOVERY_DEMAND,
  MUSCLE_GROUPS,
} from "@/stores/@constants/exercise";
import { PaperProvider } from "react-native-paper";
import FilterModalHeader from "./headers/FilterModalHeader";

interface IExerciseFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (attr: ExerciseFilter) => void;
}

// export type FilterAttributes = {
//   muscleCategory: MuscleGroup | "all";
//   equipment: EquipmentType | "all";
//   recoveryDemand: RecoveryDemand | "all";
// };

const ExerciseFilterModal = ({
  visible,
  onClose,
  onApply,
}: IExerciseFilterModalProps) => {
  // Tracks the filter attributes that the user has selected.
  const [filterAttributes, setFilterAttributes] = useState<ExerciseFilter>({
    muscleGroup: null,
    equipmentType: null,
    recoveryDemand: null,
  });

  // Tracks the filter attributes that have been applied.
  // This is important to display the correct filter tags.
  // For example if a user selects filter attributes but does not apply them,
  // the filter tags states should not persist when user reopens the modal.
  const [appliedFilter, setAppliedFilter] = useState<ExerciseFilter>({
    muscleGroup: null,
    equipmentType: null,
    recoveryDemand: null,
  });

  const handleSelect = (key: keyof ExerciseFilter) => (selection: string) => {
    if (selection === "all") {
      // all = no filter for that attribute
      setFilterAttributes((prev) => ({ ...prev, [key]: null }));
    } else {
      setFilterAttributes((prev) => ({ ...prev, [key]: selection }));
    }
  };

  const handleApply = () => {
    onApply(filterAttributes);
    setAppliedFilter(filterAttributes);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <PaperProvider>
        <DarkenedBlurOverlay>
          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "transparent",
              },
            ]}
            onPress={onClose}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                className={`${BG_COLOUR_SECONDARY_2} p-6 pb-16 rounded-t-3xl w-full flex-col items-center`}
              >
                <View className="flex-col pl-2 w-full">
                  {/* HEADER */}
                  <FilterModalHeader onClose={onClose} />

                  {/* BODY */}
                  <View className="flex-col gap-5 mt-1">
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>
                        Muscle Category
                      </Text>
                      <FilterTag
                        selection={appliedFilter.muscleGroup}
                        onRemove={() => {}}
                        selections={["all", ...MUSCLE_GROUPS]}
                        //selections={["all", ...MUSCLE_GROUPS]}
                        onSelect={handleSelect("muscleGroup")}
                        onPress={() => {}}
                      />
                    </View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>Equipment</Text>
                      <FilterTag
                        selection={appliedFilter.equipmentType}
                        onRemove={() => {}}
                        selections={["all", ...EQUIPMENT_TYPES]}
                        onSelect={handleSelect("equipmentType")}
                        onPress={() => {}}
                      />
                    </View>
                    <View className="flex-row justify-between content-center">
                      <Text className={`${TEXT_HEADING_S}`}>
                        Recovery Demand
                      </Text>
                      <FilterTag
                        selection={appliedFilter.recoveryDemand}
                        onRemove={() => {}}
                        selections={["all", ...EXERCISE_RECOVERY_DEMAND]}
                        onSelect={handleSelect("recoveryDemand")}
                        onPress={() => {}}
                      />
                    </View>
                  </View>
                </View>

                {/* APPLY BUTTON */}
                <View className="pt-12">
                  <Button text="Apply" onPress={handleApply} className="" />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </DarkenedBlurOverlay>
      </PaperProvider>
    </Modal>
  );
};

export default ExerciseFilterModal;
