import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface INumericInputBoxProps {
  styles?: string;
  maxChars?: number;
  onChange?: (value: number) => void;
}

const NumericInputBox: React.FC<INumericInputBoxProps> = ({
  styles,
  maxChars = 3,
  onChange = () => {},
}) => {
  return (
    <View
      className={`w-16 rounded-2xl border-[#a8b7c8] focus:border-light-border border-2 text-xl bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground ${styles}`}
    >
      <View className="w-full px-2 py-1">
        <TextInput
          keyboardType="numeric"
          className="text-center w-full"
          maxLength={maxChars}
          onFocus={() => {
            // select all current text
          }}
          onChangeText={(text) => {
            const value = parseInt(text);
            if (!isNaN(value)) {
              onChange(value);
            }
          }}
        />
      </View>
    </View>
  );
};
export default NumericInputBox;
