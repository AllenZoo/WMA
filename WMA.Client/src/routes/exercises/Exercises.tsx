import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuthStore } from "@/stores/auth.store";
import BaseScreenNavLayout from "@/components/layouts/BaseNavbar";
import {
  IconAddButton,
  IconFilterButton,
} from "@/components/buttons/IconButton";
import TextBox from "@/components/inputs/TextBox";
import ExerciseRowCard from "@/components/cards/ExerciseRowCard";
import BaseScreen from "@/components/layouts/Base";
import TestIcon from "../../../assets/svgs/stump-icon.svg";
import { useExerciseStore } from "@/stores/exercise.store";
import Button from "@/components/buttons/Button";
import {
  TEXT_BODY_L,
  TEXT_HEADING_L,
  TEXT_HEADING_M,
} from "@/utils/designStyles";
import AddExerciseModal from "@/components/modals/AddExerciseModal";
import ExerciseInfoDisplayModal from "@/components/modals/exerciseInfoDisplay/ExerciseInfoDisplayModal";
import { Exercise, ExerciseFilter } from "@/stores/@types/exercise.store";
import { fetchAccessToken } from "@/stores/keys.store";
import ExerciseFilterModal from "@/components/modals/ExerciseFilterModal";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// type ExercisesProps = {} & NativeStackScreenProps<
//   RootStackNavigatorParamsList,
//   "Exercises"
// >;

// type ExercisesProps = CompositeScreenProps<
//   BottomTabScreenProps<MainPageTabParamList, "Exercises">,
//   NativeStackScreenProps<RootStackNavigatorParamsList>
// >;

// type ExercisesProps = {} & BottomTabScreenProps<
//   MainPageTabParamList,
//   "Exercises"
// >;

// TODO: temp fix
type ExercisesProps = any;

const Exercises = ({ navigation }: ExercisesProps) => {
  const { signOut } = useAuthStore();
  const {
    exercises,
    filteredExercises,
    getExercises,
    getExerciseByFilter,
    createExercise,
  } = useExerciseStore();
  const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);

  const [search, setSearch] = useState("");
  const searchTextBoxRef = React.useRef<TextInput>(null);
  const [filter, setFilter] = useState<ExerciseFilter | null>(null);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const [displayAddModal, setDisplayAddModal] = useState(false);

  const [displayExerciseInfoModal, setDisplayExerciseInfoModal] =
    useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>();

  const [refreshing, setRefreshing] = useState(false);

  // Handles refreshing the exercises
  const onRefresh = async () => {
    // Only show refresh indicator if it takes longer than 1 second to load data.
    let refreshTimeout: number;
    const showRefreshIndicator = new Promise<void>((resolve) => {
      refreshTimeout = setTimeout(() => {
        setRefreshing(true);
        resolve();
      }, 1000);
    });

    // Fetch exercises. Fetch with filter if filter is set. Otherwise, fetch all exercises.
    const fetchPromise = (
      filter ? getExerciseByFilter(filter) : getExercises()
    ).then((fetchedExercises) => {
      setDisplayedExercises(fetchedExercises);
      setRefreshing(false);
      clearTimeout(refreshTimeout);
    });

    await Promise.race([showRefreshIndicator, fetchPromise]);

    // If fetch takes longer than 3 second, stop rerefreshing
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  };

  const filterString: ExerciseFilter = {
    searchName: null,
  };

  const handleAddExercise = (exercise: Exercise) => {
    console.log("Add Exercise: ", exercise);
    createExercise(exercise);
    onRefresh();
  };

  const handleFilter = (filter: ExerciseFilter) => {
    setFilter(filter);
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDisplayExerciseInfoModal(true);
  };

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  useEffect(() => {
    if (exercises.length > 0) {
      setDisplayedExercises(exercises);
    } else {
      onRefresh();
    }
  }, []);

  useEffect(() => {
    onRefresh();
    // if filter is an object with all null values, set filter to null
    for (const key in filter) {
      if (filter[key as keyof ExerciseFilter] !== null) {
        return;
      }
    }

    setFilter(null);
    onRefresh();
  }, [filter]);

  useEffect(() => {
    if (search.length > 0) {
      filterString.searchName = search;
      setFilter((prevFilter) => ({ ...prevFilter, ...filterString }));
    } else {
      filterString.searchName = null;
      setFilter((prevFilter) => ({ ...prevFilter, ...filterString }));
    }
  }, [search]);

  return (
    <View className="flex-1 w-full h-full">
      {/* Searcher Row + Clear Filter */}
      <View className="w-full flex-1">
        {/* Exercise Card Display  */}
        {/* TODO-OPT: think about using FlatList instead of ScrollView for performance opt. TBH tried it performance didn't feel any different. */}
        <ScrollView
          className="w-full px-2 flex-1 gap-y-2 pt-2"
          // scrollEnabled={exercises.length > 0}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* BUTTONS + SEARCH BAR */}
          <View className="flex-row justify-between px-2 w-full">
            <IconAddButton
              onPress={() => setDisplayAddModal(true)}
              iconSize={38}
            />
            <TextBox
              ref={searchTextBoxRef}
              onErrors={(state: boolean) => {
                // Handle errors
              }}
              onChangeText={(text: string) => {
                updateSearch(text);
              }}
              placeholder="Search"
              widthPercent="64"
            />
            <IconFilterButton
              onPress={() => {
                setDisplayFilterModal(true);
              }}
              iconSize={38}
            />
          </View>

          {/* Clear Filter Button */}
          <View className="flex-row justify-center px-2">
            {filter && (
              <Button
                text="Clear Filter"
                additionalStyleContainer="bg-red-500 w-full h-8 py-0"
                onPress={() => {
                  setFilter(null);
                  searchTextBoxRef.current?.clear();
                }}
              />
            )}
          </View>
          {displayedExercises != undefined &&
            displayedExercises.map((exercise, index) => (
              <View key={index}>
                <ExerciseRowCard
                  key={index}
                  exercise={exercise}
                  // name={exercise.name}
                  // muscleGroup={exercise.muscleGroups}
                  icon={TestIcon}
                  onPress={(exercise) => {
                    handleExercisePress(exercise);
                  }}
                />
              </View>
            ))}

          {exercises.length <= 0 && (
            <View className={` flex-1 h-full`}>
              <Text className={`${TEXT_BODY_L} text-center`}>
                Currently No Exercises {"\n"}
                <Text onPress={onRefresh} className={`text-blue-400`}>
                  Refresh
                </Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <AddExerciseModal
        visible={displayAddModal}
        onClose={() => setDisplayAddModal(false)}
        onAdd={handleAddExercise}
      />

      <ExerciseFilterModal
        visible={displayFilterModal}
        onClose={() => {
          setDisplayFilterModal(false);
        }}
        onApply={(filter) => {
          handleFilter(filter);
          setDisplayFilterModal(false);
        }}
      />

      <ExerciseInfoDisplayModal
        // TODO: ensure selectedExercise cannot be null if modal is displayed
        exercise={selectedExercise!}
        visible={displayExerciseInfoModal}
        onClose={() => setDisplayExerciseInfoModal(false)}
      />
    </View>
  );
};

export default Exercises;
