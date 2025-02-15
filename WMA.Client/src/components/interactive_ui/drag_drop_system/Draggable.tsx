import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DragDropProvider";
import {
  Animated,
  LayoutRectangle,
  PanResponder,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { DraggableItem } from ".";
import { Text } from "react-native";
import { Portal } from "react-native-paper";

interface DraggableProps {
  item: DraggableItem;
  additionalStyling?: string;
  style?: StyleProp<ViewStyle>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children?: React.ReactNode;
  scrollRefs?: React.RefObject<ScrollView>[];
}

const Draggable = ({
  item,
  additionalStyling,
  style,
  onDragStart,
  onDragEnd,
  children,
  scrollRefs,
}: DraggableProps) => {
  const {
    setDraggedItem,
    draggedItem,
    dropZones,
    onDrop,
    registerHoveredZone,
    unregisterHoveredZone,
    clearHoveredZones,
  } = useDragDrop();

  const [isDragging, setIsDragging] = useState(false);
  const viewRef = useRef<View | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10;
      },

      onPanResponderGrant: () => {
        setIsDragging(true);
        setDraggedItem(item);
        pan.setValue({ x: 0, y: 0 });
        onDragStart?.();

        scrollRefs?.forEach((scrollRef) => {
          scrollRef.current?.setNativeProps({ scrollEnabled: false });
        });
      },
      onPanResponderMove: async (event, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);

        for (const [zoneId, zone] of dropZones.entries()) {
          if (zone.layout && (await isOverlapping(viewRef, zone.viewRef))) {
            registerHoveredZone(zoneId);
          } else {
            unregisterHoveredZone(zoneId);
          }
        }
      },
      onPanResponderRelease: async (evt, gestureState) => {
        try {
          for (const [zoneId, zone] of dropZones.entries()) {
            if (zone.layout && (await isOverlapping(viewRef, zone.viewRef))) {
              await onDrop(item.sourceId, zoneId, item);
              break;
            }
          }
        } finally {
          setIsDragging(false);
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();

          setTimeout(() => {
            clearHoveredZones();
            setDraggedItem(null);
            onDragEnd?.();
          }, 0);

          scrollRefs?.forEach((scrollRef) => {
            scrollRef.current?.setNativeProps({ scrollEnabled: true });
          });
        }
      },
      onPanResponderEnd(e, gestureState) {
        clearHoveredZones();
      },
    })
  ).current;

  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }],
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <View>
      {/* {isDragging && (
        <Portal>
          <Animated.View
            ref={viewRef}
            {...panResponder.panHandlers}
            className={`${additionalStyling} flex-col w-[120px]`}
            style={[animatedStyle, style]}
          >
            {children}
          </Animated.View>
        </Portal>
      )} */}
      <Animated.View
        ref={viewRef}
        {...panResponder.panHandlers}
        className={additionalStyling}
        style={[animatedStyle, style]}
      >
        {children}
        {/* {!isDragging && <>{children}</>} */}
      </Animated.View>
    </View>
  );
};

export default Draggable;

// Helper to check if Draggable and DropZone views are overlapping
export const isOverlapping = async (
  view1: React.MutableRefObject<View | null>,
  view2: React.MutableRefObject<View | null>
): Promise<boolean> => {
  if (!view1.current || !view2.current) {
    return false;
  }

  // Convert measure callback to Promise
  const getMeasurements = (view: View) => {
    return new Promise<{ x: number; y: number; width: number; height: number }>(
      (resolve) => {
        view.measure((x, y, width, height, pageX, pageY) => {
          resolve({
            x: pageX,
            y: pageY,
            width,
            height,
          });
        });
      }
    );
  };

  try {
    const [view1Layout, view2Layout] = await Promise.all([
      getMeasurements(view1.current),
      getMeasurements(view2.current),
    ]);

    return !(
      view1Layout.x + view1Layout.width < view2Layout.x ||
      view1Layout.x > view2Layout.x + view2Layout.width ||
      view1Layout.y + view1Layout.height < view2Layout.y ||
      view1Layout.y > view2Layout.y + view2Layout.height
    );
  } catch (error) {
    console.error("Error measuring views:", error);
    return false;
  }
};
