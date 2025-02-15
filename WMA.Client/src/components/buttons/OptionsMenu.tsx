import React, { ReactNode, useState } from "react";
import {
  View,
  Text,
  Pressable,
  PressableProps,
  TouchableOpacity,
} from "react-native";
import DotMenuSvg from "../../../assets/svgs/dot-menu.svg";
import { BG_COLOUR_BUTTON_PRIMARY } from "@/utils/designStyles";
import { Menu, PaperProvider } from "react-native-paper";
import { SvgProps } from "react-native-svg";

interface IOptionsMenuProps extends PressableProps {
  options: Array<{
    label: string;
    onSelect: () => void;
    leadingIcon?: () => ReactNode;
  }>;
  optionButtonSVG?: () => ReactNode | ReactNode;
}

const OptionsMenu: React.FC<IOptionsMenuProps> = ({
  options,
  disabled,
  optionButtonSVG: OptionButtonSVG = () => (
    <DotMenuSvg fill={"white"} width={50} height={30} />
  ),
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleSelect = (onSelect: () => void) => {
    closeMenu();
    onSelect();
  };

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Pressable
            className={`flex-row items-center justify-center rounded-full ${BG_COLOUR_BUTTON_PRIMARY}`}
            onPress={openMenu}
            disabled={disabled}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
          >
            {OptionButtonSVG()}
          </Pressable>
        }
      >
        {options.map((option, index) => (
          // Use TouchableOpacity for Menu.Item interactions since it responds better to touch events
          <Pressable
            //onPress={}
            onPressOut={() => handleSelect(option.onSelect)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
            key={index}
          >
            <View>
              <Menu.Item
                key={index}
                // onPress={() => handleSelect(option.onSelect)}
                title={option.label}
                leadingIcon={option.leadingIcon}
              />
            </View>
          </Pressable>
        ))}
      </Menu>
    </View>
  );
};

export default OptionsMenu;
