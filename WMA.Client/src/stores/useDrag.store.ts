import { create } from "zustand";

// Define interfaces for type safety
// TODO: try storing react node
interface DragItem {
  id: string;
  type: string;
  data: any; // Can be more specific based on your item structure
}

interface DragState {
  // Global state properties
  draggedItem: DragItem | null;

  // Methods to modify state with type safety
  setDraggedItem: (item: DragItem | null) => void;
  clearDraggedItem: () => void;
}

// Store to hold the dragged item state.
const useDragStore = create<DragState>((set, get) => ({
  // Initial state
  draggedItem: null,

  // Typed methods for state manipulation
  setDraggedItem: (item) => set({ draggedItem: item }),
  clearDraggedItem: () => set({ draggedItem: null }),
}));
export { useDragStore };
