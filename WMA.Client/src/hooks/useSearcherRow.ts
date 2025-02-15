import { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";

interface UseSearcherRowProps<T> {
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filter: T | null) => void;
  initialFilter?: T | null;
}

export function useSearcherRow<T>({
  onSearch,
  onFilter,
  initialFilter = null,
}: UseSearcherRowProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<T | null>(initialFilter);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const [displayAddModal, setDisplayAddModal] = useState(false);
  const searchTextBoxRef = useRef<TextInput>(null);

  useEffect(() => {
    console.log("Filter state: ", filter);
  }, [filter]);

  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    onSearch?.(searchTerm);
  };

  const handleFilter = (newFilter: T | null) => {
    const isValid = validateFilter(newFilter);

    if (!isValid) {
      setFilter(null);
    } else {
      setFilter(newFilter);
    }

    onFilter?.(newFilter);
  };

  // Concatenate the current filter with the new filter
  const addFilter = (newFilter: T) => {
    const combinedFilter = { ...filter, ...newFilter };
    console.log("Combined filter: ", combinedFilter);
    setFilter(combinedFilter);
    handleFilter(combinedFilter);
  };

  const clearSearch = () => {
    searchTextBoxRef.current?.clear();
    setSearch("");
    onSearch?.("");
  };

  const clearFilter = () => {
    // Note: important that we clear search first, otherwise, filter could be reset again from some other logic that callbacks
    //       from onSearch.
    clearSearch();
    setFilter(null);
    onFilter?.(null);
    console.log("filter after clearing: ", filter);
  };

  const closeFilterModal = () => {
    setDisplayFilterModal(false);
  };

  // Validate if a filter object has at least one non-null or non-empty value.
  const validateFilter = (filter: T | null): boolean => {
    if (!filter || typeof filter !== "object") {
      return false;
    }

    for (const key in filter) {
      const value = (filter as Record<string, unknown>)[key];

      if (value !== null) {
        // Check if the value is a non-empty array
        if (Array.isArray(value)) {
          if (value.length > 0) {
            return true;
          }
        } else {
          return true;
        }
      }
    }

    return false;
  };

  return {
    search,
    filter,
    displayFilterModal,
    displayAddModal,
    searchTextBoxRef,
    updateSearch,
    handleFilter,
    addFilter,
    clearFilter,
    closeFilterModal,
    setDisplayFilterModal,
    setDisplayAddModal,
  };
}
