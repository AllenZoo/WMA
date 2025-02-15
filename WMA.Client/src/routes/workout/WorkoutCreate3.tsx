import Button from "@/components/buttons/Button";
import Barbell from "@/components/dynamic_assets/Barbell";
import TextBox from "@/components/inputs/TextBox";
import BaseScreenNavLayout from "@/components/layouts/BaseNavbar";
import { mapExercisesToPlates } from "@/utils/mapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutCreate3"
>;
// Page for allowing user to fill in the details of the workout (only name for now).
const WorkoutCreate3 = ({ navigation, route }: WorkoutProps) => {
  const exercises = route.params?.addedExercises ?? [];

  const [workoutName, setWorkoutName] = useState<string>();
  const [canContinue, setCanContinue] = useState<boolean>(false);

  const handleContinuePress = () => {
    navigation.navigate("WorkoutCreate4", {
      addedExercises: exercises,
      workoutName: workoutName,
    });
  };

  return (
    <BaseScreenNavLayout>
      {/* Padding for Header */}
      <View className="h-[100px]"></View>
      <Barbell
        weight={0}
        position={{ x: 0, y: 0 }}
        plates={mapExercisesToPlates(exercises)}
      ></Barbell>

      {/* BODY */}
      <View className="px-3 w-full flex-col gap-y-2 min-h-[50%]">
        <View className="w-full flex-col items-center">
          {/* Check not empty */}
          <TextBox
            onErrors={(err) => {
              setCanContinue(!err);
            }}
            useLegend
            legendText="Workout Template Name"
            onChangeText={(text) => setWorkoutName(text)}
            maxChars={100}
            inputErrors={{ required: true }}
          />
        </View>
      </View>

      {/* Continue Button */}
      <View className="w-full flex-col items-center flex-1">
        <Button
          onPress={handleContinuePress}
          text="Continue"
          additionalStyleContainer=""
          disabled={!canContinue}
        />
      </View>

      {/* NavBar Padding */}
      {/* <View className="h-[88px]"></View> */}
    </BaseScreenNavLayout>
  );
};
export default WorkoutCreate3;
