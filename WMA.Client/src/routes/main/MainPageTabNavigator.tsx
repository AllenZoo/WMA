import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../home";
import { View } from "react-native";
import Navbar from "@/components/tabs/Navbar";
import Exercises from "../exercises/Exercises";
import { CompositeScreenProps } from "@react-navigation/native";
import WorkoutScreenNavigator from "../workout";
import Home from "../home/Home";
import Profile from "../profile/Profile";
import History from "../history/History";
import ExercisePageStackNavigator from "../exercises";
import HistoryPageStackNavigator from "../history";
import ProfilePageStackNavigator from "../profile";
import HomePageStackNavigator from "../home";

const Tab = createBottomTabNavigator();

type MainPageProps = {} & NativeStackScreenProps<
  RootStackNavigatorParamsList,
  "MainPageTabNavigator"
>;

// Update the main props type to include composite navigation
// type MainPageProps = CompositeScreenProps<
//   BottomTabScreenProps<MainPageTabParamList>,
//   NativeStackScreenProps<RootStackNavigatorParamsList>
// >;

const MainPageTabNavigator = ({ navigation }: MainPageProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <Navbar
          activeTab={getTabNumber(props.state.index)}
          onTabPress={(tabIndex) => {
            // Convert tab number back to screen name
            const screenName = getScreenName(tabIndex);
            props.navigation.navigate(screenName);
          }}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomePageStackNavigator} />
      <Tab.Screen name="History" component={HistoryPageStackNavigator} />
      <Tab.Screen name="Workouts" component={WorkoutScreenNavigator} />
      <Tab.Screen name="Exercises" component={ExercisePageStackNavigator} />
      <Tab.Screen name="Profile" component={ProfilePageStackNavigator} />
    </Tab.Navigator>
  );
};

// Helper function to convert tab navigator index to custom navbar index
const getTabNumber = (index: number): number => {
  // Navbar uses 1-based index
  return index + 1;
};

// Helper function to convert custom navbar index to screen name
const getScreenName = (tabNumber: number): string => {
  const screenMap: { [key: number]: string } = {
    1: "Home",
    2: "History",
    3: "Workouts",
    4: "Exercises",
    5: "Profile",
  };
  return screenMap[tabNumber] || "Home";
};

export default MainPageTabNavigator;
