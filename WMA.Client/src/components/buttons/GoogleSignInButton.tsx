import React from "react";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";

import { baseContainerStyle } from "./Button";

import GoogleSVG from "@/../assets/svgs/google-icon.svg";

interface IGoogleSignInButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

const GoogleSignInButton = ({
  onPress = (e) => {},
}: IGoogleSignInButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`w-64 ${baseContainerStyle} bg-[#a8b7c8] active:bg-[#a8b7c8]/75 dark:bg-[#e7eaee] active:dark:bg-[#e7eaee]/75`}
    >
      <View className="items-center flex-row space-x-2">
        <GoogleSVG
          width={32}
          height={32}
        />
        <Text className="font-semibold text-lg text-light-foreground/[0.7] dark:text-dark-foreground/[0.7]">
          Continue with Google
        </Text>
      </View>
    </Pressable>
  );
};

export default GoogleSignInButton;
