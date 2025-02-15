import { WorkoutSession, WorkoutTemplate } from "@/stores/@types/workout.store";
import { View, Text, Pressable } from "react-native";
import Barbell from "../dynamic_assets/Barbell";
import {
  BG_COLOUR_PRIMARY_1,
  shadowStyle,
  TEXT_BODY_L,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import { Chip } from "@rneui/base";
import OptionsMenu from "../buttons/OptionsMenu";
import InfoIcon from "../../../assets/svgs/info-icon.svg";
import EditIcon from "../../../assets/svgs/edit-icon.svg";
import DeleteIcon from "../../../assets/svgs/delete-icon.svg";
import { useWorkoutStore } from "@/stores/workout.store";
import { useEffect, useState } from "react";

interface IWorkoutTemplateCardProps {
  workoutTemplate: WorkoutTemplate;
  onCardClicked?: () => void;
  onTemplateModifyRequest?: (template: WorkoutTemplate) => void;
  onTemplateDeleteRequest?: (templateId: string) => void;
}

const WorkoutTemplateCard = ({
  workoutTemplate,
  onCardClicked,
  onTemplateModifyRequest,
  onTemplateDeleteRequest,
}: IWorkoutTemplateCardProps) => {
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const { removeWorkoutTemplate } = useWorkoutStore();
  const cardBGColour = `${BG_COLOUR_PRIMARY_1}`;

  const handleOnModifyRequest = () => {
    console.log("Edit clicked");
    if (onTemplateModifyRequest) {
      onTemplateModifyRequest(workoutTemplate);
    }
  };

  const handleOnDeleteRequest = () => {
    console.log("Delete clicked");
    if (workoutTemplate.id && onTemplateDeleteRequest) {
      onTemplateDeleteRequest(workoutTemplate.id);
    }
  };

  useEffect(() => {
    if (workoutTemplate) {
      setMuscleGroups(getUniqueMuscleGroups(workoutTemplate));
    }
  }, [workoutTemplate]);

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      onPress={onCardClicked}
    >
      {/* Main Card Container */}
      <View
        className={`w-[100%] ${cardBGColour} flex-col py-3 rounded-3xl`}
        style={[shadowStyle]} // Apply shadow style
      >
        {/* Header Title Row */}
        <View className="px-5 flex-row items-center justify-between">
          <Text className={`${TEXT_HEADING_S} font-bold`}>
            {workoutTemplate.name}
          </Text>
          <OptionsMenu
            options={[
              {
                label: "Modify",
                onSelect: () => {
                  handleOnModifyRequest();
                },
                leadingIcon: () => <EditIcon />,
              },
              {
                label: "Delete",
                onSelect: () => {
                  handleOnDeleteRequest();
                },
                leadingIcon: () => <DeleteIcon />,
              },
            ]}
            optionButtonSVG={() => <InfoIcon height={33} width={33} />}
          ></OptionsMenu>
          {/* <InfoButton size={33} onPress={onInfoClicked || (() => {})} /> */}
        </View>

        {/* Barbell */}
        <View>
          <Barbell workout={workoutTemplate} />
        </View>

        {/* Muscle Groups */}
        <View className="flex flex-row px-5 items-center w-full">
          <Text className={`${TEXT_BODY_L} font-bold`}>Muscle Areas: </Text>
          <View className="flex flex-row flex-wrap ml-2 gap-1 flex-1">
            {muscleGroups.map((muscleGroup, index) => (
              <View key={index}>
                <Chip
                  key={index}
                  color={"#ffffff"}
                  buttonStyle={{
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text>{muscleGroup}</Text>
                </Chip>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default WorkoutTemplateCard;

// Gets the unique muscle groups from the exercise groups of a workout template
export const getUniqueMuscleGroups = (
  workout: WorkoutTemplate | WorkoutSession
) => {
  if (!workout.exerciseGroups) {
    console.log("template.exerciseGroups is null");
    return [];
  }

  // Note: Could run into error if exerciseGroup contains no exercise (exercise = null, check exercise_group DB table).
  const muscleGroups = workout.exerciseGroups.reduce(
    (acc, curr) => [...acc, ...(curr.exercise?.muscleGroups ?? [])],
    [] as string[]
  );

  return Array.from(new Set(muscleGroups));
};
