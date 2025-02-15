import Button from "@/components/buttons/Button";
import FilterTag from "@/components/buttons/FilterTag";
import OptionsMenu from "@/components/buttons/OptionsMenu";
import ExerciseGroupCard from "@/components/cards/ExerciseGroupCard";
import Barbell from "@/components/dynamic_assets/Barbell";
import { Exercise } from "@/stores/@types/exercise.store";
import { TEXT_HEADING_S } from "@/utils/designStyles";
import { mapExerciseGroupsToPlates } from "@/utils/mapper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, GestureResponderEvent, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { ExerciseGroup, WorkoutTemplate } from "@/stores/@types/workout.store";
import { useUserStore } from "@/stores/user.store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  useWorkoutStore,
  workoutTemplateEntityToDTO,
} from "@/stores/workout.store";
import Animated, { LinearTransition } from "react-native-reanimated";
import useScrollControl from "@/hooks/useScrollControl";
import WorkoutModificationComponent from "@/components/page/WorkoutModificationComponent";
import Toast from "react-native-toast-message";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutCreate4"
>;

// Page for modifying the weight and reps and sets of each selected exercise. User can also remove exercises from the workout.
// TODO: also allow user to add exercises to the workout.**
const WorkoutCreate4 = ({ navigation, route }: WorkoutProps) => {
  const initalExercises: Exercise[] = route.params?.addedExercises ?? [];
  const initialWorkoutName: string = route.params?.workoutName ?? "";

  const { userId } = useUserStore();
  const { addWorkoutTemplate, editWorkoutTemplate } = useWorkoutStore();

  const [workoutTemplate, setWorkoutTemplate] = useState<
    WorkoutTemplate | undefined
  >();

  // Handle Create Button Press
  const handleCreationPress = async () => {
    if (!workoutTemplate) return;
    const dto = workoutTemplateEntityToDTO(workoutTemplate);
    await addWorkoutTemplate(dto);
    navigation.popTo("WorkoutMain");

    // TODO: await API response before toast
    Toast.show({
      type: "success",
      text1: "Workout Created",
      text2: "Your workout has been created successfully!",
      visibilityTime: 3000,
    });
  };

  // Handle Save Changes Button Press
  const handleSaveChangesPress = async () => {
    if (!workoutTemplate || !workoutTemplate.id) return;

    // Change workout template updated at date
    setWorkoutTemplate((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        updatedAt: new Date(),
      };
    });

    const dto = workoutTemplateEntityToDTO(workoutTemplate);
    await editWorkoutTemplate(workoutTemplate.id, dto);
    navigation.popTo("WorkoutMain");

    // TODO: await API response before toast
    Toast.show({
      type: "success",
      text1: "Workout Updated",
      text2: "Your workout has been updated successfully!",
      visibilityTime: 3000,
    });
  };

  // Handles creating the initial workout template passed to modification component
  const initWorkoutTemplate = (): WorkoutTemplate => {
    const workoutTemplate: WorkoutTemplate = {
      id: "-1",
      name: initialWorkoutName,
      userId: userId ?? -1,
      exerciseGroups: initExerciseGroups(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (route.params?.modifyRequest?.edit) {
      const { template } = route.params.modifyRequest;
      return template;
    } else {
      return workoutTemplate;
    }
  };

  // Helper for creating initial exercise groups for the workout template
  const initExerciseGroups = (): ExerciseGroup[] => {
    // Make initial exercise groups based on initialExercises
    const exerciseGroups: ExerciseGroup[] = initalExercises?.map(
      (exercise, index) => ({
        id: uuidv4(),
        exercise: exercise,
        exerciseSets: [], // Start  with no sets
        workoutId: "-1",
        displayOrder: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    return exerciseGroups;
  };

  // Renders the submit button based on whether the user is creating a new workout or editing an existing one
  const renderSubmitButton = () => {
    if (route.params?.modifyRequest?.edit) {
      return (
        <View className="w-full flex-col items-center mt-5">
          <Button
            onPress={handleSaveChangesPress}
            text="Save Changes"
            additionalStyleContainer=""
          />
        </View>
      );
    } else {
      return (
        <View className="w-full flex-col items-center mt-5">
          <Button
            onPress={handleCreationPress}
            text="Create Workout"
            additionalStyleContainer=""
          />
        </View>
      );
    }
  };

  return (
    <View
      className="flex-1"
      onLayout={() => {
        /*handleContainerLayout*/
      }}
    >
      {/* BODY */}
      <ScrollView
        className="px-3 w-full flex-col gap-y-2"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ minHeight: "100%" }}
        //onContentSizeChange={handleContentSizeChange}
        scrollEnabled={true} //{shouldScroll} <-- not allowing scroll when add sets create enough content to scroll.
      >
        <WorkoutModificationComponent
          initialWorkoutTemplate={initWorkoutTemplate()}
          onWorkoutTemplateChange={setWorkoutTemplate}
        />

        {/* Create Button */}
        {renderSubmitButton()}
      </ScrollView>
      {/* NavBar Padding */}
      {/* <View className="h-[88px]"></View> */}
    </View>
  );
};
export default WorkoutCreate4;

export const mapExerciseGroupsToExercises = (
  exerciseGroups: ExerciseGroup[]
): Exercise[] => {
  return exerciseGroups.flatMap((group) => group.exercise);
};
