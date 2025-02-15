import { View, Text } from "react-native";

import { Modal, Portal, PaperProvider } from "react-native-paper";
import {
  BG_COLOUR_SECONDARY_2,
  TEXT_BODY_L,
  TEXT_HEADING_M,
  TEXT_HEADING_S,
} from "@/utils/designStyles";
import AlertIcon from "../../../assets/svgs/alert-icon.svg";
import Button from "../buttons/Button";

interface IDeleteModalProps {
  visible: boolean;
  titleText?: string;
  bodyText?: string;
  onClose?: () => void;
  onDelete?: () => void;
}

const DeleteModal = ({
  visible,
  onClose,
  onDelete,
  titleText = "Confirm Delete?",
  bodyText = "You are about to delete this item. This action is irreversible.",
}: IDeleteModalProps) => {
  const handleDelete = () => {
    onDelete && onDelete();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        onDismiss={handleClose}
      >
        <View
          className={`${BG_COLOUR_SECONDARY_2} p-4 w-[88%] rounded-2xl flex-col items-center`}
        >
          <View>
            <AlertIcon width={50} height={50} />
          </View>
          <Text className={`${TEXT_HEADING_S} text-[#ffffff]`}>
            {titleText}
          </Text>
          <Text className={`${TEXT_BODY_L} text-center text-[#ff8a8a] `}>
            {bodyText}
          </Text>

          {/* Delete/Cancel Buttons */}
          <View className="flex-row mt-4 mb-2">
            <Button
              additionalStyleContainer="w-[50%] mr-1 active:opacity-70"
              onPress={handleDelete}
              backgroundColor={"#ff8a8a"}
              text="Delete"
            />
            <Button
              additionalStyleContainer="w-[50%] ml-1 active:opacity-70"
              onPress={handleClose}
              backgroundColor={"#5a5761"}
              text="Cancel"
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
export default DeleteModal;
