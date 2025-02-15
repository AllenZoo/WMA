import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

interface UseScrollControlProps {
  navbarPadding?: number;
}

interface UseScrollControlReturn {
  contentHeight: number;
  containerHeight: number;
  shouldScroll: boolean;
  handleContainerLayout: (event: LayoutChangeEvent) => void;
  handleContentSizeChange: (width: number, height: number) => void;
}

// Helps determine if a list should be scrollable based on its content and container height.
export function useScrollControl({
  navbarPadding = 0,
}: UseScrollControlProps = {}): UseScrollControlReturn {
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height - navbarPadding;
      setContainerHeight(height);
    },
    [navbarPadding]
  );

  const handleContentSizeChange = useCallback((_: number, height: number) => {
    console.log("content size being changed! (for debugging WC4)");
    setContentHeight(height);
  }, []);

  const shouldScroll = contentHeight > containerHeight;

  return {
    contentHeight,
    containerHeight,
    shouldScroll,
    handleContainerLayout,
    handleContentSizeChange,
  };
}

export default useScrollControl;
