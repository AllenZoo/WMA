import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  SafeAreaView,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, useState } from "react";
import { WorkoutSession, WorkoutTemplate } from "@/stores/@types/workout.store";
import { Pressable } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import { TEXT_BODY_M, TEXT_HEADING_S } from "@/utils/designStyles";
import Button from "../buttons/Button";
import CustomBottomSheetBackdrop from "./CustomBottomSheetBackdrop";
import { formatTimeString, Time } from "@/hooks/useTimer";
import WorkoutModificationComponent from "../page/WorkoutModificationComponent";
import { WORKOUT_TEMPLATE_STUB } from "@/utils/stubs";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import CompletionModal from "../modals/CompletionModal";

type WorkoutBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onCancelWorkout: () => void;
  onFinishWorkout?: () => void; // TODO: think about what params this should take
  workout?: WorkoutSession;
  timer?: Time;
};

// TODO: think about whether this bottom sheet should represent a template or session (maybe convert it to a session)
const WorkoutBottomSheet: React.FC<WorkoutBottomSheetProps> = ({
  isVisible,
  onClose,
  onCancelWorkout,
  onFinishWorkout,
  workout,
  timer,
}) => {
  // Snap points for the bottom sheet (percentage of screen height)
  const snapPoints = useMemo(() => ["12%", "85%"], []);
  const backSheetRef = useRef<BottomSheet>(null);

  // Completion Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Animation Stuff
  const animatedPosition = useSharedValue(0);
  // NOTE: there is no fade in/out since the indexes we always call are 0 or 1. This means we never get half opacity like index 0.5.
  // TODO-OPT: replace this with simple fade in once fully expanded and fade out once collapsed
  const finishButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [0, 1],
            [20, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        pressBehavior={"collapse"}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 1) {
      animatedPosition.value = 1;
    } else {
      animatedPosition.value = 0;
    }
  }, []);

  useEffect(() => {
    // NOTE: doing isVisible? 0: -1 in the BottomSheet component bugs out since we won't be able to transition to any other index.
    if (isVisible) {
      backSheetRef.current?.snapToIndex(0);
    } else {
      backSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <Portal>
      <BottomSheet
        bottomInset={0}
        //containerHeight={1000}
        ref={backSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDynamicSizing={false} // NOTE: SUPER IMPORTANT THIS IS FALSE AS TRUE = CREATING INDEX = WEIRD STUFF HAPPENING
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        onChange={handleSheetChanges}
        footerComponent={() => <View className="my-8"></View>}
      >
        <BottomSheetScrollView style={styles.container} scrollEnabled={true}>
          {/* Header Row */}
          <Pressable onPress={() => backSheetRef.current?.snapToIndex(1)}>
            <View className="w-full justify-center items-center">
              <Text className={`${TEXT_HEADING_S} text-center`}>
                {workout?.name ?? "Error: No Workout Name"}
              </Text>
              <Text className={`${TEXT_BODY_M}`}>
                {formatTimeString(
                  timer ?? { hours: 0, minutes: 0, seconds: 0 }
                )}
              </Text>
            </View>
          </Pressable>

          {/* Details */}
          <View className="px-3 w-full flex-col gap-y-2">
            {workout && (
              <WorkoutModificationComponent
                initialWorkoutTemplate={workout}
                checkable={true}
              />
            )}

            <View className="w-full flex-row items-center justify-center">
              <Button
                additionalStyleContainer="w-[80%] h-[43px] flex text-center justify-center px-0 py-0"
                text="Cancel Workout"
                onPress={onCancelWorkout}
              ></Button>
            </View>
          </View>

          {/* Finish Button */}
          <Animated.View
            className="absolute right-0 top-0 w-[80px] h-[43px] flex text-center justify-center px-0"
            style={finishButtonStyle}
          >
            <Button
              onPress={(e) => {
                // Don't need to stop propagation since button will only appear when the bottom sheet is expanded
                // e.stopPropagation();
                setModalVisible(true);
              }}
              text="Finish"
              additionalStyleContainer="absolute right-2 top-0 w-[80px] h-[43px] flex text-center justify-center px-0 py-0"
              additionalStyleText=""
            ></Button>
          </Animated.View>
        </BottomSheetScrollView>
      </BottomSheet>

      <CompletionModal
        visible={modalVisible}
        headerText="Finish Workout?"
        bodyText="Are you sure you want to finish this workout?"
        completionBtnText="Finish"
        cancelBtnText="Cancel"
        onClose={() => setModalVisible(false)}
        onContinue={() => {
          setModalVisible(false);
          onFinishWorkout?.();
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "20%",
    // backgroundColor: "gray",
  },
  bottomSheetBackground: {
    backgroundColor: "white",
  },
  handleIndicator: {
    backgroundColor: "#DDDDDD",
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    padding: 16,
  },
  detailsContainer: {
    gap: 12,
    padding: 16,
  },
  exerciseGroup: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  debugControls: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  debugInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  debugButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  debugLog: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  debugLogEntry: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
});

export default WorkoutBottomSheet;
