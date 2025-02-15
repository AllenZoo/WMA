import React, { useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent } from "react-native";
import Button from "../buttons/Button";
import NavBarButton from "../buttons/NavBarButton";
import Stump from "../../../assets/svgs/stump-icon.svg";
import House from "../../../assets/svgs/house-icon.svg";
import History from "../../../assets/svgs/history-icon.svg";
import Dumbbell from "../../../assets/svgs/dumbbell-icon.svg";
import Profile from "../../../assets/svgs/profile-icon.svg";

interface INavbarProps {
  activeTab: number; // for initial active tab
  onTabPress: (tab: number) => void;
}

const Navbar = ({ activeTab, onTabPress }: INavbarProps) => {
  const [activeTabState, setActiveTab] = useState(activeTab ? activeTab : 1);

  const handleTabPress = (tab: number) => {
    // Don't trigger press event if tab pressed is already active
    if (tab === activeTabState) return;

    onTabPress(tab);
    setActiveTab(tab);
  };

  return (
    //styling used to be: absolute bottom-0
    <View className="">
      {/* Border Line */}
      <View className="border-t-2 border-black " />
      <View className="flex-row">
        <NavBarButton
          text="Home"
          onPress={() => {
            handleTabPress(1);
          }}
          active={activeTabState === 1}
          svg={House}
        />
        <NavBarButton
          text="History"
          onPress={() => {
            handleTabPress(2);
          }}
          active={activeTabState === 2}
          svg={History}
        />
        <NavBarButton
          text="Workouts"
          onPress={() => {
            handleTabPress(3);
          }}
          active={activeTabState === 3}
          //useAlt
          svg={Stump}
        />
        <NavBarButton
          text="Exercises"
          onPress={() => {
            handleTabPress(4);
          }}
          active={activeTabState === 4}
          svg={Dumbbell}
        />
        <NavBarButton
          text="Profile"
          onPress={() => {
            handleTabPress(5);
          }}
          active={activeTabState === 5}
          svg={Profile}
        />
      </View>
    </View>
  );
};

export default Navbar;
