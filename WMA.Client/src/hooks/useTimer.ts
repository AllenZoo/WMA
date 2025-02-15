import { useState } from "react";

// TODO: return time in HH:MM:SS format

export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

const useTimer = (initialTime: Time) => {
  const [time, setTime] = useState<Time>(initialTime);
  const [running, setRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number>(0);

  const timeToSeconds = (time: Time): number => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  };

  const secondsToTime = (seconds: number): Time => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return { hours, minutes, seconds: remainingSeconds };
  };

  var seconds = timeToSeconds(initialTime);
  const startTimer = (initialTime?: Time) => {
    if (running) return;
    setRunning(true);

    const id = setInterval(() => {
      seconds++;
      setTime(secondsToTime(seconds));
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (!running) return;
    setRunning(false);
    clearInterval(intervalId);
  };

  const resetTimer = () => {
    setTime(initialTime);
    stopTimer();
  };

  return { time, running, startTimer, stopTimer, resetTimer };
};
export default useTimer;

// Format time to HH:MM:SS
export const formatTimeString = (time: Time): string => {
  const hasHours = time.hours > 0;

  return `${hasHours ? (time.hours ?? 0).toString() + ":" : ""}${(time.minutes ?? 0).toString().padStart(hasHours ? 2 : 1, "0")}:${(time.seconds ?? 0).toString().padStart(2, "0")}`;
};
