import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const BottomSheetPageTest = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "50%", "90%"], []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
    setCurrentIndex(index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const renderContent = () => {
    switch (currentIndex) {
      case 0:
        return (
          <View className="p-4">
            <Text className="text-lg font-semibold">Minimized View</Text>
            <Text className="text-gray-600">Drag up to see more content</Text>
          </View>
        );
      case 1:
        return (
          <View className="p-4">
            <Text className="text-xl font-semibold mb-4">
              Half-Expanded View
            </Text>
            <Text className="text-gray-600">
              This content is shown at 50% height
            </Text>
            <View className="mt-4 bg-blue-100 p-4 rounded-lg">
              <Text className="font-medium">Mid-height specific content</Text>
            </View>
          </View>
        );
      case 2:
        return (
          <View className="p-4">
            <Text className="text-2xl font-semibold mb-4">Full View</Text>
            <Text className="text-gray-600 mb-4">
              This is the fully expanded view with more detailed content
            </Text>
            <View className="space-y-4">
              <View className="bg-green-100 p-4 rounded-lg">
                <Text className="font-medium">Detailed Section 1</Text>
              </View>
              <View className="bg-yellow-100 p-4 rounded-lg">
                <Text className="font-medium">Detailed Section 2</Text>
              </View>
              <View className="bg-purple-100 p-4 rounded-lg">
                <Text className="font-medium">Detailed Section 3</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View className="absolute bottom-20 bg-gray-100 pt-16">
      {/* <View className="px-4">
        <Text className="text-2xl font-bold mb-4">Bottom Sheet Demo</Text>
        <View className="flex-row space-x-2 mb-4">
          <Pressable
            onPress={() => handleSnapPress(0)}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">10%</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSnapPress(1)}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">50%</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSnapPress(2)}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">90%</Text>
          </Pressable>
        </View>
      </View> */}

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <BottomSheetView>{renderContent()}</BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default BottomSheetPageTest;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});
