import THEMES from "@/utils/themes";
import React, { FC, FunctionComponent } from "react";
import { Pressable, View, Text } from "react-native";
import { Svg, SvgFromUri, SvgProps } from "react-native-svg";

interface NavBarButtonProps {
  text: string;
  onPress: () => void;
  useAlt?: boolean;
  active?: boolean; // For when the button is active (user is on this tab)
  svg?: React.FC<SvgProps>;
}

const NavBarButton: React.FC<NavBarButtonProps> = ({
  text,
  onPress,
  useAlt,
  active,
  svg: SvgIcon,
}) => {
  // Styling of component is based on two booleans: useAlt and active

  //#region Button Styling
  const buttonSize = "w-1/5 py-3 pb-6 px-2";
  const nonActiveButtonStyle =
    "bg-light-background active:bg-light-background dark:bg-dark-background active:dark:bg-dark-background";
  const activeButtonStyle = nonActiveButtonStyle;

  const altNonActiveButtonStyle =
    "bg-light-primary-100 active:bg-light-primary dark:bg-dark-primary active:dark:bg-dark-primary";
  const altActiveButtonStyle = altNonActiveButtonStyle;

  const currentButtonStyle = useAlt
    ? active
      ? altActiveButtonStyle
      : altNonActiveButtonStyle
    : active
      ? activeButtonStyle
      : nonActiveButtonStyle;
  //#endregion

  //#region Button Text Styling
  const baseButtonStyle = "text-xs font-medium";
  const activeButtonTextStyle = "text-light-accent dark:text-dark-accent";
  const nonActiveButtonTextStyle =
    "text-light-secondary dark:text-dark-secondary";

  const currentButtonTextStyle = active
    ? activeButtonTextStyle
    : nonActiveButtonTextStyle;
  //#endregion

  // TODO: figure out way to switch between light and dark themes
  const svgStyle = THEMES.light.secondary.DEFAULT;
  const svgStyleActive = THEMES.light.accent.DEFAULT;

  return (
    <Pressable
      className={`${buttonSize} ${currentButtonStyle}`}
      onPress={onPress}
    >
      <View className="items-center justify-center">
        {SvgIcon && (
          <SvgIcon
            width={30}
            height={30}
            fill={active ? svgStyleActive : svgStyle}
          />
        )}
        <Text className={`${currentButtonTextStyle} ${baseButtonStyle}`}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default NavBarButton;
