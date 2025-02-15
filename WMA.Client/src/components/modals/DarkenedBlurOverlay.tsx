import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

interface DarkenedBlurOverlayProps {
  children: React.ReactNode;
}

const DarkenedBlurOverlay: React.FC<DarkenedBlurOverlayProps> = ({
  children,
}) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView intensity={10} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slight darkening
  },
});

export default DarkenedBlurOverlay;
