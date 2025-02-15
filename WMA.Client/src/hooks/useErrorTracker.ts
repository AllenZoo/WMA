import { useState, useCallback } from "react";

const useErrorTracker = (initialErrorCount: number) => {
  const [errors, setErrors] = useState<boolean[]>(
    Array(initialErrorCount).fill(true)
  );
  const [hasErrors, setHasErrors] = useState<boolean>(true);

  const handleErrors = (
    setErrors: React.Dispatch<React.SetStateAction<boolean[]>>,
    errors: boolean[],
    state: boolean,
    i: number
  ) => {
    const newErrors = [...errors];
    newErrors[i] = state;
    setErrors(newErrors);
    setHasErrors(newErrors.includes(true));
  };

  const onErrors = useCallback(
    (state: boolean, i: number) => {
      handleErrors(setErrors, errors, state, i);
    },
    [errors]
  );

  const resetErrorState = () => {
    setErrors(Array(initialErrorCount).fill(true));
    setHasErrors(true);
  };

  return { errors, hasErrors, onErrors, resetErrorState };
};

export default useErrorTracker;
