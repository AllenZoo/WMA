import { useState } from "react";

function useModal<T>() {
  type ModalState = { visible: false; data: null } | { visible: true; data: T };

  const [state, setState] = useState<ModalState>({
    visible: false,
    data: null,
  });

  const openModal = (data: T) => {
    setState({ visible: true, data });
  };

  const closeModal = () => {
    setState({ visible: false, data: null });
  };

  return {
    ...state,
    openModal,
    closeModal,
  };
}

export default useModal;
