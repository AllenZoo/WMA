import { Exercise } from "@/stores/@types/exercise.store";
import { TEXT_BODY_L, TEXT_BODY_M, TEXT_HEADING_S } from "@/utils/designStyles";
import { Chip } from "@rneui/base";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import PlateIcon from "../../../../assets/svgs/plate-icon.svg";

interface ExerciseInfoPageProps {
  exercise?: Exercise;
}

const ExerciseInfoPage: React.FC<ExerciseInfoPageProps> = ({ exercise }) => {
  return (
    <View className="w-full h-full">
      {exercise && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable className="p-4 rounded-lg w-full shadow-lg flex-col">
            {/* Plate/Ring Icon */}
            <View className="flex-row w-full justify-center mb-3">
              <View className="w-16 h-16">
                {/* Adjust the size as needed */}
                <PlateIcon width="100%" height="100%" fill="black" />
              </View>
            </View>

            {/* Muscle Categories */}
            <View className="flex-col align-center items-center mb-5">
              <Text className={`${TEXT_BODY_L}`}>Muscle Categories: </Text>
              <View className="flex-row flex-wrap mt-1 gap-x-1">
                {exercise.muscleGroups?.map((muscle, index) => (
                  <View key={index}>
                    {/* TODO: colour of chip should be theme.accent colour */}
                    <Chip
                      color={"#ffffff"}
                      key={index}
                      buttonStyle={{
                        paddingVertical: 2,
                      }}
                    >
                      <Text className={TEXT_BODY_M}>{muscle}</Text>
                    </Chip>
                  </View>
                ))}
              </View>
            </View>

            {/* Exercise Attributes */}
            <View className="flex-col gap-y-2">
              {/* Average Rep Time */}
              <View className="flex-row align-center items-center">
                <Text className={`${TEXT_BODY_L}`}>Average Rep Time: </Text>
                <View>
                  <Chip
                    color={"#ffffff"}
                    buttonStyle={{
                      paddingVertical: 2,
                    }}
                  >
                    <Text className={TEXT_BODY_M}>{"PLACEHOLDER"}</Text>
                  </Chip>
                </View>
              </View>

              {/* Difficulty Tier */}
              <View className="flex-row align-center items-center">
                <Text className={`${TEXT_BODY_L}`}>Difficulty: </Text>
                <View>
                  <Chip
                    color={"#ffffff"}
                    buttonStyle={{
                      paddingVertical: 2,
                    }}
                  >
                    <Text className={TEXT_BODY_M}>
                      {exercise.difficulty || "N/A"}
                    </Text>
                  </Chip>
                </View>
              </View>

              {/* Recovery Demand */}
              <View className="flex-row align-center items-center">
                <Text className={`${TEXT_BODY_L}`}>Recovery Demand: </Text>
                <View>
                  <Chip
                    color={"#ffffff"}
                    buttonStyle={{
                      paddingVertical: 2,
                    }}
                  >
                    <Text className={TEXT_BODY_M}>
                      {exercise.recoveryDemand || "N/A"}
                    </Text>
                  </Chip>
                </View>
              </View>

              {/* Equipment Required */}
              <View className="flex-row align-center items-center">
                <Text className={`${TEXT_BODY_L}`}>
                  {"Equipment Required:  "}
                </Text>
                <View className="flex-row flex-wrap gap-x-1">
                  {exercise.equipmentTypes &&
                  exercise.equipmentTypes.length > 0 ? (
                    exercise.equipmentTypes.map((equipment, index) => (
                      <View key={index}>
                        <Chip
                          color={"#ffffff"}
                          key={index}
                          buttonStyle={{
                            paddingVertical: 2,
                          }}
                        >
                          <Text className={TEXT_BODY_M}>{equipment}</Text>
                        </Chip>
                      </View>
                    ))
                  ) : (
                    <Chip
                      color={"#ffffff"}
                      buttonStyle={{
                        paddingVertical: 2,
                      }}
                    >
                      <Text className={TEXT_BODY_M}>{"N/A"}</Text>
                    </Chip>
                  )}
                </View>
              </View>
            </View>

            {/* Video Display (Not availble Currently) */}
            <View className="bg-white w-[100%] rounded-2xl h-52 flex-col align-center items-center justify-center mb-4 mt-5">
              <Text className={`${TEXT_HEADING_S}`}>Video Demonstration</Text>
              <Text className={`${TEXT_BODY_L}`}>
                Video demonstration is currently not available for this
                exercise!
              </Text>
            </View>

            {/* Tips (TODO: for future*/}
            <View>
              <Text className={`${TEXT_HEADING_S}`}>Exercise Tips</Text>
              <Text className={`${TEXT_BODY_L}`}>
                Tips for this exercise will be available soon!
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      )}

      {!exercise && (
        <View>
          <Text>No exercise selected Error!</Text>
        </View>
      )}
    </View>
  );
};

export default ExerciseInfoPage;
