import { useEffect, useRef } from "react";
import { useDragDrop } from "./DragDropProvider";
import { LayoutChangeEvent, View } from "react-native";

interface IDropZoneProps {
  id: string;
  children?: React.ReactNode;
  containerOnly?: boolean; // option to toggle whether DropZone has outline styling.
  additionalStyling?: string;
  visible?: boolean;
}

const DropZone = ({
  id,
  children,
  containerOnly = true,
  additionalStyling,
  visible = true,
}: IDropZoneProps) => {
  const { registerDropZone, unregisterDropZone, draggedItem, dropZones } =
    useDragDrop();

  const viewRef = useRef<View | null>(null);

  useEffect(() => {
    // Only register if the zone is visible
    if (visible) {
      // We need to wait for the next layout event to get proper measurements
      const timeoutId = setTimeout(() => {
        if (viewRef.current) {
          viewRef.current.measure((x, y, width, height, pageX, pageY) => {
            registerDropZone(
              id,
              { x: pageX, y: pageY, width, height },
              viewRef
            );
          });
        }
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        unregisterDropZone(id);
      };
    }
  }, [id, visible, registerDropZone, unregisterDropZone]);

  const onLayout = (event: LayoutChangeEvent) => {
    registerDropZone(id, event.nativeEvent.layout, viewRef);
  };

  return visible ? (
    // ${draggedItem ? "bg-blue-50 border-blue-400" : "bg-gray-50"}
    <View
      ref={viewRef}
      onLayout={onLayout}
      className={`${!containerOnly ? "border-2 border-dashed border-gray-300" : ""}
          min-h-[50px]
          w-full
          rounded-lg
          
          transition-colors
          duration-200
          ${additionalStyling}
        `}
    >
      {children}
    </View>
  ) : null;
};

export default DropZone;
