import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const SlideIntoPressable: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  const onGestureEvent = React.useCallback(({ nativeEvent }: any) => {
    // Check if the touch is within the bounds of the box
    const { x, y } = nativeEvent;
    if (x >= 0 && x <= 200 && y >= 0 && y <= 200) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, []);

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      console.log("onTouchesDown");
      //setIsHovered(true);
    })
    .onTouchesUp(() => {
      //setIsHovered(false);
    });

  const onHandlerStateChange = React.useCallback(() => {
    setIsHovered(false); // Reset state when gesture ends
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    // Add hover effect
    backgroundColor: isHovered ? "lightgreen" : "lightblue",
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onEnded={onHandlerStateChange}
      >
        <View style={styles.wrapper}>
          <View style={[styles.box, isHovered && styles.hovered]}>
            <Text style={styles.text}>
              {isHovered ? "Inside!" : "Slide into me"}
            </Text>
          </View>
        </View>
      </PanGestureHandler> */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: 300, // Larger wrapper to capture touches outside the box
    height: 300,
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

export default SlideIntoPressable;
