import Barbell from "@/components/dynamic_assets/Barbell";
import Plate from "@/components/dynamic_assets/Plate";
import SearcherRow from "@/components/inputs/SearcherRow";
import { Exercise, ExerciseFilter } from "@/stores/@types/exercise.store";
import { TEXT_HEADING_S } from "@/utils/designStyles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/buttons/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import CloseIcon from "../../../assets/svgs/close-icon.svg";
import { ScrollView } from "react-native-gesture-handler";
import DragDropProvider from "@/components/interactive_ui/drag_drop_system/DragDropProvider";
import { useExerciseStore } from "@/stores/exercise.store";
import TapOrPressHandler from "@/components/dynamic_assets/TapOrPressHandler";
import ExerciseInfoDisplayModal from "@/components/modals/exerciseInfoDisplay/ExerciseInfoDisplayModal";
import AddExerciseModal from "@/components/modals/AddExerciseModal";
import ExerciseFilterModal from "@/components/modals/ExerciseFilterModal";
import { useSearcherRow } from "@/hooks/useSearcherRow";
import useExerciseInfoModal from "@/hooks/useExerciseInfoModal";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutCreate1"
>;

// Before Refactoring Drag and Drop System to be more efficient
const WorkoutCreate1 = ({ navigation }: WorkoutProps) => {
  const { exercises, createExercise, getExerciseByFilter } = useExerciseStore();
  const sr = useSearcherRow({
    onSearch: (searchTerm: string) => {
      // Handle search
      const filterString: ExerciseFilter = {
        searchName: searchTerm.length > 0 ? searchTerm : null,
      };
      sr.handleFilter({ ...sr.filter, ...filterString });
    },
    onFilter: async (newFilter: ExerciseFilter | null) => {
      var filteredExercises = await getExerciseByFilter(newFilter ?? {});
      setFilteredExercises(filteredExercises);
    },
  });

  const [addedExercises, setAddedExercises] = useState<Exercise[]>([]); // Added to current workout creation exercises.
  const [barbellKey, setBarbellKey] = useState<number>(0); // Used for forcing rerender of barbell.
  const [canContinue, setCanContinue] = useState<boolean>(false); // Whether we can continue to next screen.

  const {
    exerciseInfoModalParams,
    openExerciseInfoModal,
    closeExerciseInfoModal,
  } = useExerciseInfoModal();

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  // Adds Exercise to Selected Exercises
  const handleAddExercise = useCallback((exercise: Exercise) => {
    if (!exercise.exerciseId) {
      console.warn("Attempted to add exercise without ID:", exercise);
      return;
    }

    setAddedExercises((prevExercises) => {
      // Check if exercise already exists
      const isDuplicate = prevExercises.some(
        (ex) => ex.exerciseId === exercise.exerciseId
      );

      if (isDuplicate) {
        console.log("Prevented duplicate addition of exercise:", exercise.name);
        return prevExercises;
      }

      return [...prevExercises, exercise];
    });
  }, []);

  const handleRemoveExercise = (exerciseId: number) => {
    setAddedExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.exerciseId !== exerciseId)
    );
  };

  const handleContinuePress = () => {
    navigation.navigate("WorkoutCreate2", { addedExercises });
  };

  const renderAddedExercisePlate = useCallback(
    ({ item: exercise }: { item: Exercise }) => (
      <View key={exercise.exerciseId} className="scale-[0.9]">
        <View className="flex-col items-center bg-white py-1 px-2 rounded-lg shadow-md transition-all">
          <View className="absolute -top-0 -right-0 z-10">
            <TouchableOpacity
              onPress={() => handleRemoveExercise(exercise.exerciseId!)}
            >
              <CloseIcon width={20} height={20} fill={"black"} />
            </TouchableOpacity>
          </View>
          <Plate radius={42} holeRadius={14} colour={exercise.plateColour} />
          <Text>{exercise.name ?? "Exercise With No Name"}</Text>
        </View>
      </View>
    ),
    [] // Removed unnecessary dependencies
  );

  const renderExercisePlate = useCallback(
    ({ item: exercise }: { item: Exercise }) => (
      <View key={exercise.exerciseId} className="scale-[0.9]">
        <TapOrPressHandler
          onTap={() => handleAddExercise(exercise)}
          onPress={() => {
            openExerciseInfoModal(exercise);
          }}
        >
          <View
            className="bg-white p-2 rounded-lg shadow-md active:shadow-lg 
          active:scale-105 transition-all"
          >
            <View className="flex-col items-center">
              <Plate
                radius={42}
                holeRadius={14}
                colour={exercise.plateColour?.toLocaleLowerCase()}
              />
              <Text>{exercise.name ?? "Exercise With No Name"}</Text>
            </View>
          </View>
        </TapOrPressHandler>
      </View>
    ),
    [] // Updated dependencies
  );

  useEffect(() => {
    setCanContinue(addedExercises.length > 0);
    setBarbellKey((prevKey) => prevKey + 1); // For forcing rerender of barbell.
  }, [addedExercises]);

  return (
    <DragDropProvider
      onItemMoved={(targetId, itemId, item) => {
        // console.log("Item Moved Trigger!");
        if (item.data) {
          handleAddExercise(item.data);
        }
      }}
    >
      <View className="flex-1">
        {/* Body */}
        <View className="flex-1 w-full">
          <View className="w-full flex-col flex-1 h-full">
            {/* Header [Searcher Row + Drop Zone] */}
            <View style={{ zIndex: 10 }}>
              <SearcherRow
                searchRef={sr.searchTextBoxRef}
                onSearchChange={(text: string) => {
                  sr.updateSearch(text);
                }}
                onAddPress={() => {
                  sr.setDisplayAddModal(true);
                }}
                onFilterPress={() => {
                  sr.setDisplayFilterModal(true);
                }}
                showClearFilter={sr.filter !== null}
                onClearFilter={() => {
                  sr.clearFilter();
                }}
              />
              {/* Drop Zone Component */}
              <View className=" h-[100px] w-full mb-2">
                <Barbell
                  key={barbellKey}
                  weight={0}
                  position={{ x: 0, y: 0 }}
                  plates={addedExercises.map((exercise) => ({
                    colour: exercise.plateColour || "",
                  }))}
                />
              </View>
            </View>

            {/* Body [Added Exercises + All Exercises] */}
            <View
              className="px-3 w-full flex-col flex-1"
              style={{ zIndex: 20 }}
            >
              {/* Added Exercises */}
              <View>
                <Text className={`${TEXT_HEADING_S} font-bold`}>
                  Added Exercises
                </Text>
                <FlatList
                  data={addedExercises}
                  renderItem={renderAddedExercisePlate}
                  keyExtractor={(item) => item.exerciseId!.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                  ItemSeparatorComponent={() => <View className="w-0" />}
                />
              </View>

              {/* All Exercises */}
              <ScrollView className="flex-1" stickyHeaderIndices={[0]}>
                <Text className={`${TEXT_HEADING_S} font-bold bg-[#f2f2f2]`}>
                  All Exercises
                </Text>
                <View className="w-full flex-row flex-wrap justify-start mt-2 mb-2">
                  {!sr.filter &&
                    exercises.map((exercise) =>
                      renderExercisePlate({ item: exercise })
                    )}
                  {sr.filter &&
                    filteredExercises.map((exercise) =>
                      renderExercisePlate({ item: exercise })
                    )}
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
              </ScrollView>
            </View>
          </View>
        </View>
        {/* NavBar Padding */}
        {/* <View className="h-[88px]"></View> */}
      </View>

      <ExerciseInfoDisplayModal
        onClose={() => {
          closeExerciseInfoModal();
        }}
        visible={exerciseInfoModalParams.visible}
        exercise={exerciseInfoModalParams.exercise}
      />

      <AddExerciseModal
        visible={sr.displayAddModal}
        onClose={() => sr.setDisplayAddModal(false)}
        onAdd={(exercise: Exercise) => {
          createExercise(exercise);
          sr.setDisplayAddModal(false);
        }}
      />

      <ExerciseFilterModal
        visible={sr.displayFilterModal}
        onClose={() => {
          sr.setDisplayFilterModal(false);
        }}
        onApply={(filter) => {
          sr.addFilter(filter);
          sr.setDisplayFilterModal(false);
        }}
      />
    </DragDropProvider>
  );
};

export default WorkoutCreate1;
