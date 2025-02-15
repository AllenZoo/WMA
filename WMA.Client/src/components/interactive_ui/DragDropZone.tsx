import { View, Text } from "react-native";
import { SvgProps } from "react-native-svg";
import React, { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";
import { useDragDrop } from "./drag_drop_system/DragDropProvider";

interface IDragDropZoneProps {
  dragDropText?: string;
  containerStyle?: string;
  svgIcon?: React.FC<SvgProps>;
  iconFill?: string;
  centerNode?: React.ReactNode;
  dropZoneId: string; // refers to the string id given to parent DropZone component.
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop?: (gestureState: { x: number; y: number }) => void;
}

const DragDropZone: React.FC<IDragDropZoneProps> = ({
  dragDropText = "Drag and drop here",
  centerNode: CenterNode,
  containerStyle,
  svgIcon: Icon,
  iconFill,
  dropZoneId,
  onDragEnter,
  onDragLeave,
  onDrop,
}) => {
  const { hoveredZones } = useDragDrop();
  const [hovering, setHovering] = React.useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    let mounted = true;

    if (hoveredZones.has(dropZoneId)) {
      if (mounted) {
        setHovering(true);
        onDragEnter && onDragEnter();
      }
    } else {
      if (mounted) {
        setHovering(false);
        onDragLeave && onDragLeave();
      }
    }

    return () => {
      mounted = false;
    };
  }, [hoveredZones, dropZoneId]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      hovering ? 1 : 0,
      [0, 1],
      ["#ffffff", "#f3f4f6"]
    );

    scale.value = withSpring(hovering ? 1.05 : 1);

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const outlineDottedStyling =
    "border-2 border-dashed border-gray-500 rounded-lg";

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`${containerStyle} ${outlineDottedStyling} w-[92%] `}
    >
      <View className="flex-col justify-center align-center items-center py-4 pb-6">
        <Text className="relative top-6">{dragDropText}</Text>
        <View className="">{CenterNode}</View>
        <View className="relative bottom-8">
          {Icon && <Icon width={25} height={25} fill={iconFill || "none"} />}
        </View>
      </View>
    </Animated.View>
  );
};

export default DragDropZone;
