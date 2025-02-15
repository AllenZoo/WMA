import BaseScreenNavLayout from "@/components/layouts/BaseNavbar";
import { TEXT_HEADING_L } from "@/utils/designStyles";
import { View, Text } from "react-native";

interface IWorkoutTemplateInfoProps {
  workoutTemplateId: number;
}

const WorkoutTemplateInfo: React.FC<IWorkoutTemplateInfoProps> = () => {
  // TODO: somehow fetch info from store using workoutTemplateId.

  return (
    <BaseScreenNavLayout>
      {/* HEADER */}
      <Text className={`${TEXT_HEADING_L} mt-5 mb-4 text-center w-full`}>
        Workout Info
      </Text>

      <View className="flex-1"></View>
    </BaseScreenNavLayout>
  );
};
export default WorkoutTemplateInfo;
