import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, View, Text } from "react-native";
import WorkoutSessionCard from "@/components/cards/WorkoutSessionCard";
import { FlatList } from "react-native-gesture-handler";
import {
  WorkoutFilterDto,
  WorkoutSession,
} from "@/stores/@types/workout.store";
import {
  useWorkoutStore,
  workoutSessionsDTOToEntity,
} from "@/stores/workout.store";
import DeleteModal from "@/components/modals/DeleteModal";
import useDeleteModal from "@/hooks/useDeleteModal";
import WorkoutSessionHistoryDisplay from "@/components/modals/WorkoutSessionHistoryDisplay";
import useModal from "@/hooks/useModal";
import { TEXT_BODY_L } from "@/utils/designStyles";
import { useRefresh } from "@/hooks/useRefresh";

type HistoryProps = any;

const History = ({ navigation }: HistoryProps) => {
  const { getWorkoutSessionsFiltered, removeWorkoutSession } =
    useWorkoutStore();

  const {
    isDeleteModalVisible,
    toDeleteItem,
    showDeleteModal,
    closeDeleteModal,
    applyDelete,
  } = useDeleteModal<WorkoutSession>();

  // Hook for history info display modal.
  const infoModal = useModal<WorkoutSession>();

  // TODO: fix userId fetching before prod
  const filter: WorkoutFilterDto = {
    userId: 1003, //-1 (should) signals that we get sessions for user associated with token.
    sessionStatus: "COMPLETED",
    mostRecentFirst: true,
  };

  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);

  const fetchWorkoutSessions = async () => {
    var sessions = await getWorkoutSessionsFiltered(filter);
    var workoutSessions = await workoutSessionsDTOToEntity(sessions);
    setWorkoutSessions(workoutSessions);
  };
  // Hook for refreshing the workout sessions
  const refresher = useRefresh(fetchWorkoutSessions, { delay: 0 });

  const handleDeleteSession = async (session: WorkoutSession) => {
    refresher.waitForPromise(removeWorkoutSession(session.id));
  };

  const renderWorkoutSession = useCallback(
    ({ item }: { item: WorkoutSession }) => {
      return (
        <WorkoutSessionCard
          session={item}
          onDisplayDeleteModal={showDeleteModal}
          onDisplayInfoModal={() => infoModal.openModal(item)}
        />
      );
    },
    []
  );

  useEffect(() => {
    fetchWorkoutSessions();
  }, []);

  return (
    <View className="w-full h-full flex-1">
      <FlatList
        data={workoutSessions}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={renderWorkoutSession}
        refreshControl={
          <RefreshControl
            refreshing={refresher.isLoading}
            onRefresh={refresher.refresh}
          />
        }
        className="w-full"
        contentContainerStyle={{
          paddingVertical: 10,
          flexGrow: 1,
          rowGap: 8,
        }}
        ListEmptyComponent={() => (
          <View className={` flex-1 h-full`}>
            <Text className={`${TEXT_BODY_L} text-center`}>
              Currently No Workout Sessions {"\n"}
              <Text onPress={refresher.refresh} className={`text-blue-400`}>
                Refresh
              </Text>
            </Text>
          </View>
        )}
      />

      <DeleteModal
        visible={isDeleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={() => {
          applyDelete(handleDeleteSession);
        }}
      />

      <WorkoutSessionHistoryDisplay
        visible={infoModal.visible}
        session={infoModal.data!}
        onClose={infoModal.closeModal}
      />
    </View>
  );
};

export default History;
