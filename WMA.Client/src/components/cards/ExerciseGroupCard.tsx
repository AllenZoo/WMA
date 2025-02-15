import { Exercise } from "@/stores/@types/exercise.store";
import {
  ExerciseGroup,
  ExerciseGroupDto,
  ExerciseSet,
  ExerciseSetDto,
} from "@/stores/@types/workout.store";
import { TEXT_BODY_L, TEXT_BODY_M } from "@/utils/designStyles";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import TextBox from "../inputs/TextBox";
import OptionsMenu from "../buttons/OptionsMenu";
import { FlatList } from "react-native-gesture-handler";
import Button from "../buttons/Button";
import NumericInputBox from "../inputs/NumericInputBox";
import CheckIcon from "../../../assets/svgs/check-icon.svg";
import DeleteIcon from "../../../assets/svgs/delete-icon.svg";
import SwapIcon from "../../../assets/svgs/swap-icon.svg";
import AddNoteIcon from "../../../assets/svgs/add-note-icon.svg";
import CheckBox from "../buttons/CheckBox";
import TimerInputBox from "../inputs/TimerInputBox";
import NumberSliderInputBox from "../inputs/NumberSliderInputBox";
import OptionsTextButtonMenu from "../buttons/OptionsTextButton";

interface IExerciseGroupCardProps {
  exerciseGroup: ExerciseGroup;
  completable?: boolean; // Determines if sets are completable (checkboxes)
  onAddSet?: (exerciseGroupId: string) => void;
  onDeleteSet?: (exerciseGroupId: string, setId: string) => void;
  onRemoveExercise?: (exerciseGroupId: string) => void;
  onSwapExercise?: (exerciseGroupId: string) => void;
  onAddNote?: (exerciseGroupId: string) => void;
}

// Displays an empty exercise group card with the exercise name and a list of sets
// Essentially like a form (maybe rename)
const ExerciseGroupCard = ({
  exerciseGroup,
  completable = true,
  onAddSet,
  onDeleteSet,
  onRemoveExercise,
  onSwapExercise,
  onAddNote,
}: IExerciseGroupCardProps) => {
  const addEmptySet = () => {
    onAddSet?.(exerciseGroup.id);
  };

  const deleteSet = (setId: string) => {
    onDeleteSet?.(exerciseGroup.id, setId);
  };

  const tableColumnWidths = ["w-8", "w-16", "w-16", "w-16", "w-8"];

  const renderSetRow = ({ item }: { item: ExerciseSet }) => {
    return (
      <View className="flex-row justify-around items-center" key={item.id}>
        {/* Set number*/}
        <View className={`${tableColumnWidths[0]} items-center`}>
          <OptionsTextButtonMenu
            options={[
              {
                label: "Delete Set",
                onSelect: () => deleteSet(item.id),
                leadingIcon: () => <DeleteIcon width={24} height={24} />,
              },
            ]}
            buttonText={(
              exerciseGroup.exerciseSets.indexOf(item) + 1
            ).toString()}
          />
        </View>

        {/* History eg. 125 lb x 5*/}
        <View className={`${tableColumnWidths[1]} items-center`}>
          <Text className={`${TEXT_BODY_M}`}>
            {/* Previous value - you might want to fetch this dynamically */}-
          </Text>
        </View>

        {/* Weight lbs/kg */}
        <View className={`${tableColumnWidths[2]} items-center`}>
          <NumericInputBox styles="w-16" maxChars={5} />
        </View>

        {/* Reps */}
        <View className={`${tableColumnWidths[3]} items-center`}>
          <NumericInputBox styles="w-16" maxChars={3} />
        </View>

        {/* Completed checkbox or toggle */}
        <View className={`${tableColumnWidths[4]} items-center`}>
          <View>
            <CheckBox disabled={!completable} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="w-full flex-col gap-y-2">
      <View>
        {/* Exercise Name Header + Options Menu*/}
        <View className="flex-row justify-between">
          <Text className={`${TEXT_BODY_L} font-bold`}>
            {exerciseGroup.exercise.name}
          </Text>
          <View>
            <OptionsMenu
              options={[
                {
                  label: "Remove Exercise",
                  onSelect: () => onRemoveExercise?.(exerciseGroup.id),
                  leadingIcon: () => <DeleteIcon width={24} height={24} />,
                },
                {
                  label: "Swap Exercise",
                  onSelect: () => onSwapExercise?.(exerciseGroup.id),
                  leadingIcon: () => <SwapIcon width={24} height={24} />,
                },
                {
                  label: "Add Note",
                  onSelect: () => onAddNote?.(exerciseGroup.id),
                  leadingIcon: () => <AddNoteIcon width={24} height={24} />,
                },
              ]}
            />
          </View>
        </View>

        {/* Meta Row */}
        <View className="flex-row gap-x-2">
          {/* RPE */}
          <View className="flex-row items-center justify-start ">
            <Text className={`${TEXT_BODY_M} mr-2`}>Intended RPE:</Text>

            <View>
              <NumberSliderInputBox
                min={1}
                max={10}
                step={1}
                initialValue={1}
                onChange={() => {}}
              />
            </View>
          </View>
          {/* Rest Time */}
          <View className="flex-row items-center justify-start gap-x-2 ">
            <Text className={`${TEXT_BODY_M}`}>Rest Time:</Text>
            <View>
              <TimerInputBox />
            </View>
          </View>
        </View>

        {/* Sets */}
        <View className="mt-2">
          {/* Sets Header */}
          <View className="flex-row justify-around">
            <View className={`${tableColumnWidths[0]} items-center`}>
              <Text className={`${TEXT_BODY_M}`}>Set</Text>
            </View>
            <View className={`${tableColumnWidths[1]} items-center`}>
              <Text className={`${TEXT_BODY_M}`}>Previous</Text>
            </View>
            <View className={`${tableColumnWidths[2]} items-center`}>
              <Text className={`${TEXT_BODY_M}`}>lbs</Text>
            </View>
            <View className={`${tableColumnWidths[3]} items-center`}>
              <Text className={`${TEXT_BODY_M}`}>Reps</Text>
            </View>
            <View
              className={`${tableColumnWidths[4]} items-center flex-col justify-center`}
            >
              {/* <Text className={`${TEXT_BODY_M}`}>Lock</Text> */}
              <CheckIcon width={28} height={28} />
            </View>
          </View>

          {/* Sets */}
          <View>
            <FlatList
              scrollEnabled={false}
              data={exerciseGroup.exerciseSets}
              renderItem={renderSetRow}
            />
          </View>
        </View>

        {/* Add Set Button */}
        <View>
          <Button
            onPress={addEmptySet}
            text="Add Set"
            additionalStyleContainer="h-8 w-full p-0"
          />
        </View>
      </View>
    </View>
  );
};
export default ExerciseGroupCard;
