import { View, Text, Pressable, PressableProps } from "react-native";
import { SvgProps } from "react-native-svg";
import { Chip } from "@rneui/themed";
import { Exercise } from "@/stores/@types/exercise.store";
import { shadowStyle } from "@/utils/designStyles";

interface IExerciseRowCardProps {
  // name: string;
  // muscleGroup: string[];
  icon?: React.FC<SvgProps>;
  exercise: Exercise;
  plateColour?: string; // TODO: need to add this attribute to backend
  onPress?: (exercise: Exercise) => void;
}

const ExerciseRowCard: React.FC<IExerciseRowCardProps> = ({
  icon: Icon,
  plateColour,
  exercise,
  onPress,
}) => {
  const handlePress = () => {
    onPress?.(exercise);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      {/* Main Exercise Row Card Container */}
      <View
        className="w-full h-20 bg-light-primary rounded-lg flex-row items-center p-4"
        style={shadowStyle}
      >
        {Icon && (
          <View className="mr-5">
            <Icon width={50} height={50} />
          </View>
        )}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold text-light-foreground dark:text-dark-foreground overflow-hidden whitespace-nowrap overflow-ellipsis inline-block">
            {exercise.name}
          </Text>
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
                  <Text>{muscle}</Text>
                </Chip>
              </View>
            ))}
          </View>
        </View>
        {/* {plateColour && (
        <View
          className="w-4 h-4 rounded-full ml-2"
          style={{ backgroundColor: plateColour }}
        />
      )} */}
      </View>
    </Pressable>
  );
};
export default ExerciseRowCard;
