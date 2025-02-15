import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface ICheckBoxProps {
  initialChecked?: boolean;
  onValueChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  checkedColor?: string;
  uncheckedColor?: string;
  width?: number;
  height?: number;
}

const CheckBox: React.FC<ICheckBoxProps> = ({
  initialChecked = false,
  onValueChange,
  label,
  disabled = false,
  checkedColor = "#007bff",
  uncheckedColor = "#6c757d",
  width = 22,
  height = 22,
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handlePress = () => {
    if (disabled) return;

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onValueChange?.(newCheckedState);
  };

  const renderCheckboxContent = () => {
    if (disabled)
      return (
        <View style={[styles.checkbox, { width, height, opacity: 0.5 }]}>
          <Text style={[styles.checkboxText, styles.disabledText]}>-</Text>
        </View>
      );

    if (isChecked)
      return (
        <View
          style={[
            styles.checkbox,
            {
              width,
              height,
              backgroundColor: "#007bff",
              borderColor: "#007bff",
            },
          ]}
        >
          <View style={styles.checkmark} />
        </View>
      );

    return (
      <View style={[styles.checkbox, { width, height }]}>
        {/* Empty state */}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      {renderCheckboxContent()}
      {label && (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: "#6c757d",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 14,
    color: "#6c757d",
  },
  disabledText: {
    color: "#888",
  },
  checkmark: {
    width: "50%",
    height: "30%",
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }, { translateX: 1 }, { translateY: -2 }],
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  lockedLabel: {
    color: "#888",
  },
  disabledLabel: {
    color: "#ccc",
  },
});

export default CheckBox;
