import React from "react";
import { View, Text } from "react-native";
import FilterIcon from "../../../../assets/svgs/filter-icon.svg";
import { TEXT_HEADING_M } from "@/utils/designStyles";
import { IconCloseButton } from "@/components/buttons/IconButton";

interface IFilterModalHeaderProps {
  onClose: () => void;
}

const FilterModalHeader = ({ onClose }: IFilterModalHeaderProps) => {
  return (
    <>
      <View className="flex-row items-center w-full justify-between">
        <View className="flex-row items-center">
          <FilterIcon width={24} height={24} fill="#000" />
          <Text className={`${TEXT_HEADING_M}`}>Filters</Text>
        </View>
        <View>
          <IconCloseButton onPress={onClose} iconSize={18} />
        </View>
      </View>
    </>
  );
};
export default FilterModalHeader;
