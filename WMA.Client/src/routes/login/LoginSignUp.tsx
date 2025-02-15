import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import BaseScreen from "@/components/layouts/Base";
import Button from "@/components/buttons/Button";
import TextBox from "@/components/inputs/TextBox";
import { EmailReqs, handleErrors } from "@/utils/inputErrors";
import { api, AxiosError } from "@/utils/fetcher";

const LoginSignUp = ({
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginSignUp">) => {
  // Represents the state of errors regarding: [username, email] inputs
  const [errors, setErrors] = useState([true, true]);
  const [hasErrors, setHasErrors] = useState(true);
  const [credentials, setCredentials] = useState<LoginSignUpForm>({
    username: "",
    email: "",
  });

  // Represents the state of verification regarding: [username, email] inputs. Possible to use existing errors var but wahtever lol.
  const [verifiedFields, setVerifiedFields] = useState([false, false]);
  const [hasVerifiedAllInput, setHasVerifiedAllInput] = useState(false);

  const usernameFieldRef = useRef<TextInput | null>(null);
  const emailFieldRef = useRef<TextInput | null>(null);

  const [uniqueUsernameReq, setUniqueUsernameReq] = useState({
    required: true,
    state: {
      active: false,
      message: "Username is already taken",
    },
  });
  const [uniqueEmailReq, setUniqueEmailReq] = useState({
    required: true,
    state: {
      active: false,
      message: "Email is already associated with existing user!",
    },
  });

  const onErrors = (state: boolean, i: number) => {
    handleErrors(setErrors, errors, state, i);
    setHasErrors(errors.includes(true));
  };

  /** Checks if Username is taken. If so display error.
   */
  const verifyUsername = async () => {
    console.log("Verifying username!");
    await api
      .get("/user/by-username", {
        params: { username: credentials.username },
      })
      .then((res) => {
        console.log("Response:", res);
        if (res?.status === 200) {
          console.log("Username already taken!");
          setVerifiedFields([false, verifiedFields[1]]);
          if (!uniqueUsernameReq.state.active) {
            setUniqueUsernameReq({
              ...uniqueUsernameReq,
              state: { active: true, message: "Username is already taken" },
            });
          }
          onErrors(true, 0);
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          console.log("Username not found! Username is unique.");
          setVerifiedFields([true, verifiedFields[1]]);
          if (uniqueUsernameReq.state.active) {
            setUniqueUsernameReq({
              ...uniqueUsernameReq,
              state: { active: false, message: "Username is already taken" },
            });
          }
          onErrors(false, 0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /** Checks if Email is already associated with existing user. If so display error.
   */
  const verifyEmail = async () => {
    console.log("Verifying email!");
    await api
      .get("/user/by-email", {
        params: { email: credentials.email },
      })
      .then((res) => {
        if (res?.status === 200) {
          setVerifiedFields([verifiedFields[0], false]);
          if (!uniqueEmailReq.state.active) {
            setUniqueEmailReq({
              ...uniqueEmailReq,
              state: {
                active: true,
                message: "Email is already associated with existing user!",
              },
            });
          }
          onErrors(true, 1);
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          console.log("Email not found! Email is valid input.");
          setVerifiedFields([verifiedFields[0], true]);
          if (uniqueEmailReq.state.active) {
            setUniqueEmailReq({
              ...uniqueEmailReq,
              state: {
                active: false,
                message: "Email is already associated with existing user!",
              },
            });
          }
          onErrors(false, 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleContinue = async () => {
    await verifyUsername();
    await verifyEmail();

    if (!hasVerifiedAllInput) {
      console.log("Input not verified, cannot continue.");
      return;
    } else {
      navigation.navigate("LoginSignUp2", { ...credentials });
    }
  };

  useEffect(() => {
    // refocus and blur to display error message
    usernameFieldRef.current?.focus();
    usernameFieldRef.current?.blur();
  }, [uniqueUsernameReq]);

  useEffect(() => {
    // refocus and blur to display error message
    emailFieldRef.current?.focus();
    emailFieldRef.current?.blur();
  }, [uniqueEmailReq]);

  useEffect(() => {
    setHasVerifiedAllInput(!verifiedFields.includes(false));
  }, [verifiedFields]);

  return (
    <BaseScreen>
      <Text className="mt-8 mb-28 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Sign Up
      </Text>
      <View>
        <View className="w-screen items-center">
          <TextBox
            ref={usernameFieldRef}
            keyboardType="default"
            autoCapitalize="none"
            textContentType="username"
            returnKeyType={"next"}
            onSubmitEditing={() => emailFieldRef.current?.focus()}
            onChangeText={(text) => {
              setCredentials({ ...credentials, username: text });
              //console.log("verified fields:", verifiedFields);
              setVerifiedFields([false, verifiedFields[1]]);
            }}
            onBlur={verifyUsername}
            useLegend
            legendText="Username"
            inputErrors={uniqueUsernameReq}
            onErrors={(state) => onErrors(state, 0)}
          />
        </View>
        <View className="my-2 w-screen items-center">
          <TextBox
            ref={emailFieldRef}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            returnKeyType={"next"}
            onSubmitEditing={handleContinue}
            onChangeText={(text) => {
              setCredentials({ ...credentials, email: text });
              setVerifiedFields([verifiedFields[0], false]);
            }}
            useLegend
            legendText="Email"
            inputErrors={{ ...uniqueEmailReq, ...EmailReqs }}
            onBlur={verifyEmail}
            onErrors={(state) => onErrors(state, 1)}
          />
        </View>
      </View>
      <View className="mt-12">
        <Button
          text="Continue"
          onPress={handleContinue}
          disabled={hasErrors || !hasVerifiedAllInput}
        />
      </View>
    </BaseScreen>
  );
};

export default LoginSignUp;
