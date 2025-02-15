import {
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { baseContainerStyle } from "./Button";

import AppleSVG from "@/../assets/svgs/apple-icon.svg";

const AppleSignInButton = () => {
  return (
    <Pressable
      onPress={async () => {
        try {
          const credential = await signInAsync({
            requestedScopes: [
              AppleAuthenticationScope.FULL_NAME,
              AppleAuthenticationScope.EMAIL,
            ],
          });
          // signed in
        } catch (e: any) {
          if (e.code === "ERR_REQUEST_CANCELED") {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
      className={`w-64 ${baseContainerStyle} bg-[#a8b7c8] active:bg-[#a8b7c8]/75 dark:bg-[#e7eaee] active:dark:bg-[#e7eaee]/75`}
    >
      <View className="items-center flex-row space-x-2">
        <AppleSVG
          width={32}
          height={32}
        />
        <Text className="font-semibold text-lg text-light-foreground/[0.7] dark:text-dark-foreground/[0.7]">
          Continue with Apple
        </Text>
      </View>
    </Pressable>
  );
};
export default AppleSignInButton;
