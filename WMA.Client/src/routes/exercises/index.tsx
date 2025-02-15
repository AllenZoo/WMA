import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Exercises from "./Exercises";

const ExerciseStack =
  createNativeStackNavigator<ExerciseStackNavigatorParamsList>();

type ExerciseScreenNavigatorProps = any;
const ExercisePageStackNavigator = (props: ExerciseScreenNavigatorProps) => {
  return (
    <ExerciseStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "Exercises",
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: true,
        headerStyle: { backgroundColor: "#f9f9f9" },
      }}
      initialRouteName="ExerciseMain"
    >
      <ExerciseStack.Screen
        name="ExerciseMain"
        component={Exercises}
        options={{ headerTitle: "Exercises" }}
      />
    </ExerciseStack.Navigator>
  );
};

export default ExercisePageStackNavigator;
