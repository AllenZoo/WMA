import { Exercise } from "@/stores/@types/exercise.store";
import {
  BG_COLOUR_SECONDARY_2,
  TEXT_HEADING_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import React, { useEffect } from "react";
import { Modal, View, Text, Button, Pressable, StyleSheet } from "react-native";
import { IconCloseButton } from "../../buttons/IconButton";
import DarkenedBlurOverlay from "../DarkenedBlurOverlay";
import { ScreenHeight, Tab, TabView } from "@rneui/base";
import THEMES from "@/utils/themes";
import ExerciseInfoPage from "./ExerciseInfoPage";

interface IExerciseInfoDisplayModalProps {
  exercise?: Exercise;
  onClose: () => void;
  visible: boolean;
}

const ExerciseInfoDisplayModal = ({
  exercise,
  onClose,
  visible,
}: IExerciseInfoDisplayModalProps) => {
  const [index, setIndex] = React.useState(0);

  // TODO: figure out how to get the current theme
  // const { colorScheme } = useTheme(); // Get the current theme
  const tabBackgroundColour = THEMES["light"].background.DEFAULT; // Extract the background color
  const activeBackgroundColour = THEMES["light"].primary.DEFAULT; // Extract the active background color
  const textColour = THEMES["light"].foreground.DEFAULT; // Extract the text color

  useEffect(() => {
    setIndex(0);
  }, [visible, exercise]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <DarkenedBlurOverlay>
        <Pressable
          style={({ pressed }) => [
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "transparent",
              height: ScreenHeight,
            },
          ]}
          onPress={onClose}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className={`${BG_COLOUR_SECONDARY_2} p-3 rounded-3xl w-full h-[90%] flex-col items-center`}
              style={{ maxWidth: "90%", width: 350, height: 650 }} // Add a maximum width
            >
              <View className="flex-col w-full h-full pt-1">
                {/* HEADER */}
                <View className="flex-row items-center w-full justify-between mb-4">
                  <View className="flex-row items-center">
                    <Text className={`${TEXT_HEADING_S} font-bold`}>
                      {exercise?.name}
                    </Text>
                  </View>
                  <View>
                    <IconCloseButton onPress={onClose} iconSize={18} />
                  </View>
                </View>

                {/* TABS */}
                <View className=" w-full h-[90%] flex-col">
                  {/* TAB BAR */}
                  <Tab
                    value={index}
                    onChange={(e) => setIndex(e)}
                    indicatorStyle={{
                      backgroundColor: activeBackgroundColour,
                      height: 0, // This is the slidey animation part of the tab. Disabled for now.
                    }}
                    containerStyle={(active: boolean) => ({
                      margin: 0,
                      overflow: "hidden",
                      width: "100%",
                      alignContent: "center",
                      paddingVertical: 8,
                      backgroundColor: active
                        ? activeBackgroundColour //  TODO: decide what looks better
                        : tabBackgroundColour,
                    })}
                    style={{ borderRadius: 10, overflow: "hidden" }}
                    variant="primary"
                  >
                    <Tab.Item
                      title="Info"
                      titleStyle={(active) => {
                        return active
                          ? { ...styles.tabItemTitleStyle, color: "white" }
                          : styles.tabItemTitleStyle;
                      }}
                      buttonStyle={{ paddingHorizontal: 4 }}
                    />
                    <Tab.Item
                      title="History"
                      titleStyle={(active) => {
                        return active
                          ? { ...styles.tabItemTitleStyle, color: "white" }
                          : styles.tabItemTitleStyle;
                      }}
                      buttonStyle={{ paddingHorizontal: 4 }}
                    />
                    <Tab.Item
                      title="Analytics"
                      titleStyle={(active) => {
                        return active
                          ? { ...styles.tabItemTitleStyle, color: "white" }
                          : styles.tabItemTitleStyle;
                      }}
                      buttonStyle={{ paddingHorizontal: 4 }}
                    />
                    <Tab.Item
                      title="Records"
                      titleStyle={(active) => {
                        return active
                          ? { ...styles.tabItemTitleStyle, color: "white" }
                          : styles.tabItemTitleStyle;
                      }}
                      buttonStyle={{ paddingHorizontal: 4 }}
                    />
                  </Tab>

                  {/* BODY */}
                  <View className="overflow-hidden w-[100%] h-[92%] mt-2">
                    <TabView
                      value={index}
                      onChange={setIndex}
                      disableTransition={true}
                      tabItemContainerStyle={{ width: "100%" }}
                    >
                      {/* INFO CONTENT */}
                      <TabView.Item style={{ width: "100%" }}>
                        <View>
                          <ExerciseInfoPage exercise={exercise} />
                        </View>
                      </TabView.Item>
                      <TabView.Item style={{ width: "100%" }}>
                        <View>
                          <Text style={{ color: textColour }}>
                            History Content
                          </Text>
                        </View>
                      </TabView.Item>
                      <TabView.Item style={{ width: "100%" }}>
                        <View>
                          <Text style={{ color: textColour }}>
                            Analytics Content
                          </Text>
                        </View>
                      </TabView.Item>
                      <TabView.Item style={{ width: "100%" }}>
                        <View>
                          <Text style={{ color: textColour }}>
                            Records Content
                          </Text>
                        </View>
                      </TabView.Item>
                    </TabView>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </DarkenedBlurOverlay>
    </Modal>
  );
};

// Create stylesheet to extract duplicate Tab.Item TitleStyle
const styles = StyleSheet.create({
  tabItemTitleStyle: {
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 0,
    color: "black",
  },
});

export default ExerciseInfoDisplayModal;
