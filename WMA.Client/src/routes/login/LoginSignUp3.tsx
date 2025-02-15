import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import Button from "@/components/buttons/Button";
import TextBox from "@/components/inputs/TextBox";
import { api, AxiosError } from "@/utils/fetcher";
import { handleErrors, VerificationCodeReqs } from "@/utils/inputErrors";
import BaseScreen from "../../components/layouts/Base";

const LoginSignUp3 = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginSignUp3">) => {
  const [errors, setErrors] = useState([true, true]);
  const [hasErrors, setHasErrors] = useState(true);
  const [credentials, setCredentials] = useState({
    verificationCode: "",
  });

  // Timer for resend email button
  const [timer, setTimer] = useState(-1);
  const RESEND_DELAY_DURATION_SECONDS = 60;

  // Manges the resend email button state
  const [resendDisabled, setResendDisabled] = useState(false);
  const verificationCodeRef = useRef<TextInput | null>(null);
  const [verificationError, setVerificationError] = useState(false);

  const onErrors = (state: boolean, i: number) => {
    handleErrors(setErrors, errors, state, i);
    setHasErrors(errors.includes(true));
  };

  const handleVerification = async () => {
    const emailToVerify = route.params?.email || "";
    console.log("Verifying account with email: ", emailToVerify);
    const pathParams =
      "?code=" + credentials.verificationCode + "&email=" + emailToVerify;
    const headers = {
      "Content-Type": "application/json",
    };

    await api
      .get("/user/verify" + pathParams, { headers })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log("Account verified");
          setVerificationError(false);
          navigation.navigate("LoginSignUp4", {
            ...route.params,
          });
        } else if (res.status === 400) {
          console.log("Invalid verification request!");
          setVerificationError(true);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.request._response);
        setVerificationError(true);
      })
      .catch((err) => {
        console.log(err);
        setVerificationError(true);
      });
  };

  const handleResendEmail = async () => {
    const data = JSON.stringify({
      username: route.params.username,
      email: route.params.email,
      password: route.params.password,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    setResendDisabled(true);
    setVerificationError(false);
    setTimer(RESEND_DELAY_DURATION_SECONDS);

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

  // Handles timer countdown. Enables the resend email button after the timer reaches 0
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 0) {
          return prev - 1;
        } else {
          // Enables the resend email button after the timer reaches 0
          setResendDisabled(false);
          return -1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <BaseScreen>
      <Text className="my-5 mt-8 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Account Verification
      </Text>
      <Text className="mx-3 text-base text-center text-light-foreground dark:text-dark-foreground">
        An email has been sent to {route.params.email} {"\n"} Please verify your
        account using the code or link provided.
      </Text>

      <View className="">
        {verificationError && (
          <Text className="pt-5 text-center font-bold text-light-attention-error dark:text-dark-attention-error">
            Invalid verification code. Please try again.
          </Text>
        )}
      </View>
      <View>
        <View className="my-2 w-screen items-center">
          <TextBox
            ref={verificationCodeRef}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
            secureTextEntry={false}
            onSubmitEditing={handleVerification}
            onChangeText={(text) =>
              setCredentials({ ...credentials, verificationCode: text })
            }
            returnKeyType={"done"}
            useLegend
            legendText="Code"
            inputErrors={VerificationCodeReqs}
            onErrors={(state) => {
              onErrors(state, 0);
              onErrors(state, 1);
            }}
          />
        </View>
      </View>
      <View className="mt-5">
        <Button
          text="Verify Account"
          onPress={() => {
            handleVerification();
          }}
          disabled={hasErrors}
        />
      </View>
      <View className="mt-1">
        <Button
          text="Resend Email"
          onPress={() => {
            handleResendEmail();
          }}
          disabled={resendDisabled}
          useAlt={true}
        />
      </View>

      {timer >= 0 && (
        <Text className="mt-2 mx-8 text-base text-center text-light-foreground dark:text-dark-foreground">
          {/* Email sent! {"\n"} */}
          Please wait another {timer} seconds before resending the email.
        </Text>
      )}
    </BaseScreen>
  );
};

export default LoginSignUp3;
