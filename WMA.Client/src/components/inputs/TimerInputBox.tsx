import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TimerPicker, TimerPickerModal } from "react-native-timer-picker";

interface ITimerInputBoxProps {
  styles?: string;
}

const TimerInputBox: React.FC<ITimerInputBoxProps> = ({ styles }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showTimerModal, setShowTimerModal] = useState(false);

  const handleTimeChange = (newTime: { minutes: number; seconds: number }) => {
    setMinutes(newTime.minutes);
    setSeconds(newTime.seconds);
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          setShowTimerModal(true);
        }}
      >
        <View
          className={`w-16 rounded-2xl border-[#a8b7c8] 
            focus:border-light-border border-2 text-xl bg-light-background dark:bg-dark-background 
            text-light-foreground dark:text-dark-foreground ${styles}
            text-center items-center`}
        >
          <Text className="py-1 px-1">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Text>
        </View>
      </Pressable>

      <TimerPickerModal
        hideHours
        onConfirm={function ({
          hours,
          minutes,
          seconds,
        }: {
          hours: number;
          minutes: number;
          seconds: number;
        }): void {
          handleTimeChange({ minutes, seconds });
          setShowTimerModal(false);
        }}
        onCancel={() => {
          setShowTimerModal(false);
        }}
        setIsVisible={function (isVisible: boolean): void {}}
        maximumMinutes={20}
        padMinutesWithZero={false}
        padSecondsWithZero={false}
        disableInfiniteScroll
        visible={showTimerModal}
      />
    </View>
  );
};

export default TimerInputBox;
