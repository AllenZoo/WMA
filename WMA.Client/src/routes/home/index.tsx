import { createNativeStackNavigator } from "@react-navigation/native-stack";
import History from "./Home";

const HomeStack = createNativeStackNavigator<HomeStackNavigatorParamsList>();

type HomeScreenNavigatorProps = any;
const HomePageStackNavigator = (props: HomeScreenNavigatorProps) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "Home",
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: true,
        headerStyle: { backgroundColor: "#f9f9f9" },
      }}
      initialRouteName="HomeMain"
    >
      <HomeStack.Screen
        name="HomeMain"
        component={History}
        options={{ headerTitle: "Home" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomePageStackNavigator;
