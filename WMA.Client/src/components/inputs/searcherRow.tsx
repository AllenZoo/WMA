import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
import {
  IconAddButton,
  IconFilterButton,
} from "@/components/buttons/IconButton";
import TextBox from "@/components/inputs/TextBox";
import Button from "@/components/buttons/Button";

interface SearcherRowProps {
  searchRef?: React.RefObject<TextInput>;
  onSearchChange: (text: string) => void;
  onAddPress: () => void;
  onFilterPress: () => void;
  showClearFilter?: boolean;
  onClearFilter?: () => void;
  placeholder?: string;
}

const SearcherRow = ({
  searchRef,
  onSearchChange,
  onAddPress,
  onFilterPress,
  showClearFilter = false,
  onClearFilter,
  placeholder = "Search",
}: SearcherRowProps) => {
  const [searchText, setSearchText] = React.useState("");

  return (
    <>
      {/* Search Bar Container */}
      <View className="w-full" key={"searcher-row"}>
        {/* Buttons + Search Bar */}
        <View className="flex-row justify-between px-2 mb-2 w-full">
          <IconAddButton onPress={onAddPress} iconSize={38} />
          <TextBox
            value={searchText}
            ref={searchRef || undefined}
            onErrors={(state: boolean) => {
              // Handle errors if needed
            }}
            onChangeText={(text) => {
              setSearchText(text);
              onSearchChange(text);
            }}
            placeholder={placeholder}
            widthPercent="64"
          />
          <IconFilterButton onPress={onFilterPress} iconSize={38} />
        </View>

        {/* Clear Filter Button */}
        {showClearFilter && (
          <View className="flex-row justify-center px-2 mb-2">
            <Button
              text="Clear Filter"
              additionalStyleContainer="bg-red-500 w-full h-8 py-0"
              onPress={() => {
                onClearFilter && onClearFilter();
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};
export default SearcherRow;
