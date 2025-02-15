import { Pressable, View } from "react-native";
import InfoIcon from "../../../assets/svgs/info-icon.svg";

interface IInfoButtonProps {
  onPress: () => void;
  fill?: string;
  size?: number;
}

const InfoButton: React.FC<IInfoButtonProps> = ({ onPress, size = 50 }) => {
  return (
    <Pressable onPress={onPress}>
      <View>
        <InfoIcon width={size} height={size} strokeWidth={2} />
      </View>
    </Pressable>
  );
};

export default InfoButton;
