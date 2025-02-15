import { useDragStore } from "@/stores/useDrag.store";
import React from "react";
import { ReactNode } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface IGlobalDraggableItemProps {
  item: ReactNode;
  active: boolean;
}

const GlobalDraggableItem = ({ item, active }: IGlobalDraggableItemProps) => {
  const { draggedItem } = useDragStore();

  // Use shared values for position
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onTouchesDown((event) => {
      // Update position to where the touch occurred
      const touch = event.allTouches[0];
      translateX.value = touch.x;
      translateY.value = touch.y;
    })
    .onTouchesMove((event) => {
      // Update position as finger moves
      const touch = event.allTouches[0];
      translateX.value = touch.x;
      translateY.value = touch.y;
    })
    .onFinalize(() => {
      // Optional: Add any cleanup or final position adjustments here
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (!active) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Reanimated.View style={[styles.draggableContainer, animatedStyle]}>
        {item}
      </Reanimated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    position: "absolute",
    // Optional: Add offset to center item under finger
    // marginLeft: -25, // Half of item width
    // marginTop: -25,  // Half of item height
  },
});

export default GlobalDraggableItem;
