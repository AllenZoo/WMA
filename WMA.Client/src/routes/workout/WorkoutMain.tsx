import WorkoutBottomSheet from "@/components/bottomsheet/WorkoutBottomSheet";
import Button from "@/components/buttons/Button";
import WorkoutTemplateCard from "@/components/cards/WorkoutTemplateCard";
import WorkoutTemplateInfoDisplay from "@/components/modals/workoutInfoDisplay/WorkoutTemplateInfoDisplay";
import useScrollControl from "@/hooks/useScrollControl";
import { useSearcherRow } from "@/hooks/useSearcherRow";
import useTimer from "@/hooks/useTimer";
import { Exercise } from "@/stores/@types/exercise.store";
import { Time } from "@/hooks/useTimer";
import {
  WorkoutFilterDto,
  WorkoutSession,
  WorkoutTemplate,
  WorkoutTemplateDto,
} from "@/stores/@types/workout.store";
import {
  useWorkoutStore,
  workoutSessionDTOToEntity,
  workoutSessionEntityToDTO,
  workoutTemplatesDTOToEntity,
} from "@/stores/workout.store";
import { TEXT_BODY_L } from "@/utils/designStyles";

import THEMES from "@/utils/themes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import WorkoutFilterModal from "@/components/modals/WorkoutFilterModal";
import { useUserStore } from "@/stores/user.store";
import SearcherRow from "@/components/inputs/SearcherRow";
import { TextInput } from "react-native-paper";
import DeleteModal from "@/components/modals/DeleteModal";

type WorkoutProps = {} & NativeStackScreenProps<
  WorkoutStackNavigatorParamsList,
  "WorkoutMain"
>;

type WorkoutTemplateWithExerciseInfo = {
  workoutTemplate: WorkoutTemplate;
  exerciseInfo: Exercise[];
};

type WorkoutInfoDisplayParams = {
  workout?: WorkoutTemplate;
  visible: boolean;
};

type WorkoutDeleteModalParams = {
  visible: boolean;
  templateId?: string;
};

type WorkoutBottomSheetParams = {
  workout?: WorkoutSession; //TODO: refactor to WorkoutSession
  timer?: Time;
  visible: boolean;
};

