import { View, Text } from "react-native";
import { Modal, Portal, PaperProvider } from "react-native-paper";
import {
  BG_COLOUR_SECONDARY_2,
  TEXT_BODY_L,
  TEXT_HEADING_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import SuccessIcon from "../../../assets/svgs/success-icon.svg";
import Button from "../buttons/Button";

interface ICompletionModalProps {
  visible: boolean;
  headerText?: string;
  bodyText?: string;
  completionBtnText?: string;
  cancelBtnText?: string;
  onClose?: () => void;
  onContinue?: () => void;
}

const CompletionModal = ({
  visible,
  onClose,
  onContinue,
  headerText = "Complete!",
  bodyText = "Action completed successfully!",
  completionBtnText = "Continue",
  cancelBtnText = "Close",
}: ICompletionModalProps) => {
  const handleContinue = () => {
    onContinue && onContinue();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      visible={visible}
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
      onDismiss={handleClose}
    >
      <View
        className={`${BG_COLOUR_SECONDARY_2} p-4 w-[88%] rounded-2xl flex-col items-center`}
      >
        <View>
          <SuccessIcon width={50} height={50} />
        </View>
        <Text className={`${TEXT_HEADING_S} text-[#ffffff]`}>{headerText}</Text>
        <Text className={`${TEXT_BODY_L} text-center text-[#a0ff90]`}>
          {bodyText}
        </Text>

        {/* Continue/Close Buttons */}
        <View className="flex-row mt-4 mb-2">
          <Button
            additionalStyleContainer="w-[50%] mr-1 active:opacity-70"
            onPress={handleContinue}
            backgroundColor={"#a0ff90"}
            textColor={"#05080a"}
            text={completionBtnText}
          />
          <Button
            additionalStyleContainer="w-[50%] ml-1 active:opacity-70"
            onPress={handleClose}
            backgroundColor={"#5a5761"}
            text={cancelBtnText}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;
