import { resolveInputErrorMessage } from "@/utils/inputErrors";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

export type CallbackFunction = () => void;
interface ITextBoxProps extends TextInputProps {
  useLegend?: boolean;
  legendText?: string;
  inputErrors?: InputErrorsType;
  widthPercent?: string;
  additionalTextInputStyles?: string;
  maxChars?: number;
  showCharCount?: boolean;
  scale?: number;
  numberInput?: boolean;
  onErrors: (state: boolean) => void;
}

const TextBox = (props: ITextBoxProps, ref: ForwardedRef<TextInput>) => {
  const {
    useLegend,
    legendText = "Legend",
    inputErrors = {},
    placeholder,
    keyboardType,
    textContentType,
    autoCapitalize,
    secureTextEntry,
    returnKeyType,
    additionalTextInputStyles,
    maxChars,
    numberInput = false, // TODO: implement number input keyboard mode.
    scale = 100,
    widthPercent = "80",
    onChangeText,
    onSubmitEditing,
    onErrors,
    onBlur,
  } = props;

  const [focus, setFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentLength, setCurrentLength] = useState(0);
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => textInputRef.current!, []);

  const handleError = (text: string) => {
    const msg = resolveInputErrorMessage(text, inputErrors);
    setErrorMessage(msg);
    onErrors(!!msg);
  };

  const handleTextChange = (text: string) => {
    // If maxChars is defined, limit the text length
    const limitedText = maxChars ? text.slice(0, maxChars) : text;

    // Update current length
    setCurrentLength(limitedText.length);

    handleError(limitedText);
    if (onChangeText) onChangeText(limitedText);
  };

  return (
    <View
      className={`py-0.5 ${"scale-" + scale}`}
      style={[{ width: `${Number(widthPercent)}%` }]}
    >
      {useLegend && (
        <Text
          className={`top-2 left-4 z-[1] ${focus ? "text-light-primary" : "text-[#a8b7c8]"}`}
        >
          <Text className="bg-light-background dark:bg-dark-background">
            {legendText}
          </Text>
        </Text>
      )}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor="#a8b7c8"
        className={`h-14 w-full border-[#a8b7c8] focus:border-light-border border-2 text-xl bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground rounded-lg px-3 ${additionalTextInputStyles}`}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        autoCorrect={false}
        maxLength={maxChars}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
          handleError(e.nativeEvent.text);
        }}
        onChangeText={handleTextChange}
      />

      {errorMessage && (
        <Text className="absolute bottom-[-17] z-[1] text-light-attention-error dark:text-dark-attention-error">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default forwardRef<TextInput, ITextBoxProps>(TextBox);
