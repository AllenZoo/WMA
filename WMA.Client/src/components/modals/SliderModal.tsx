import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import Slider from "@react-native-community/slider";
import DarkenedBlurOverlay from "./DarkenedBlurOverlay";
import Button from "../buttons/Button";

interface ISliderModalProps {
  isVisible: boolean;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  modalTitle?: string;
  onSave: (value: number) => void;
  onCancel: () => void;
}

const SliderModal: React.FC<ISliderModalProps> = ({
  isVisible,
  min,
  max,
  step,
  initialValue,
  modalTitle = "Slider Modal",
  onSave,
  onCancel,
}) => {
  const [prevValue, setPrevValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);

  const handleSave = () => {
    onSave(tempValue);
    setPrevValue(tempValue);
  };

  const handleCancel = () => {
    setTempValue(prevValue);
    onCancel();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <DarkenedBlurOverlay>
        <Pressable
          style={({ pressed }) => [
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "transparent",
            },
          ]}
          onPress={handleCancel}
        >
          {/* Stops the press propogation here. Eg. if  we click in the modal the onPress event doesn't trigger. */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="flex-1 justify-center items-center">
              <View className="bg-white rounded-lg p-4 w-11/12 max-w-md">
                <Text className="text-lg font-semibold mb-4">{modalTitle}</Text>
                <Text className="text-center my-2 text-gray-700">
                  Current Value: {tempValue}
                </Text>
                <Slider
                  minimumValue={min}
                  maximumValue={max}
                  step={step}
                  value={tempValue}
                  onValueChange={setTempValue}
                  minimumTrackTintColor="#007bff"
                  maximumTrackTintColor="#e0e0e0"
                />

                <View className="flex-row justify-center mt-4">
                  <Button
                    onPress={handleSave}
                    text="Confirm"
                    additionalStyleContainer="w-[40%] mr-2"
                  />
                  <Button
                    onPress={handleCancel}
                    text="Cancel"
                    additionalStyleContainer="w-[40%]"
                    useAlt
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </DarkenedBlurOverlay>
    </Modal>
  );
};
export default SliderModal;
