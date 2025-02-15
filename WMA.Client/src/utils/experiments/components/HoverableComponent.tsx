import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

const HoverableComponent: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <View style={[styles.box, isHovered && styles.hovered]}>
          <Text style={styles.text}>
            {isHovered ? "Hovered!" : "Hover over me"}
          </Text>
        </View>
      </Pressable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    borderRadius: 10,
  },
  hovered: {
    backgroundColor: "lightgreen",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default HoverableComponent;
