import { ExerciseGroup, WorkoutTemplate } from "@/stores/@types/workout.store";
import React, { useCallback, useEffect, useMemo, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import ExerciseGroupCard from "../cards/ExerciseGroupCard";
import Barbell from "../dynamic_assets/Barbell";
import { View, Text, FlatList } from "react-native";
import OptionsMenu from "../buttons/OptionsMenu";
import DeleteIcon from "../../../assets/svgs/delete-icon.svg";
import EditIcon from "../../../assets/svgs/edit-icon.svg";
import { TEXT_HEADING_S } from "@/utils/designStyles";

interface IWorkoutModificationComponentProps {
  initialWorkoutTemplate: WorkoutTemplate;
  onWorkoutTemplateChange?: (workoutTemplate: WorkoutTemplate) => void;
  checkable?: boolean; // Determines if the exercise sets are checkable
}

// Memoized ExerciseGroupCard with proper comparison
const MemoizedExerciseGroupCard = memo(
  ExerciseGroupCard,
  (prevProps, nextProps) => {
    return (
      prevProps.exerciseGroup.id === nextProps.exerciseGroup.id &&
      prevProps.exerciseGroup.exerciseSets.length ===
        nextProps.exerciseGroup.exerciseSets.length
    );
  }
);

const ItemSeparator = memo(() => <View className="h-2" />);

const WorkoutModificationComponent: React.FC<
  IWorkoutModificationComponentProps
> = ({
  initialWorkoutTemplate,
  onWorkoutTemplateChange,
  checkable = false,
}) => {
  const [workoutTemplate, setWorkoutTemplate] = React.useState<WorkoutTemplate>(
    initialWorkoutTemplate
  );

  const updateExerciseGroup = useCallback(
    (updateFn: (prev: ExerciseGroup[]) => ExerciseGroup[]) => {
      setWorkoutTemplate((prev) => {
        if (!prev) return prev;
        const updatedGroups = updateFn(prev.exerciseGroups);
        return {
          ...prev,
          exerciseGroups: updatedGroups,
        };
      });
    },
    []
  );

  const addSetToExerciseGroup = useCallback((exerciseGroupId: string) => {
    updateExerciseGroup((prev) => {
      const newExerciseGroups = prev.map((group) => {
        if (group.id !== exerciseGroupId) return group;

        return {
          ...group,
          exerciseSets: [
            ...group.exerciseSets,
            {
              id: uuidv4(),
              exerciseGroupId: exerciseGroupId,
              reps: 0,
              weightKG: 0,
              negativeWeightKG: 0,
              addOnWeightKG: 0,
              duration: 0,
              rpe: 0,
              distance: 0,
              displayOrder: group.exerciseSets.length,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };
      });
      return newExerciseGroups;
    });
  }, []);

  const removeSetFromExerciseGroup = useCallback(
    (exerciseGroupId: string, setId: string) => {
      updateExerciseGroup((prev) => {
        return prev.map((group) => {
          if (group.id !== exerciseGroupId) return group;

          return {
            ...group,
            exerciseSets: group.exerciseSets.filter((set) => set.id !== setId),
          };
        });
      });
    },
    []
  );

  const removeExerciseGroup = useCallback((exerciseGroupId: string) => {
    updateExerciseGroup((prev) =>
      prev.filter((group) => group.id !== exerciseGroupId)
    );
  }, []);

  const menuOptions = useMemo(
    () => [
      {
        label: "Edit Name",
        onSelect: () => {},
        leadingIcon: () => <EditIcon height={28} width={28} />,
      },
      {
        label: "Delete Workout",
        onSelect: () => {},
        leadingIcon: () => <DeleteIcon height={24} width={24} />,
      },
    ],
    []
  );

  const renderExerciseGroup = useCallback(
    ({ item: exerciseGroup }: { item: ExerciseGroup; index: number }) => (
      <MemoizedExerciseGroupCard
        key={exerciseGroup.id}
        exerciseGroup={exerciseGroup}
        completable={checkable}
        onAddSet={addSetToExerciseGroup}
        onDeleteSet={removeSetFromExerciseGroup}
        onRemoveExercise={removeExerciseGroup}
      />
    ),
    [addSetToExerciseGroup, removeSetFromExerciseGroup, removeExerciseGroup]
  );

  const renderMainBody = useCallback(() => {
    // Render the main body of the workout modification component
    // Alternative to using a FlatList
    return workoutTemplate.exerciseGroups.map((exerciseGroup) => (
      <MemoizedExerciseGroupCard
        key={exerciseGroup.id}
        exerciseGroup={exerciseGroup}
        completable={checkable}
        onAddSet={addSetToExerciseGroup}
        onDeleteSet={removeSetFromExerciseGroup}
        onRemoveExercise={removeExerciseGroup}
      />
    ));
  }, []);

  // Use getItemLayout to optimize FlatList rendering
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 100, // Adjust this based on your ExerciseGroupCard height
      offset: 100 * index + index * 8, // height * index + separator height
      index,
    }),
    []
  );

  useEffect(() => {
    onWorkoutTemplateChange?.(workoutTemplate);
  }, [workoutTemplate, onWorkoutTemplateChange]);

  return (
    <>
      <Barbell weight={0} position={{ x: 0, y: 0 }} workout={workoutTemplate} />

      <View className="flex-row align-center items-center gap-x-2">
        <View>
          <Text className={`${TEXT_HEADING_S} font-bold`}>
            {workoutTemplate.name}
          </Text>
        </View>
        <View>
          <OptionsMenu options={menuOptions} />
        </View>
      </View>

      <View className="w-full flex-col gap-y-2">
        <FlatList
          data={workoutTemplate.exerciseGroups}
          renderItem={renderExerciseGroup}
          keyExtractor={useCallback((item: { id: any }) => item.id, [])}
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={false}
          removeClippedSubviews={false} // Changed to false to ensure visibility
          initialNumToRender={10} // Increased to show more items initially
          getItemLayout={getItemLayout}
          extraData={workoutTemplate.exerciseGroups} // Added to ensure updates trigger re-render
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>
    </>
  );
};

export default WorkoutModificationComponent;
