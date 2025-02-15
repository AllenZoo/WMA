import React, { useRef } from "react";
import { View, Dimensions } from "react-native";
import Plate from "./Plate";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface IDraggablePlateProps {
  radius?: number;
  colour?: string;
  onDragStart?: () => void;
  onDragEnd?: (position: { x: number; y: number }) => void;
}

const DraggablePlate = ({
  radius = 48,
  colour = "purple",
  onDragStart,
  onDragEnd,
}: IDraggablePlateProps) => {
  // Create animated values for position
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const context = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onStart(() => {
      "worklet";
      context.value = { x: translateX.value, y: translateY.value };
      scale.value = withSpring(1.1);
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    })
    .onUpdate((event) => {
      "worklet";
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd((event) => {
      "worklet";
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      if (onDragEnd) {
        runOnJS(onDragEnd)({
          x: event.absoluteX,
          y: event.absoluteY,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View
      style={{
        backgroundColor: "transparent",
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
      }}
    >
      <Plate radius={radius} colour={colour} />
    </View>
  );
};

export default DraggablePlate;