const WorkoutMain = ({ navigation }: WorkoutProps) => {
  const workoutStore = useWorkoutStore();
  const {
    workoutTemplates,
    removeWorkoutTemplate,
    getWorkoutTemplates,
    // filteredWorkoutSessions,
    startWorkoutSession,
    completeWorkoutSession,
    cancelWorkoutSession,
    getWorkoutSessionsFiltered,
    getWorkoutSessions,
  } = workoutStore;

  const { shouldScroll, handleContainerLayout, handleContentSizeChange } =
    useScrollControl({ navbarPadding: 88 });

  const [refreshing, setRefreshing] = useState(false);
  const [displayInfoModal, setDisplayInfoModal] =
    useState<WorkoutInfoDisplayParams>({ workout: undefined, visible: false });
  const [displayDeleteModal, setDisplayDeleteModal] =
    useState<WorkoutDeleteModalParams>({
      visible: false,
      templateId: undefined,
    });

  // TODO-OPT: temporarily using this since using the workoutStore.filteredWorkoutSessions directly was causing issues. (filteredWorkoutSessions was not updating)
  const [filteredWorkoutSessions, setFilteredWorkoutSessions] = useState<
    WorkoutTemplate[]
  >([]);

  const { time, startTimer, stopTimer, resetTimer } = useTimer({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bottomSheetState, setBottomSheetState] =
    useState<WorkoutBottomSheetParams>({
      workout: undefined,
      timer: time,
      visible: false,
    });

  // Default quickstart workout template
  const quickStartWorkoutTemplate: WorkoutTemplate = {
    id: null,
    name: "Quickstart",
    // TODO: modify logic such that useUserStore().userId always exists
    userId: useUserStore().userId ?? 1003, // userId only stored after user logs in. Thus, default to something that exists for now.

    exerciseGroups: [],
  };

  const sr = useSearcherRow({
    onSearch: (searchTerm: string) => {
      // Handle search
      const filterString: WorkoutFilterDto = {
        searchString: searchTerm.length > 0 ? searchTerm : null,
      };
      sr.handleFilter({ ...sr.filter, ...filterString });
    },
    onFilter: async (newFilter: WorkoutFilterDto | null) => {
      var filteredTemplateDTOs = await workoutStore.getWorkoutTemplatesFiltered(
        newFilter ?? {}
      );
      var filteredTemplates =
        await workoutTemplatesDTOToEntity(filteredTemplateDTOs);
      setFilteredWorkoutSessions(filteredTemplates);
    },
  });

  // Checks if there is a running active workout session and initializes the bottom sheet accordingly.
  async function initBottomSheet() {
    // Check for active workout sessions
    var sessionsDto = await getWorkoutSessionsFiltered({
      sessionStatus: "active",
    });

    if (sessionsDto.length > 0) {
      console.log("Active workout session found!");
      var session = await workoutSessionDTOToEntity(sessionsDto[0]);
      // TODO-OPT: Check calculate time elapsed since startedAt and then set that as initial time for timer.
      setBottomSheetState((prev) => ({
        ...prev,
        workout: session,
        visible: true,
      }));
      startTimer();
    }
  }

  const handleAddWorkout = () => {
    navigation.navigate("WorkoutCreate1");
  };

  // Renders the part above the list
  const renderHeaderSection = () => {
    return (
      <View className="w-full my-2">
        {/* Searcher Row (Search and Filter) */}
        <View>
          <SearcherRow
            searchRef={sr.searchTextBoxRef}
            onSearchChange={(text: string) => {
              sr.updateSearch(text);
            }}
            onAddPress={handleAddWorkout}
            onFilterPress={() => {
              sr.setDisplayFilterModal(true);
            }}
            showClearFilter={sr.filter !== null}
            onClearFilter={() => {
              sr.clearFilter();
            }}
          />
        </View>

        {/* Quick Start and AI Session Button */}
        <View className="flex-col justify-center items-center w-full">
          <Button
            text="Quickstart"
            onPress={() => {
              handleStartWorkout(quickStartWorkoutTemplate);
            }}
            additionalStyleContainer="w-full"
            backgroundColor={THEMES.dark.attention.success}
            textColor="#05080a"
          />
          <Button
            text="Start AI Session"
            onPress={() => {
              console.log("starting ai workout session!");
            }}
            additionalStyleContainer="w-full"
            backgroundColor={THEMES.dark.secondary.DEFAULT}
          />
        </View>
      </View>
    );
  };

  // Renders the part below the list
  const renderFooterSection = () => {
    return (
      <>
        {/* NavBar Padding */}
        <View className="h-[88px]"></View>
      </>
    );
  };

  // Renders the individual workout template cards
  const renderWorkoutTemplate = ({
    item: template,
  }: {
    item: WorkoutTemplate;
  }) => {
    return (
      <View className="flex-col">
        <WorkoutTemplateCard
          workoutTemplate={template}
          onCardClicked={() => {
            console.log("card clicked! display start workout modal");
            setDisplayInfoModal({ workout: template, visible: true });
          }}
          onTemplateDeleteRequest={handleDeleteTemplate}
          onTemplateModifyRequest={(template) => {
            navigation.navigate("WorkoutCreate4", {
              modifyRequest: { edit: true, template },
            });
          }}
        />
      </View>
    );
  };

  // Refreshes the workout templates
  const handleRefresh = () => {
    setRefreshing(true);
    workoutStore.getWorkoutTemplates();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStartWorkout = async (workout: WorkoutTemplate) => {
    // Check if another workout is already running
    setDisplayInfoModal({ workout: workout, visible: false });
    if (bottomSheetState.visible) {
      console.log("Another workout is already running!");
      return;
    }

    // Start workout session and get reference to the workout session with assigned id.
    var tempWorkoutSession = workoutTemplateToSession(workout);
    var workoutSessionDto = await startWorkoutSession(
      workoutSessionEntityToDTO(tempWorkoutSession)
    );
    var workoutSession = await workoutSessionDTOToEntity(workoutSessionDto);

    setBottomSheetState((prev) => ({
      ...prev,
      workout: workoutSession,
      visible: true,
    }));
    resetTimer();
    startTimer();
  };

  const handleStopWorkout = () => {
    console.log("Stopping workout");
    stopTimer();
    setBottomSheetState({
      workout: undefined,
      visible: false,
    });
  };

  const handleCancelWorkout = () => {
    var workoutToBeCancelled = bottomSheetState.workout;
    handleStopWorkout();

    Toast.show({
      type: "info",
      text1: `Cancelled '${workoutToBeCancelled?.name}'`,
      text2: "",
    });

    if (!workoutToBeCancelled) {
      handleStopWorkout();
      return;
    }

    cancelWorkoutSession(workoutToBeCancelled!.id);
  };

  const handleFinishWorkout = () => {
    var finishedWorkout = bottomSheetState.workout;
    handleStopWorkout();

    Toast.show({
      type: "success",
      text1: `Completed '${finishedWorkout?.name}'`,
      text2: "Good job!",
    });

    completeWorkoutSession(finishedWorkout!.id);
  };

  // Open modal to confirm deletion of workout template
  const handleDeleteTemplate = (templateId: string) => {
    setDisplayDeleteModal({ visible: true, templateId: templateId });
  };

  // Fetch workout templates and check for active workout sessions
  useEffect(() => {
    console.log("in here useEffect");
    // Fetch workout templates
    getWorkoutTemplates();
    // Check for active workout sessions
    initBottomSheet();

    handleRefresh();
  }, []);

  return (
    <View
      className="flex-1" //w-full flex-col justify-center items-center
      onLayout={handleContainerLayout}
    >
      <FlatList
        data={sr.filter === null ? workoutTemplates : filteredWorkoutSessions}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={renderHeaderSection()}
        ListFooterComponent={renderFooterSection()}
        renderItem={renderWorkoutTemplate}
        className="px-3" //w-[95%] flex-col gap-y-2
        contentContainerStyle={{
          paddingVertical: 10,
          flexGrow: 1,
        }}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ right: -5 }}
        ItemSeparatorComponent={() => <View className="h-2"></View>}
        refreshControl={
          <RefreshControl
            // TODO: implement, currently stub
            refreshing={refreshing}
            onRefresh={() => {
              handleRefresh();
            }}
          ></RefreshControl>
        }
        ListEmptyComponent={() => (
          <View className={` flex-1 h-full`}>
            <Text className={`${TEXT_BODY_L} text-center`}>
              Currently No Workout Templates {"\n"}
              <Text onPress={handleRefresh} className={`text-blue-400`}>
                Refresh
              </Text>
            </Text>
          </View>
        )}
        onContentSizeChange={handleContentSizeChange}
        scrollEnabled={true} // TODO-OPT if we want scroll enabled only when there is extra content use this instead: {shouldScroll}
      ></FlatList>

      <WorkoutTemplateInfoDisplay
        visible={displayInfoModal.visible}
        workout={displayInfoModal.workout}
        onClose={() => {
          setDisplayInfoModal({ workout: undefined, visible: false });
        }}
        onStartWorkout={handleStartWorkout}
      />

      <WorkoutFilterModal
        visible={sr.displayFilterModal}
        onClose={sr.closeFilterModal}
        onApply={(filter: WorkoutFilterDto) => {
          console.log("Applying filter: ", filter);
          sr.addFilter(filter);
        }}
      />

      <WorkoutBottomSheet
        isVisible={bottomSheetState.visible} //{}
        workout={bottomSheetState.workout}
        timer={time}
        onClose={() => {}}
        onCancelWorkout={handleCancelWorkout}
        onFinishWorkout={handleFinishWorkout}
      />

      <DeleteModal
        visible={displayDeleteModal.visible}
        onClose={() => {
          setDisplayDeleteModal({ visible: false, templateId: undefined });
        }}
        onDelete={() => {
          if (!displayDeleteModal.templateId) return;
          removeWorkoutTemplate(displayDeleteModal.templateId);
          setDisplayDeleteModal({ visible: false, templateId: undefined });

          Toast.show({
            type: "success",
            text1: "Workout Template Deleted",
            text2: "",
          });
        }}
        titleText="Delete Workout Template?"
      />
    </View>
  );
};

export default WorkoutMain;

export function workoutTemplateToSession(
  template: WorkoutTemplate
): WorkoutSession {
  return {
    id: "-1", //TODO: determine id of workout session
    name: template.name,
    templateId: template.id,
    exerciseGroups: template.exerciseGroups,
    userId: template.userId,
    duration: 0,
    startedAt: new Date(),
    isCompleted: false,
  };
}
