import React from "react";
import { View } from "react-native";

import Button from "@/components/buttons/Button";
import { useAuthStore } from "@/stores/auth.store";
import styles from "./styles";
import BaseScreenNavLayout from "@/components/layouts/BaseNavbar";

// type HomeProps = {} & NativeStackScreenProps<
//   RootStackNavigatorParamsList,
//   "Home"
// >;

type HomeProps = any;

const Home = ({ navigation }: HomeProps) => {
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <BaseScreenNavLayout styles="pt-14">
      <View style={styles.container}>
        <Button text="Sign Out (Home)" onPress={handleSignOut} />
      </View>
    </BaseScreenNavLayout>
  );
};

export default Home;
