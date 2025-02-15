import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";

const ProfileStack =
  createNativeStackNavigator<ProfileStackNavigatorParamsList>();

type ProfileScreenNavigatorProps = any;
const ProfilePageStackNavigator = (props: ProfileScreenNavigatorProps) => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "Profile",
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: true,
        headerStyle: { backgroundColor: "#f9f9f9" },
      }}
      initialRouteName="ProfileMain"
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={Profile}
        options={{ headerTitle: "Profile" }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfilePageStackNavigator;
