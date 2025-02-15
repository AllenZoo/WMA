import { Link, StackActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import AppleSignInButton from "@/components/buttons/AppleSignInButton";
import Button from "@/components/buttons/Button";
import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import TextBox from "@/components/inputs/TextBox";
import { useAuthStore } from "@/stores/auth.store";
import { handleErrors } from "@/utils/inputErrors";
import BaseScreen from "../../components/layouts/Base";

const LoginSignIn = ({
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginSignIn">) => {
  const { signIn, setAuthError, authError } = useAuthStore();
  const [errors, setErrors] = useState([true, true]);
  const [hasErrors, setHasErrors] = useState(true);
  const [credentials, setCredentials] = useState<SignInUser>({
    username: "",
    email: "",
    password: "",
  });
  const passwordFieldRef = useRef<TextInput | null>(null);

  const onErrors = (state: boolean, i: number) => {
    handleErrors(setErrors, errors, state, i);
    setHasErrors(errors.includes(true));
  };

  const handleLogin = async () => {
    await signIn(credentials);
  };

  const handleSignInWithGoogle = () => {
    console.log("Sign in with Google");
  };

  const handleSignUpWithEmail = () => {
    navigation.dispatch(StackActions.replace("LoginMain"));
    navigation.navigate("LoginSignUp");
  };

  useEffect(() => {
    setAuthError(null);
  }, []);

  return (
    <BaseScreen styles="pt-14">
      <Text className="mt-5 mb-4 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Log into Workout Management System
      </Text>
      <View>
        <View className="mb-1">
          {authError ? (
            <Text className="absolute text-center font-bold text-light-attention-error dark:text-dark-attention-error">
              {authError}
            </Text>
          ) : null}
        </View>
        <View className="my-2 w-screen items-center">
          <TextBox
            keyboardType="default"
            autoCapitalize="none"
            textContentType="username"
            returnKeyType={"next"}
            onSubmitEditing={() => passwordFieldRef.current?.focus()}
            onChangeText={(text) =>
              setCredentials({ ...credentials, username: text })
            }
            useLegend
            legendText="Username/Email"
            inputErrors={{
              required: true,
            }}
            onErrors={(state) => onErrors(state, 0)}
          />
        </View>
        <View className="my-2 w-screen items-center">
          <TextBox
            ref={passwordFieldRef}
            keyboardType="default"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            onSubmitEditing={handleLogin}
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
            returnKeyType={"done"}
            useLegend
            legendText="Password"
            inputErrors={{
              required: true,
            }}
            onErrors={(state) => onErrors(state, 1)}
          />
        </View>
      </View>
      <View className="mt-4">
        <Button text="Login" onPress={handleLogin} disabled={hasErrors} />
      </View>

      <Text className="mt-3 font-400 underline text-lg text-center px-4 leading-5 text-light-foreground-100 dark:text-dark-foreground-100">
        <Link to={{ screen: "ForgotPassword" }}>Forgot Password</Link>
      </Text>

      <View className="flex flex-row space-x-2 my-3 items-center justify-center">
        <View className="h-0.5 w-1/3 bg-light-foreground dark:bg-dark-foreground" />
        <Text className="font-medium text-lg text-center text-light-foreground-100 dark:text-dark-foreground-100">
          or
        </Text>
        <View className="h-0.5 w-1/3 bg-light-foreground dark:bg-dark-foreground" />
      </View>

      <View className="mb-3">
        <View className="my-1">
          <GoogleSignInButton onPress={handleSignInWithGoogle} />
        </View>
        <View className="my-1">
          <AppleSignInButton />
        </View>
      </View>

      <View className="flex flex-row space-x-2 my-3 items-center justify-center">
        <View className="h-0.5 w-9 bg-light-foreground dark:bg-dark-foreground" />
        <Text className="font-medium text-lg text-center text-light-foreground-100 dark:text-dark-foreground-100">
          Don't have an account yet?
        </Text>
        <View className="h-0.5 w-9 bg-light-foreground dark:bg-dark-foreground" />
      </View>

      <Button
        useAlt
        text="Sign up with Email"
        onPress={handleSignUpWithEmail}
      />
    </BaseScreen>
  );
};

export default LoginSignIn;
