import {
  ColorValue,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  Text,
  View,
  StyleSheet,
} from "react-native";

export const baseContainerStyle =
  "items-center justify-center rounded-lg py-3 px-2 my-1 h-14";

interface IButtonProps extends PressableProps {
  useAlt?: boolean;
  text?: string;
  textSize?: string;
  backgroundColor?: ColorValue | undefined;
  textColor?: ColorValue | undefined;
  additionalStyleContainer?: string;
  additionalStyleText?: string;
  pressVisualFeedback?: boolean; // Toggles visual feedback on press
  onPress: (event: GestureResponderEvent) => void;
}

const Button = ({
  useAlt = false,
  text = "",
  textSize = "text-lg",
  backgroundColor,
  textColor,
  disabled,
  additionalStyleContainer,
  additionalStyleText,
  pressVisualFeedback = true,
  onPress = (e) => {},
}: IButtonProps) => {
  const baseButtonStyle = `${textSize} font-medium`;

  // Instead of using Tailwind for dynamic colors, use inline styles
  const styles = StyleSheet.create({
    dynamicBackground: backgroundColor
      ? {
          backgroundColor: backgroundColor,
        }
      : {},
    dynamicText: textColor
      ? {
          color: textColor,
        }
      : {},
  });

  const baseCols = {
    container: {
      normal:
        "bg-light-primary active:bg-light-primary/75 dark:bg-dark-primary active:dark:bg-dark-primary",
      alt: "bg-light-secondary-100 active:bg-light-secondary-100/75 dark:bg-dark-secondary-100 active:dark:bg-dark-secondary-100",
    },
    button: {
      normal: "text-light-background dark:text-dark-background",
      alt: "text-light-background dark:text-dark-background",
    },
  };

  const containerStyle = !useAlt
    ? `${baseContainerStyle} ${baseCols.container.normal}`
    : `${baseContainerStyle} ${baseCols.container.alt}`;
  const buttonTextStyle = !useAlt
    ? `${baseButtonStyle} ${baseCols.button.normal}`
    : `${baseButtonStyle} ${baseCols.button.alt}`;

  const pressVisualFeedbackStyle = pressVisualFeedback
    ? "active:opacity-70"
    : "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={styles.dynamicBackground}
      className={`w-64 ${containerStyle} ${disabled ? "opacity-50" : ""} ${pressVisualFeedbackStyle} ${additionalStyleContainer}`}
    >
      <View>
        <Text
          style={styles.dynamicText}
          className={`${buttonTextStyle} ${additionalStyleText}`}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default Button;
export { Button as CustomButton };
