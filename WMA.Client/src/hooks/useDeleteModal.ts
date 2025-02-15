import { useState } from "react";

function useDeleteModal<T>() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState({} as T);

  const showDeleteModal = (toDelete: T) => {
    setIsDeleteModalVisible(true);
    setToDeleteItem(toDelete);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setToDeleteItem({} as T);
  };

  const applyDelete = (onDelete: (item: T) => void) => {
    onDelete(toDeleteItem);
    closeDeleteModal();
  };

  return {
    isDeleteModalVisible,
    toDeleteItem,
    showDeleteModal,
    closeDeleteModal,
    applyDelete,
  };
}
export default useDeleteModal;
