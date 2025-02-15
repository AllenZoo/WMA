import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";

import { useAuthStore } from "@/stores/auth.store";
import Navbar from "@/components/tabs/Navbar";
import BaseScreenNavLayout from "@/components/layouts/BaseNavbar";
import styles from "./styles";
import Exercise from "../exercises/Exercises";
import WorkoutMain from "../workout/WorkoutMain";
import WorkoutScreenNavigator from "../workout";

type MainPageProps = {} & NativeStackScreenProps<
  RootStackNavigatorParamsList,
  "Main"
>;

// TODO: see if this class is still used. If not, remove it.
const MainPage = ({ navigation }: MainPageProps) => {
  const { signOut } = useAuthStore();

  const [activeTab, setActiveTab] = React.useState(0);

  const handleSignOut = async () => {
    signOut();
  };

  const renderTab = () => {
    switch (activeTab) {
      case 1:
        return (
          <View>
            <Text>Home</Text>
          </View>
        );
      case 2:
        return (
          <View>
            <Text>History</Text>
          </View>
        );
      case 3:
        return (
          // <WorkoutMain
          //   navigation={navigation as any}
          //   route={{ key: "Workouts", name: "Workouts", params: {} } as any}
          // />
          <WorkoutScreenNavigator
            navigation={navigation as any}
            route={{ key: "Workouts", name: "Workouts", params: {} } as any}
          />
        );
      case 4:
        return (
          <Exercise
            navigation={navigation as any}
            route={{ key: "Exercises", name: "Exercises", params: {} } as any}
          />
        );
      case 5:
        return (
          <View>
            <Text>Profile</Text>
          </View>
        );
      default:
        return (
          <View>
            <Text>ERROR</Text>
          </View>
        );
    }
  };

  // TODO: add some navigation logic (navbar, etc.)
  return (
    <BaseScreenNavLayout styles="pt-0">
      <View style={styles.container}>
        {/* <Button text="Sign Out (Home)" onPress={handleSignOut} /> */}
        {renderTab()}
      </View>

      <Navbar activeTab={activeTab} onTabPress={setActiveTab}></Navbar>
    </BaseScreenNavLayout>
  );
};

export default MainPage;
