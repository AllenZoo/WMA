import { Link } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import Button from "@/components/buttons/Button";
import TextBox from "@/components/inputs/TextBox";
import { api, AxiosError } from "@/utils/fetcher";
import { handleErrors, PasswordReqs } from "@/utils/inputErrors";
import BaseScreen from "../../components/layouts/Base";

const LoginSignUp2 = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginSignUp2">) => {
  const [errors, setErrors] = useState([true, true]);
  const [hasErrors, setHasErrors] = useState(true);
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const passwordFieldRef = useRef<TextInput | null>(null);
  const confirmPasswordFieldRef = useRef<TextInput | null>(null);

  const onErrors = (state: boolean, i: number) => {
    handleErrors(setErrors, errors, state, i);
    setHasErrors(errors.includes(true));
  };

  const handleSignUp = async () => {
    const data = JSON.stringify({
      username: route.params.username,
      email: route.params.email,
      ...credentials,
    });
    const headers = {
      "Content-Type": "application/json",
    };
    navigation.navigate("LoginSignUp3", {
      email: route.params.email,
      username: route.params.username,
      password: credentials.password,
    });

    await api
      .post("/user/signUpRequest", data, { headers })
      .then((res) => {
        console.log(res.data);
        // TODO: handle redirect and confirmation
      })
      .catch((err: AxiosError) => {
        console.log(err.request._response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <BaseScreen>
      <Text className="my-5 mt-8 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Sign Up
      </Text>
      <View>
        <View className="my-2 w-screen items-center">
          <TextBox
            ref={passwordFieldRef}
            keyboardType="default"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            onSubmitEditing={() => confirmPasswordFieldRef.current?.focus()}
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
            returnKeyType={"done"}
            useLegend
            legendText="Password"
            inputErrors={PasswordReqs}
            onErrors={(state) => onErrors(state, 0)}
          />
        </View>
        <View className="w-screen items-center">
          <TextBox
            ref={confirmPasswordFieldRef}
            keyboardType="default"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            onSubmitEditing={handleSignUp}
            onChangeText={(text) =>
              setCredentials({ ...credentials, confirmPassword: text })
            }
            returnKeyType={"done"}
            useLegend
            legendText="Confirm Password"
            inputErrors={{
              required: true,
              format: {
                regex: new RegExp(credentials.password),
                message: "Password must match",
              },
            }}
            onErrors={(state) => onErrors(state, 1)}
          />
        </View>
      </View>
      <View className="mt-6">
        <Button text="Sign Up" onPress={handleSignUp} disabled={hasErrors} />
      </View>

      <Text className="mt-2 font-400 text-md text-center px-4 leading-5 text-light-foreground-100 dark:text-dark-foreground-100">
        By signing up, you are accepting our{"\n"}
        <Link to={{ screen: "TermsOfService" }}>
          <Text className="underline">Terms of Service</Text>
        </Link>{" "}
        and{" "}
        <Link to={{ screen: "PrivacyPolicy" }}>
          <Text className="underline">Privacy Policy</Text>
        </Link>
        .
      </Text>
    </BaseScreen>
  );
};

export default LoginSignUp2;
