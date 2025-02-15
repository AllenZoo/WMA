import { NavigationContainerRef } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function NavigateToTabDefBehaviour(
  tabNumber: number,
  navigation: NativeStackNavigationProp<RootStackNavigatorParamsList, any>
) {
  switch (tabNumber) {
    case 1:
      navigation.navigate("Home");
      break;
    case 2:
      navigation.navigate("History");
      break;
    case 3:
      navigation.navigate("Workouts");
      break;
    case 4:
      navigation.navigate("Exercises");
      break;
    case 5:
      navigation.navigate("Profile");
      break;
    default:
      // Handle invalid tab number
      break;
  }
}
