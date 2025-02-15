import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Navbar from "../tabs/Navbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigateToTabDefBehaviour } from "@/utils/tabNavigator";

interface IBaseScreenProps {
  styles?: string;
  children: React.ReactNode;
  //initialActiveTab?: number;
  // navigation: NativeStackNavigationProp<RootStackNavigatorParamsList, any>;
}

const BaseScreenNavLayout = ({
  styles = "pt-10",
  children,
  //initialActiveTab = 1,
  //navigation,
}: IBaseScreenProps) => {
  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
        style={{ flex: 1 }}
      >
        <View
          className={`${styles} flex-1 justify-center items-center bg-light-background dark:bg-dark-background`}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default BaseScreenNavLayout;
