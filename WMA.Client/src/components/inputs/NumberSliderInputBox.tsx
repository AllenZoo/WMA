import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import Slider from "@react-native-community/slider";
import SliderModal from "../modals/SliderModal";

interface INumberSliderInputBoxProps {
  styles?: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
}

const NumberSliderInputBox: React.FC<INumberSliderInputBoxProps> = ({
  styles = "",
  min,
  max,
  step,
  initialValue,
  onChange,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);

  const handleSave = (savedValue: number) => {
    onChange(savedValue);
    setTempValue(savedValue);
    setValue(savedValue);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setValue(tempValue);
    setModalVisible(false);
  };

  return (
    <View className={`relative ${styles}`}>
      <Pressable
        onPress={() => setModalVisible(true)}
        className={`w-8 rounded-2xl border-[#a8b7c8] focus:border-light-border border-2 text-xl 
            bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground ${styles}
            py-1 px-1`}
      >
        <View>
          <Text className="text-center">{value}</Text>
        </View>
      </Pressable>

      <SliderModal
        isVisible={isModalVisible}
        min={min}
        max={max}
        step={step}
        initialValue={initialValue}
        modalTitle="Intended RPE"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default NumberSliderInputBox;
