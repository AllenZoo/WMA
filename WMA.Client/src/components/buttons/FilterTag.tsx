import { BG_COLOUR_BUTTON_PRIMARY } from "@/utils/designStyles";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  PressableProps,
  GestureResponderEvent,
  FlatList,
  LayoutChangeEvent,
  ScrollView,
} from "react-native";
import { Menu, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IFilterTagProps extends PressableProps {
  selection?: string | null;
  selections: string[];
  onRemove: () => void;
  onPress: (event: GestureResponderEvent) => void;
  onSelect: (selection: string) => void;
}

// FilterTag is a button that displays the current selection and a dropdown list of selections
const FilterTag: React.FC<IFilterTagProps> = ({
  selection,
  disabled,
  onRemove,
  onPress,
  onSelect,
  selections,
}) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);

  // If selection is null, default to "all"
  const [selected, setSelected] = useState<string>(selection ?? "all");
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const tagRef = useRef<View>(null);
  const contentRef = useRef<ScrollView>(null);

  const handleSelect = (selection: string) => {
    onSelect(selection);
    setSelected(selection);
    setDisplayDropdown(false);
    closeMenu();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    if (tagRef.current) {
      tagRef.current.measure((x, y, width, height, pageX, pageY) => {
        setLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const closeMenu = () => {
    setDisplayDropdown(false);
  };

  const openMenu = () => {
    setDisplayDropdown(true);
    // Use setTimeout to ensure the ScrollView is rendered before flashing
    setTimeout(() => {
      contentRef.current?.flashScrollIndicators();
    }, 100);
  };

  return (
    <View ref={tagRef} onLayout={handleLayout}>
      <Menu
        style={{}}
        contentStyle={{ maxHeight: 250 }}
        anchor={
          <Pressable
            className={`${BG_COLOUR_BUTTON_PRIMARY} flex-row items-center justify-center rounded-full px-3 py-2 min-w-[100px]`}
            onPress={() => {
              openMenu();
              // onPress;
              // setDisplayDropdown(!displayDropdown);
            }}
            disabled={disabled}
          >
            <Text
              className="text-white font-medium text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selected}
            </Text>
          </Pressable>
        }
        onDismiss={closeMenu}
        visible={displayDropdown}
      >
        <ScrollView ref={contentRef}>
          {selections.map((selection, index) => (
            // Use TouchableOpacity for Menu.Item interactions since it responds better to touch events
            <TouchableOpacity
              onPress={() => {
                handleSelect(selection);
              }}
              key={index}
            >
              <Menu.Item
                key={index}
                // onPress={() => {
                //   console.log("selection", selection);
                //   handleSelect(selection);
                // }}
                title={selection}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
};

export default FilterTag;
