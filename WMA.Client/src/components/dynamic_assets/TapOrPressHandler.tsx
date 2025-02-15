import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";

interface ITapOrPressHandlerProps {
  onPress?: () => void;
  onTap?: () => void;
  children: React.ReactNode;
}

// This component is used to handle both tap and press events.

const TapOrPressHandler: React.FC<ITapOrPressHandlerProps> = ({
  onPress = () => {},
  onTap = () => {},
  children,
}) => {
  const [longPress, setLongPress] = useState<boolean>(false);

  const handlePressOut = () => {
    if (longPress) {
      onPress();
      setLongPress(false);
      return;
    } else {
      onTap();
    }
  };
  return (
    <TouchableOpacity
      onLongPress={() => {
        setLongPress(true);
      }}
      delayLongPress={300}
      onPressOut={handlePressOut}
    >
      {children}
    </TouchableOpacity>
  );
};

export default TapOrPressHandler;
