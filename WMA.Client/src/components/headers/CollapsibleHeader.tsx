import React from "react";
import { View, Animated } from "react-native";
import { styled } from "nativewind";

const AnimatedView = Animated.createAnimatedComponent(styled(View));

interface IUseCollapsibleHeaderProps {
  collapsedHeight: number;
  expandedHeight: number;
}

export const useCollapsibleHeader = ({
  collapsedHeight,
  expandedHeight,
}: IUseCollapsibleHeaderProps) => {
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, expandedHeight - collapsedHeight],
    outputRange: [expandedHeight, collapsedHeight],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, expandedHeight - collapsedHeight],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return {
    headerHeight,
    opacity,
    isCollapsed: scrollY.interpolate({
      inputRange: [0, expandedHeight - collapsedHeight],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    handleScroll: {
      scrollY,
      event: handleScroll,
    },
  };
};

interface ICollapsibleHeaderProps {
  defaultHeader: React.ReactNode;
  collapsedHeader: React.ReactNode;
  collapsedHeight: number;
  expandedHeight: number;
  scrollY: Animated.Value;
}

const CollapsibleHeader: React.FC<ICollapsibleHeaderProps> = ({
  defaultHeader,
  collapsedHeader,
  collapsedHeight,
  expandedHeight,
  scrollY,
}) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, expandedHeight - collapsedHeight],
    outputRange: [expandedHeight, collapsedHeight],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, expandedHeight - collapsedHeight],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const isCollapsed = scrollY.interpolate({
    inputRange: [0, expandedHeight - collapsedHeight],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <AnimatedView className="overflow-hidden" style={{ height: headerHeight }}>
      {/* DEFAULT HEADER */}
      <AnimatedView className="w-full" style={{ opacity }}>
        {defaultHeader}
      </AnimatedView>

      {/* COLLAPSED HEADER */}
      <AnimatedView
        className="w-full"
        style={{
          opacity: isCollapsed,
          transform: [
            {
              translateY: isCollapsed.interpolate({
                inputRange: [0, 1],
                outputRange: [-collapsedHeight, 0],
              }),
            },
          ],
        }}
      >
        {collapsedHeader}
      </AnimatedView>
    </AnimatedView>
  );
};

export default CollapsibleHeader;
