import { ScrollView, StyleSheet, Text, View } from "react-native";
import HoverableComponent from "./components/HoverableComponent";
import SlideIntoPressable from "./components/SlideIntoPressable";
// import BottomSheet from "reanimated-bottom-sheet";
import { useRef } from "react";
import BottomSheetPageTest from "./components/BottomSheetTest";
import WorkoutBottomSheet from "@/components/bottomsheet/WorkoutBottomSheet";
import React from "react";
import GlobalDraggableItem from "@/components/interactive_ui/drag_drop_system/GlobalDraggableItem";
import Plate from "@/components/dynamic_assets/Plate";
import FingerTracker from "./components/FingerTracker";

const ExperimentalPage: React.FC = () => {
  return (
    <>
      {/* <GlobalDraggableItem item={<Plate />} active={true} /> */}
      <FingerTracker />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
export default ExperimentalPage;
