// src/types/index.ts
import { Exercise } from "@/stores/@types/exercise.store";
import { LayoutRectangle, ViewStyle } from "react-native";

export interface DraggableItem {
  id: string;
  label: string;
  sourceId: string;
  data: Exercise | null;
}

export interface DropZone {
  id: string;
  layout: LayoutRectangle | null;
  viewRef: React.MutableRefObject<View | null>;
  onHover?: () => void;
  onExitHover?: () => void;
}

export interface DragDropContextType {
  draggedItem: DraggableItem | null;
  dropZones: Map<string, DropZone>;
  hoveredZones: Set<string>;
  setDraggedItem: (item: DraggableItem | null) => void;
  registerDropZone: (
    id: string,
    layout: LayoutRectangle,
    viewRef: React.MutableRefObject<View | null>,
    onHover?: () => void,
    onExitHover?: () => void
  ) => void;
  unregisterDropZone: (id: string) => void;
  registerHoveredZone: (id: string) => void;
  unregisterHoveredZone: (id: string) => void;
  clearHoveredZones: () => void;
  onDrop: (sourceId: string, targetId: string, item: DraggableItem) => void;
}

export interface DragDropProviderProps {
  children: React.ReactNode;
  onItemMoved?: (
    sourceId: string,
    targetId: string,
    item: DraggableItem
  ) => void;
}

export interface DraggableProps {
  item: DraggableItem;
  style?: ViewStyle;
}

export interface DropZoneProps {
  id: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}
