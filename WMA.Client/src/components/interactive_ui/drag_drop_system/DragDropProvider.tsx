import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { LayoutRectangle, View } from "react-native";
import {
  DragDropContextType,
  DragDropProviderProps,
  DraggableItem,
  DropZone,
} from ".";

export const DragDropContext = createContext<DragDropContextType>({
  draggedItem: null,
  dropZones: new Map(),
  hoveredZones: new Set(),
  setDraggedItem: () => {},
  registerDropZone: () => {},
  unregisterDropZone: () => {},
  registerHoveredZone: () => {},
  unregisterHoveredZone: () => {},
  clearHoveredZones: () => {},
  onDrop: () => {},
});

const DragDropProvider = ({ children, onItemMoved }: DragDropProviderProps) => {
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [dropZones, setDropZones] = useState<Map<string, DropZone>>(new Map());
  const [hoveredZones, setHoveredZones] = useState<Set<string>>(new Set());

  const registerDropZone = useCallback(
    (
      id: string,
      layout: LayoutRectangle,
      viewRef: React.MutableRefObject<View | null>,
      onHover?: () => void,
      onExitHover?: () => void
    ) => {
      //console.log("Registering drop zone: ", id);
      setDropZones((prev) => new Map(prev.set(id, { id, layout, viewRef })));
    },
    [setDropZones]
  );

  const unregisterDropZone = useCallback((id: string) => {
    setDropZones((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const registerHoveredZone = useCallback((id: string) => {
    setHoveredZones((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const unregisterHoveredZone = useCallback((id: string) => {
    setHoveredZones((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const clearHoveredZones = useCallback(() => {
    setHoveredZones(new Set());
  }, []);

  const onDrop = useCallback(
    (sourceId: string, targetId: string, item: DraggableItem) => {
      // console.log(`Item ${itemId} moved from ${sourceId} to ${targetId}`);
      onItemMoved?.(sourceId, targetId, item);
    },
    []
  );

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        dropZones,
        hoveredZones,
        setDraggedItem,
        registerDropZone,
        unregisterDropZone,
        registerHoveredZone,
        unregisterHoveredZone,
        clearHoveredZones,
        onDrop,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};
export default DragDropProvider;

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};
