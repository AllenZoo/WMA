import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";
import AddIcon from "../../../assets/svgs/add-icon.svg";
import FilterIcon from "../../../assets/svgs/filter-icon.svg";
import CloseIcon from "../../../assets/svgs/close-icon.svg";

interface IconButtonProps {
  onPress: () => void;
  icon: React.FC<SvgProps>;
  text?: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

interface IconFilledButtonProps {
  onPress: () => void;
  icon?: React.FC<SvgProps>;
  text?: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon: Icon,
  text,
  iconSize = 24,
  iconColor = "#000",
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon width={iconSize} height={iconSize} fill={iconColor} />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
});

export default IconButton;

const IconAddButton = ({
  onPress,
  disabled,
  iconSize,
}: IconFilledButtonProps) => {
  return (
    <IconButton
      onPress={onPress}
      icon={AddIcon}
      disabled={disabled}
      iconSize={iconSize}
    />
  );
};
export { IconAddButton };

const IconFilterButton = ({
  onPress,
  disabled,
  iconSize,
}: IconFilledButtonProps) => {
  return (
    <IconButton
      onPress={onPress}
      icon={FilterIcon}
      disabled={disabled}
      iconSize={iconSize}
    />
  );
};
export { IconFilterButton };

const IconCloseButton = ({
  onPress,
  disabled,
  iconSize,
}: IconFilledButtonProps) => {
  return (
    <IconButton
      onPress={onPress}
      icon={CloseIcon}
      disabled={disabled}
      iconSize={iconSize}
    />
  );
};
export { IconCloseButton };
