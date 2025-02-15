import Barbell from "@/components/dynamic_assets/Barbell";
import Plate from "@/components/dynamic_assets/Plate";
import SearcherRow from "@/components/inputs/SearcherRow";
import DragDropZone from "@/components/interactive_ui/DragDropZone";
import { Exercise } from "@/stores/@types/exercise.store";
import { TEXT_HEADING_S } from "@/utils/designStyles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/buttons/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import UploadIcon from "../../../assets/svgs/drag-and-drop/upload-icon.svg";
import CloseIcon from "../../../assets/svgs/close-icon.svg";
import { ScrollView } from "react-native-gesture-handler";
import DragDropProvider from "@/components/interactive_ui/drag_drop_system/DragDropProvider";
import DropZone from "@/components/interactive_ui/drag_drop_system/DropZone";
import Draggable from "@/components/interactive_ui/drag_drop_system/Draggable";
import { useExerciseStore } from "@/stores/exercise.store";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutCreate1"
>;

// Before Refactoring Drag and Drop System to be more efficient
const WorkoutCreate1 = ({ navigation }: WorkoutProps) => {
  // TODO: useSearcherRow.
  const [addedExercises, setAddedExercises] = useState<Exercise[]>([]);
  const [barbellKey, setBarbellKey] = useState<number>(0); // Used for forcing rerender of barbell.
  const [displayAddExerciseDropZone, setDisplayAddExerciseDropZone] =
    useState<boolean>(false);

  const [canContinue, setCanContinue] = useState<boolean>(false);

  const bodyScrollRef = useRef(null);
  const addedExercisesScrollRef = useRef(null);
  const allExercisesScrollRef = useRef(null);

  const { exercises } = useExerciseStore();

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

  const handleItemDragStart = () => {
    setDisplayAddExerciseDropZone(true);
  };

  const handleItemDragEnd = () => {
    setTimeout(() => {
      setDisplayAddExerciseDropZone(false);
    }, 300);
  };

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
        <View className="flex-col items-center bg-white p-4 rounded-lg shadow-md transition-all">
          <View className="absolute -top-0 -right-0 z-10">
            <TouchableOpacity
              onPress={() => handleRemoveExercise(exercise.exerciseId!)}
            >
              <CloseIcon width={24} height={24} fill={"black"} />
            </TouchableOpacity>
          </View>
          <Plate colour={exercise.plateColour} />
          <Text>{exercise.name ?? "Exercise With No Name"}</Text>
        </View>
      </View>
    ),
    [] // Removed unnecessary dependencies
  );

  const renderExercisePlate = useCallback(
    ({ item: exercise }: { item: Exercise }) => (
      <View key={exercise.exerciseId} className="scale-[0.9]">
        <Draggable
          onDragStart={handleItemDragStart}
          onDragEnd={handleItemDragEnd}
          item={{
            id: exercise.exerciseId!.toString(),
            sourceId: "n/a",
            label: exercise.name ?? "Exercise With No Name",
            data: exercise,
          }}
          scrollRefs={[
            addedExercisesScrollRef,
            bodyScrollRef,
            allExercisesScrollRef,
          ]}
          additionalStyling="bg-white p-4 rounded-lg shadow-md active:shadow-lg 
          active:scale-105 transition-all"
        >
          <View className="flex-col items-center">
            <Plate colour={exercise.plateColour?.toLocaleLowerCase()} />
            <Text>{exercise.name ?? "Exercise With No Name"}</Text>
          </View>
        </Draggable>
      </View>
    ),
    [handleItemDragStart, handleItemDragEnd] // Updated dependencies
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
                onSearchChange={(text: string) => {}}
                onAddPress={() => {}}
                onFilterPress={() => {}}
                showClearFilter={false}
                onClearFilter={() => {}}
              />
              {/* Drop Zone Component */}
              <View className=" h-[100px] w-full mb-2">
                {!displayAddExerciseDropZone && (
                  <Barbell
                    key={barbellKey}
                    weight={0}
                    position={{ x: 0, y: 0 }}
                    plates={addedExercises.map((exercise) => ({
                      colour: exercise.plateColour || "",
                    }))}
                  />
                )}

                {/* Drop Zone */}
                <View className="w-full flex-col items-center justify-center">
                  <DropZone
                    id="target"
                    additionalStyling="flex-col items-center justify-center"
                    visible={displayAddExerciseDropZone}
                  >
                    <DragDropZone
                      dropZoneId="target"
                      dragDropText="Drop here to add exercise!"
                      centerNode={
                        <Barbell
                          key={barbellKey}
                          weight={0}
                          position={{ x: 0, y: 0 }}
                          plates={addedExercises.map((exercise) => ({
                            colour: exercise.plateColour || "",
                          }))}
                        />
                      }
                      svgIcon={UploadIcon}
                      iconFill="black"
                      containerStyle="h-[110px]"
                      onDragEnter={() => {}}
                      onDragLeave={() => {}}
                      onDrop={() => {}}
                    />
                  </DropZone>
                </View>
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
                  ref={addedExercisesScrollRef}
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
              <ScrollView
                ref={allExercisesScrollRef}
                className="flex-1"
                stickyHeaderIndices={[0]}
              >
                <Text className={`${TEXT_HEADING_S} font-bold bg-[#f2f2f2]`}>
                  All Exercises
                </Text>
                <View className="w-full flex-row flex-wrap justify-start mt-2 mb-2">
                  {exercises.map((exercise) =>
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
    </DragDropProvider>
  );
};

export default WorkoutCreate1;
