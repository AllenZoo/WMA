import { useAuthStore } from "@/stores/auth.store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SvgFromUri } from "react-native-svg";

import AppleSignInButton from "@/components/buttons/AppleSignInButton";
import Button from "@/components/buttons/Button";
import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import BaseScreen from "../../components/layouts/Base";

WebBrowser.maybeCompleteAuthSession();

const LoginMain = ({
  navigation,
}: NativeStackScreenProps<RootStackNavigatorParamsList, "LoginMain">) => {
  const {
    user,
    hasTriedCache,
    setHasTriedCache,
    setAuthError,
    tryRestoreSession,
  } = useAuthStore();

  const handleSignInWithEmail = () => {
    navigation.navigate("LoginSignIn");
  };

  const handleSignInWithGoogle = () => {
    console.log("Sign in with Google");
  };

  const handleSignUpWithEmail = () => {
    navigation.navigate("LoginSignUp");
  };

  useEffect(() => {
    WebBrowser.warmUpAsync();
    setAuthError(null);
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    // try to fetch stored creds on load if not already logged (but don't try it more than once)
    if (user || hasTriedCache) return;
    setHasTriedCache(true);
    tryRestoreSession();
  }, []);

  return (
    <BaseScreen>
      <View style={{ width: 240, height: 240 }}>
        <SvgFromUri
          className="text-light-foreground dark:text-dark-foreground"
          uri="https://www.svgrepo.com/show/18057/dumbbell.svg"
          width={240}
          height={240}
          fill={"currentColor"}
        />
      </View>
      <Text className="my-1 font-bold text-3xl text-center text-light-foreground dark:text-dark-foreground">
        Workout Management System
      </Text>
      <Text className="my-5 font-medium text-lg text-center text-light-foreground-100 dark:text-dark-foreground-100">
        New day, New weight.
      </Text>

      <View className="flex items-center">
        <View>
          <Button text="Sign in with Email" onPress={handleSignInWithEmail} />
        </View>
        <View className="my-1">
          <GoogleSignInButton onPress={handleSignInWithGoogle} />
        </View>
        <View>
          <AppleSignInButton />
        </View>
      </View>

      <View className="flex flex-row space-x-2 my-5 items-center justify-center">
        <View className="h-0.5 w-1/3 bg-light-foreground dark:bg-dark-foreground" />
        <Text className="font-medium text-lg text-center text-light-foreground-100 dark:text-dark-foreground-100">
          or
        </Text>
        <View className="h-0.5 w-1/3 bg-light-foreground dark:bg-dark-foreground" />
      </View>

      <Button
        useAlt
        text="Sign up with Email"
        onPress={handleSignUpWithEmail}
      />
    </BaseScreen>
  );
};

export default LoginMain;
