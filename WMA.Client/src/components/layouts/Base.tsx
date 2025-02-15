import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

interface IBaseScreenProps {
  styles?: string;
  children: React.ReactNode;
}

const BaseScreen = ({ styles = "pt-10", children }: IBaseScreenProps) => {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
      >
        <View
          className={`${styles} justify-center items-center bg-light-background dark:bg-dark-background`}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default BaseScreen;
