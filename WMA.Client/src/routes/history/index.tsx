import { createNativeStackNavigator } from "@react-navigation/native-stack";
import History from "./History";
import { Portal } from "react-native-paper";

const HistoryStack =
  createNativeStackNavigator<HistoryStackNavigatorParamsList>();

type HistoryScreenNavigatorProps = any;
const HistoryPageStackNavigator = (props: HistoryScreenNavigatorProps) => {
  return (
    <Portal.Host>
      <HistoryStack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: "History",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerStyle: { backgroundColor: "#f9f9f9" },
        }}
        initialRouteName="HistoryMain"
      >
        <HistoryStack.Screen
          name="HistoryMain"
          component={History}
          options={{ headerTitle: "History" }}
        />
      </HistoryStack.Navigator>
    </Portal.Host>
  );
};

export default HistoryPageStackNavigator;
