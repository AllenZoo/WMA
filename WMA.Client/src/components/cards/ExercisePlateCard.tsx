import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Plate from "@/components/dynamic_assets/Plate";
import Draggable from "@/components/interactive_ui/drag_drop_system/Draggable";
import { Exercise } from "@/stores/@types/exercise.store";

interface IExercisePlateCardProps {
  exercise: Exercise;
  onDragStart: () => void;
  onDragEnd: () => void;
  scrollRefs: any[];
}

const ExercisePlateCard = ({
  exercise,
  onDragStart,
  onDragEnd,
  scrollRefs,
}: IExercisePlateCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart();
    Animated.spring(scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View key={exercise.exerciseId} style={styles.container}>
      <Draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        item={{
          id: exercise.exerciseId!.toString(),
          sourceId: "n/a",
          label: exercise.name ?? "Exercise With No Name",
          data: exercise,
        }}
        scrollRefs={scrollRefs}
        additionalStyling={`
          bg-white p-4 rounded-lg shadow-md 
          transition-all
          ${isDragging ? "elevation-5" : "elevation-2"}
        `}
        style={[
          styles.draggable,
          {
            transform: [{ scale }],
            zIndex: isDragging ? 999 : 1,
          },
        ]}
      >
        <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
          <View className="flex-col items-center">
            <Plate colour={exercise.plateColour} />
            <Text>{exercise.name ?? "Exercise With No Name"}</Text>
          </View>
        </Animated.View>
      </Draggable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    transform: [{ scale: 0.9 }],
  },
  draggable: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ExercisePlateCard;
