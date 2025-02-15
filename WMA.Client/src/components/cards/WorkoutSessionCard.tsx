import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { WorkoutSession } from "@/stores/@types/workout.store";
import { TEXT_HEADING_S } from "@/utils/designStyles";
import Barbell from "../dynamic_assets/Barbell";
import OptionsMenu from "../buttons/OptionsMenu";
import InfoIcon from "../../../assets/svgs/info-icon-white.svg";
import DeleteIcon from "../../../assets/svgs/delete-icon.svg";
import ClockIcon from "../../../assets/svgs/clock-icon.svg";
import { getUniqueMuscleGroups } from "./WorkoutTemplateCard";
import { Chip } from "@rneui/base";
import { formatDuration, formatWorkoutDate } from "@/utils/formatter";
import { Pressable } from "react-native-gesture-handler";

interface WorkoutSessionCardProps {
  session: WorkoutSession;
  onDisplayDeleteModal: (session: WorkoutSession) => void;
  onDisplayInfoModal: (session: WorkoutSession) => void;
}

const WorkoutSessionCard: React.FC<WorkoutSessionCardProps> = ({
  session,
  onDisplayDeleteModal,
  onDisplayInfoModal,
}) => {
  const workoutSessionCardOptions = [
    {
      label: "Info",
      onSelect: () => onDisplayInfoModal(session),
      leadingIcon: () => <InfoIcon fill="white" />,
    },
    {
      label: "Delete",
      onSelect: () => onDisplayDeleteModal(session),
      leadingIcon: () => <DeleteIcon />,
    },
  ];

  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);

  const renderShrunkBarbell = () => {
    return (
      <View className="scale-[0.3] absolute -top-6 -right-10">
        <Barbell workout={session} />
      </View>
    );
  };

  const renderMuscleGroups = () => {
    return (
      <View className="flex flex-row flex-wrap ml-2 gap-1">
        {muscleGroups.map((muscleGroup, index) => (
          <View key={index}>
            <Chip
              key={index}
              color={"#ffffff"}
              buttonStyle={{
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderWidth: 1,
                borderColor: "#000000",
              }}
            >
              <Text>{muscleGroup}</Text>
            </Chip>
          </View>
        ))}
      </View>
    );
  };

  useEffect(() => {
    if (session) {
      const groups = getUniqueMuscleGroups(session);
      setMuscleGroups(groups);
    }
  }, [session]);

  return (
    <View className="flex-col items-center justify-center">
      <View className="p-3 bg-white rounded-lg shadow-lg w-[90%] flex-col">
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <Text className={`text-base ${TEXT_HEADING_S} max-w-[120px]`}>
            {session.name}
          </Text>

          <OptionsMenu options={workoutSessionCardOptions} />
        </View>

        <Text className="text-gray-500 mt-2 mb-2">
          {formatWorkoutDate(session.startedAt)}
        </Text>

        <View className="flex-row items-center gap-x-1">
          <ClockIcon width={35} height={35} />
          <Text className="text-base">{formatDuration(session.duration)}</Text>
        </View>

        <View className="pt-2"></View>
        {renderMuscleGroups()}

        {renderShrunkBarbell()}
      </View>
    </View>
  );
};

export default WorkoutSessionCard;
