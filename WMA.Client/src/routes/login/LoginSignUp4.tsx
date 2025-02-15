import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import Button from "@/components/buttons/Button";
import TextBox from "@/components/inputs/TextBox";
import { handleErrors } from "@/utils/inputErrors";
import BaseScreen from "../../components/layouts/Base";
import { useAuthStore } from "@/stores/auth.store";

const LoginSignUp4 = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginSignUp3">) => {
  const { signIn, setAuthError, authError } = useAuthStore();
  const [errors, setErrors] = useState([true, true]);
  const [hasErrors, setHasErrors] = useState(true);

  const onErrors = (state: boolean, i: number) => {
    handleErrors(setErrors, errors, state, i);
    setHasErrors(errors.includes(true));
  };

  // Logs the user in and navigates to the home screen
  const handleLogin = async () => {
    const credentials = {
      username: route.params?.username || "",
      email: route.params?.email || "",
      password: route.params?.password || "",
    };
    await signIn(credentials);
  };

  return (
    <BaseScreen>
      <Text className="my-5 mt-8 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Account Verified!
      </Text>
      <Text className="mx-5 text-base text-center text-light-foreground dark:text-dark-foreground">
        Your email has been verified! You can now log into your account.
      </Text>
      <View className="mt-5">
        <Button text="Continue" onPress={handleLogin} className="mt-5" />
      </View>
    </BaseScreen>
  );
};

export default LoginSignUp4;
