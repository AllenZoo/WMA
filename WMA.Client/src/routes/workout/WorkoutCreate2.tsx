import Button from "@/components/buttons/Button";
import ExerciseRowCard from "@/components/cards/ExerciseRowCard";
import Barbell from "@/components/dynamic_assets/Barbell";
import ExerciseInfoDisplayModal from "@/components/modals/exerciseInfoDisplay/ExerciseInfoDisplayModal";
import useExerciseInfoModal from "@/hooks/useExerciseInfoModal";
import useScrollControl from "@/hooks/useScrollControl";
import { Exercise } from "@/stores/@types/exercise.store";
import { mapExercisesToPlates } from "@/utils/mapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutCreate2"
>;

const WorkoutCreate2 = ({ navigation, route }: WorkoutProps) => {
  const exercises = route.params?.addedExercises ?? [];
  const [refreshing, setRefreshing] = useState(false);

  const {
    exerciseInfoModalParams,
    openExerciseInfoModal,
    closeExerciseInfoModal,
  } = useExerciseInfoModal();

  const renderExerciseRow = ({ item }: { item: Exercise }) => {
    return (
      <ExerciseRowCard
        exercise={item}
        onPress={() => {
          openExerciseInfoModal(item);
        }}
      />
    );
  };

  const renderContinueButton = () => {
    return (
      <View className="w-full flex-col items-center">
        <Button
          onPress={() => {
            navigation.navigate("WorkoutCreate3", {
              addedExercises: exercises,
            });
          }}
          text="Continue"
          additionalStyleContainer=""
        />
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        className="px-3"
        ListHeaderComponent={() => (
          <Barbell
            weight={0}
            position={{ x: 0, y: 0 }}
            plates={mapExercisesToPlates(exercises)}
          />
        )}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 1000);
            }}
          />
        }
        data={exercises}
        renderItem={renderExerciseRow}
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{
          paddingVertical: 10,
          flexGrow: 1, // This replaces minHeight: "100%"
        }}
        ListFooterComponentStyle={{ paddingVertical: 20 }}
        ListFooterComponent={renderContinueButton}
      />

      <ExerciseInfoDisplayModal
        visible={exerciseInfoModalParams.visible}
        exercise={exerciseInfoModalParams.exercise}
        onClose={closeExerciseInfoModal}
      />
    </View>
  );
};

export default WorkoutCreate2;
