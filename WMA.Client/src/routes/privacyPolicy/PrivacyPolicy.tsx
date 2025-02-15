import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";

import styles from "./styles";

type PrivacyPolicyProps = {} & NativeStackScreenProps<
  RootStackNavigatorParamsList,
  "PrivacyPolicy"
>;

const PrivacyPolicy = ({ navigation }: PrivacyPolicyProps) => {
  return (
    <View style={styles.container}>
      <Text>Privacy Policy</Text>
    </View>
  );
};

export default PrivacyPolicy;
