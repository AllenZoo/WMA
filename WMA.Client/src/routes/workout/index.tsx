import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import WorkoutMain from "./WorkoutMain";
import WorkoutCreate1 from "./WorkoutCreate1";
import WorkoutTemplateInfo from "./WorkoutTemplateInfo";
import WorkoutCreate2 from "./WorkoutCreate2";
import WorkoutCreate3 from "./WorkoutCreate3";
import WorkoutCreate4 from "./WorkoutCreate4";
import { Portal } from "react-native-paper";

const WorkoutStack =
  createNativeStackNavigator<WorkoutStackNavigatorParamsList>();

// type WorkoutScreenNavigatorProps = {} & NativeStackScreenProps<
//   RootStackNavigatorParamsList,
//   "Workouts"
// >;

// TODO: temp fix
type WorkoutScreenNavigatorProps = any;

const WorkoutScreenNavigator = (props: WorkoutScreenNavigatorProps) => {
  return (
    <Portal.Host>
      <WorkoutStack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: "Workouts",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerStyle: { backgroundColor: "#f9f9f9" },
        }}
        initialRouteName="WorkoutMain"
      >
        <WorkoutStack.Screen
          name="WorkoutMain"
          component={WorkoutMain}
          options={{ headerTitle: "Workouts" }}
        />
        <WorkoutStack.Screen
          name="WorkoutCreate1"
          component={WorkoutCreate1}
          options={{ headerTitle: "Create Workout", headerLargeTitle: false }}
        />
        <WorkoutStack.Screen
          name="WorkoutCreate2"
          component={WorkoutCreate2}
          options={{ headerTitle: "Preview Exercises", headerLargeTitle: true }}
        />
        <WorkoutStack.Screen
          name="WorkoutCreate3"
          component={WorkoutCreate3}
          options={{ headerTitle: "Modify Template", headerLargeTitle: true }}
        />
        <WorkoutStack.Screen
          name="WorkoutCreate4"
          component={WorkoutCreate4}
          options={{ headerTitle: "Modify Template", headerLargeTitle: true }}
        />
      </WorkoutStack.Navigator>
    </Portal.Host>
  );
};

export default WorkoutScreenNavigator;
