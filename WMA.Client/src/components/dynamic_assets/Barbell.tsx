import { WorkoutSession, WorkoutTemplate } from "@/stores/@types/workout.store";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";

interface IBarbellProps {
  weight?: number;
  colour?: string;
  position?: { x: number; y: number };
  plates?: PlateInfo[];
  workout?: WorkoutTemplate | WorkoutSession; // If not undefined, overwrites plates
}

export type PlateInfo = {
  colour?: string;
};

const Barbell: React.FC<IBarbellProps> = ({
  weight,
  colour = "black",
  position = { x: 0, y: 0 },
  plates: initialPlates = [],
  workout,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const HORIZONTAL_PADDING = 20; // 20px padding on each side
  const BARBELL_WIDTH = screenWidth - HORIZONTAL_PADDING * 2;
  const BARBELL_COLOUR = "#262626"; //"#D9D9D9";
  const BARBELL_STROKE = "#EBEFF4";
  const BARBELL_GUARD_WIDTH = 10;
  const BARBELL_GUARD_DIST_FROM_CENTER = 90;

  const PLATE_WIDTH = 8;
  const PLATE_STROKE = BARBELL_STROKE;

  const [plates, setPlates] = useState<PlateInfo[]>(initialPlates);

  const renderBarbell = () => {
    const ShadowedRect: React.FC<{
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      stroke: string;
      rx?: number;
      ry?: number;
    }> = ({ x, y, width, height, fill, stroke, rx, ry }) => (
      <>
        {/* Blurred Shadow Outer Layer*/}
        <Rect
          x={x + 1}
          y={y + 1}
          width={width + 2} // slightly wider
          height={height + 2} // slightly taller
          fill="#000"
          opacity={0.08} // first layer of shadow
          rx={rx ? rx + 1 : undefined}
          ry={ry ? ry + 1 : undefined}
        />

        {/* Shadow Inner Layer*/}
        <Rect
          x={x + 2}
          y={y + 2}
          width={width}
          height={height}
          fill="#000"
          opacity={0.12}
          rx={rx}
          ry={ry}
        />
        {/* Main Rectangle */}
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke={stroke}
          rx={rx}
          ry={ry}
        />
      </>
    );

    return (
      <View style={styles.svgContainer}>
        <Svg
          width={screenWidth}
          height={100}
          viewBox={`0 0 ${screenWidth} 100`}
        >
          {/* Main Bar */}
          <ShadowedRect
            x={HORIZONTAL_PADDING}
            y={40}
            width={BARBELL_WIDTH}
            height={20}
            fill={BARBELL_COLOUR}
            stroke={BARBELL_STROKE}
            rx={5}
          />

          {/* Left Guard */}
          <ShadowedRect
            x={
              BARBELL_WIDTH / 2 -
              BARBELL_GUARD_DIST_FROM_CENTER +
              (BARBELL_GUARD_WIDTH + 5)
            }
            y={30}
            width={BARBELL_GUARD_WIDTH}
            height={40}
            fill={BARBELL_COLOUR}
            stroke={BARBELL_STROKE}
            ry={5}
          />

          {/* Right Guard */}
          <ShadowedRect
            x={
              BARBELL_WIDTH / 2 +
              BARBELL_GUARD_DIST_FROM_CENTER +
              (BARBELL_GUARD_WIDTH + 5)
            }
            y={30}
            width={BARBELL_GUARD_WIDTH}
            height={40}
            fill={BARBELL_COLOUR}
            stroke={BARBELL_STROKE}
            ry={5}
          />

          {/* Plates */}

          {plates.map((plate, index) => {
            return (
              // TODO: figure out the proper geometry values, etc. Right now just eyeballing it without knowing the formula.
              <React.Fragment key={index}>
                {/* Left Plate */}
                {index % 2 === 0 && (
                  <ShadowedRect
                    key={index + "left"}
                    x={
                      BARBELL_WIDTH / 2 -
                      BARBELL_GUARD_DIST_FROM_CENTER +
                      (BARBELL_GUARD_WIDTH + 5) -
                      PLATE_WIDTH * (index / 2 + 1)
                    }
                    y={20}
                    width={PLATE_WIDTH}
                    height={60}
                    fill={plate.colour ?? "gray"}
                    stroke={PLATE_STROKE}
                    ry={3}
                  />
                )}

                {/* Right Plate */}
                {index % 2 !== 0 && (
                  <ShadowedRect
                    key={index + "right"}
                    x={
                      BARBELL_WIDTH / 2 +
                      BARBELL_GUARD_DIST_FROM_CENTER +
                      PLATE_WIDTH * (index / 2 + 1) +
                      (BARBELL_GUARD_WIDTH + 5) -
                      2
                    }
                    y={20}
                    width={PLATE_WIDTH}
                    height={60}
                    fill={plate.colour ?? "gray"}
                    stroke={PLATE_STROKE}
                    ry={3}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    );
  };

  useEffect(() => {
    if (workout) {
      const plates: PlateInfo[] = workout.exerciseGroups.map((ei) => ({
        colour: ei.exercise?.plateColour ?? "gray",
      }));
      setPlates(plates);
    }
  }, [workout]);

  return <View style={styles.container}>{renderBarbell()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  svgContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Barbell;
