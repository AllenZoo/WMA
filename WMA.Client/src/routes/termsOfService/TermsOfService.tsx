import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";

import styles from "./styles";

type TermsOfServiceProps = {} & NativeStackScreenProps<
  RootStackNavigatorParamsList,
  "TermsOfService"
>;

const TermsOfService = ({ navigation }: TermsOfServiceProps) => {
  return (
    <View style={styles.container}>
      <Text>Terms of Service</Text>
    </View>
  );
};

export default TermsOfService;
