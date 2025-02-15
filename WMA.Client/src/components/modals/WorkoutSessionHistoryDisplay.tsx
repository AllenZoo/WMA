import { WorkoutSession } from "@/stores/@types/workout.store";
import { View, Text } from "react-native";
import ClockIcon from "../../../assets/svgs/clock-icon.svg";
import { formatDuration, formatWorkoutDate } from "@/utils/formatter";
import { Modal, Portal } from "react-native-paper";
import { BG_COLOUR_SECONDARY_2, TEXT_HEADING_S } from "@/utils/designStyles";
import Barbell from "../dynamic_assets/Barbell";
import HistoryExerciseGroupCard from "../cards/HistoryExerciseGroupCard";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { IconCloseButton } from "../buttons/IconButton";

interface IWorkoutSessionHistoryDisplayProps {
  visible: boolean;
  session: WorkoutSession;
  onClose: () => void;
}

const WorkoutSessionHistoryDisplay = ({
  visible,
  session,
  onClose,
}: IWorkoutSessionHistoryDisplayProps) => {
  if (session === null) {
    return null;
  }

  // Renders the body section of the modal
  const renderBody = () => {
    var exerciseGroups = session.exerciseGroups;
    return (
      <ScrollView style={{ maxHeight: 380, width: "100%" }}>
        <View className="flex-row items-center gap-x-2 w-full">
          <View className="flex-col gap-y-1 w-full">
            {exerciseGroups.map((exerciseGroup, index) => (
              <HistoryExerciseGroupCard
                key={index}
                exerciseGroup={exerciseGroup}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View>
      <Portal>
        <Modal visible={visible} onDismiss={onClose}>
          <View
            className={`${BG_COLOUR_SECONDARY_2} p-4 mx-4 flex-col items-center rounded-xl`}
          >
            {/* Header Section */}
            <View className="flex-col items-center">
              <Text className={`text-base ${TEXT_HEADING_S} max-w-[120px]`}>
                {session.name}
              </Text>
              <Text>{formatWorkoutDate(session.startedAt)}</Text>
              <View className="flex-row items-center gap-x-1">
                <ClockIcon width={35} height={35} />
                <Text className="text-base">
                  {formatDuration(session.duration)}
                </Text>
              </View>
              <Barbell workout={session} />
            </View>

            <View className="absolute top-2 right-2">
              <IconCloseButton onPress={onClose} />
            </View>

            {/* Body Section */}
            {renderBody()}
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
export default WorkoutSessionHistoryDisplay;
