import { NativeStackScreenProps } from "@react-navigation/native-stack";
//import MainPage from "./MainPage";

const MainScreen = (
  props: NativeStackScreenProps<RootStackNavigatorParamsList, "Main">
) => {
  return <MainPage {...props} />;
};

export default MainScreen;
