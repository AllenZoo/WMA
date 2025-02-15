import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  PressableProps,
  LayoutChangeEvent,
  TouchableOpacity,
} from "react-native";

import { Menu } from "react-native-paper";

interface IOptionsTextButtonMenuProps extends PressableProps {
  options: Array<{
    label: string;
    onSelect: () => void;
    leadingIcon?: () => React.ReactNode;
  }>;
  buttonText?: string; // New prop for custom button text
  buttonClassName?: string; // Optional custom className for button styling
  buttonTextClassName?: string; // Optional custom className for button text styling
}

// OptionsTextButton is a button that displays custom text and a dropdown list of actions
const OptionsTextButtonMenu: React.FC<IOptionsTextButtonMenuProps> = ({
  options,
  disabled,
  buttonText = "Options", // Default text if not provided
  buttonClassName = "",
  buttonTextClassName = "",
}) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const menuRef = useRef<View>(null);

  const handleSelect = (onSelect: () => void) => {
    onSelect();
    setDisplayDropdown(false);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    if (menuRef.current) {
      menuRef.current.measure((x, y, width, height, pageX, pageY) => {
        setLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const openMenu = () => {
    setDisplayDropdown(true);
  };

  const closeMenu = () => {
    setDisplayDropdown(false);
  };

  const outlineStyle = "";

  return (
    <View ref={menuRef} onLayout={handleLayout}>
      <Menu
        visible={displayDropdown}
        onDismiss={closeMenu}
        anchor={
          <Pressable
            className={`flex-row items-center justify-center rounded-md px-1 py-1 ${buttonClassName} w-8 rounded-2xl border-[#a8b7c8] focus:border-light-border click:border-light-border border-2
       text-xl bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground`}
            onPress={() => setDisplayDropdown(!displayDropdown)}
            disabled={disabled}
          >
            <Text className={`${buttonTextClassName}`}>{buttonText}</Text>
          </Pressable>
        }
      >
        {options.map((option, index) => (
          // Use TouchableOpacity for Menu.Item interactions since it responds better to touch events
          <Pressable
            onPressOut={() => handleSelect(option.onSelect)}
            key={index}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
          >
            <Menu.Item
              key={index}
              // onPress={() => handleSelect(option.onSelect)}
              title={option.label}
              leadingIcon={option.leadingIcon}
            />
          </Pressable>
        ))}
      </Menu>
    </View>
  );
};

export default OptionsTextButtonMenu;
