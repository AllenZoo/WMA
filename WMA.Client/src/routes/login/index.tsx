import { NativeStackScreenProps } from "@react-navigation/native-stack";

import LoginMain from "./LoginMain";
import LoginSignIn from "./LoginSignIn";
import LoginSignUp from "./LoginSignUp";
import LoginSignUp2 from "./LoginSignUp2";
import LoginSignUp3 from "./LoginSignUp3";
import LoginSignUp4 from "./LoginSignUp4";

const LoginScreen = (
  props: NativeStackScreenProps<
    RootStackNavigatorParamsList,
    keyof RootStackNavigatorParamsList
  >
) => {
  const { route } = props;

  switch (route.name) {
    case "LoginMain":
      return <LoginMain {...(props as any)} />;
    case "LoginSignIn":
      return <LoginSignIn {...(props as any)} />;
    case "LoginSignUp":
      return <LoginSignUp {...(props as any)} />;
    case "LoginSignUp2":
      return <LoginSignUp2 {...(props as any)} />;
    case "LoginSignUp3":
      return <LoginSignUp3 {...(props as any)} />;
    case "LoginSignUp4":
      return <LoginSignUp4 {...(props as any)} />;
    default:
      console.error("Invalid route name");
      break;
  }
};

export default LoginScreen;
