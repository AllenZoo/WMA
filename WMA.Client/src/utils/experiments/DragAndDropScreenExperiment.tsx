import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  PanResponder,
  Animated,
  LayoutRectangle,
} from "react-native";

interface DraggableItem {
  id: string;
  title: string;
  color: string;
}

interface DraggableItemProps {
  item: DraggableItem;
  onDragStart: () => void;
  onDragEnd: (dropZoneLayout: LayoutRectangle) => void;
  dropZoneLayout: LayoutRectangle;
}

const ITEMS: DraggableItem[] = [
  { id: "1", title: "Item 1", color: "#FF5733" },
  { id: "2", title: "Item 2", color: "#33FF57" },
  { id: "3", title: "Item 3", color: "#3357FF" },
  { id: "4", title: "Item 4", color: "#F033FF" },
  { id: "5", title: "Item 5", color: "#FF9933" },
];

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  onDragStart,
  onDragEnd,
  dropZoneLayout,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onDragStart();
      // Store the current offset before starting a new gesture
      pan.extractOffset();
      Animated.spring(scale, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      onDragEnd(dropZoneLayout);

      // Reset position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start(() => {
        pan.flattenOffset();
      });
    },
  });

  const itemStyle = {
    transform: [...pan.getTranslateTransform(), { scale }],
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.draggableItem, itemStyle, { backgroundColor: item.color }]}
    >
      <Animated.Text style={styles.itemText}>{item.title}</Animated.Text>
    </Animated.View>
  );
};

const DragAndDropScreen: React.FC = () => {
  const [dropZoneLayout, setDropZoneLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (dropZoneLayout: LayoutRectangle) => {
    setIsDragging(false);
    // Handle drop logic here
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.dropZone}
        onLayout={(event) => setDropZoneLayout(event.nativeEvent.layout)}
      >
        {/* Drop zone content */}
      </View>

      <ScrollView style={styles.scrollContainer} scrollEnabled={!isDragging}>
        {ITEMS.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dropZoneLayout={dropZoneLayout}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dropZone: {
    height: 200,
    backgroundColor: "#EFEFEF",
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  draggableItem: {
    height: 60,
    margin: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DragAndDropScreen;
