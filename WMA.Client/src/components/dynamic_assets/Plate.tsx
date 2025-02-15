import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, Path } from "react-native-svg";

interface IPlateProps {
  radius?: number;
  holeRadius?: number;
  colour?: string;
}

const Plate = ({ radius = 48, holeRadius = 16, colour }: IPlateProps) => {
  // Create a path for the plate with hole using SVG path commands
  const createPlateWithHolePath = () => {
    // Start at top center of outer circle
    const startX = radius;
    const startY = 0;

    // Commands to draw the plate with hole
    const commands = [
      // Move to start position
      `M ${startX} ${startY}`,
      // Draw outer circle clockwise
      `A ${radius} ${radius} 0 1 1 ${startX} ${radius * 2}`,
      `A ${radius} ${radius} 0 1 1 ${startX} ${startY}`,
      // Move to start of inner circle
      `M ${radius + holeRadius} ${radius}`,
      // Draw inner circle counter-clockwise
      `A ${holeRadius} ${holeRadius} 0 1 0 ${radius - holeRadius} ${radius}`,
      `A ${holeRadius} ${holeRadius} 0 1 0 ${radius + holeRadius} ${radius}`,
      // Close the path
      "Z",
    ];

    return commands.join(" ");
  };

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.38,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <Defs />
        {/* Single path that creates the plate with transparent hole */}
        <Path
          d={createPlateWithHolePath()}
          fill={colour || "green"}
          fillRule="evenodd"
        />
      </Svg>
    </View>
  );
};

export default Plate;
