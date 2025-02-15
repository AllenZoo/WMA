import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/buttons/Button";
import { useAuthStore } from "@/stores/auth.store";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { TEXT_BODY_L, TEXT_HEADING_S } from "@/utils/designStyles";

type ProfileProps = any;

const Profile = ({ navigation }: ProfileProps) => {
  const { signOut } = useAuthStore();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to grant permission to access your photos to change your profile picture."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Upload image to server. Figure out how to store.
      // Here you would typically upload the image to your server
      // uploadImageToServer(result.assets[0].uri);
    }
  };

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="w-full"
      contentContainerStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View className="w-full h-full flex-1 justify-center items-center">
        <View className="mt-5" />
        <Pressable onPress={pickImage}>
          <Avatar.Image
            source={
              image
                ? { uri: image }
                : require("../../../assets/images/default-profile-image.jpg")
            }
            size={150}
          />
          <View className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2">
            <Text className="text-white text-xs">Edit</Text>
          </View>
        </Pressable>

        <View className="mt-3">
          <Text className={`${TEXT_HEADING_S}`}>Jonny Boi</Text>
        </View>

        <View className="mt-1">
          <Text className={`${TEXT_BODY_L}`}>somemail@gmail.com</Text>
        </View>

        <View className="py-12 flex-col">
          {/* <Text className={`${TEXT_BODY_L}`}>Iron Curled: 999kg</Text>
          <Text className={`${TEXT_BODY_L}`}>Total Workout Sessions: 80</Text> */}
        </View>

        <View className="mt-10">
          <Button text="Settings" onPress={() => {}} />
        </View>

        <View className="">
          <Button text="Sign Out" onPress={handleSignOut} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
