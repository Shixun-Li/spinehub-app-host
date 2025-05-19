import React from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "@/components/core/icon-button";
import { COLORS } from "@/constants/theme";
import MonthSelectIcon from "@/assets/svgs/icons/month-select-icon";
import FilterIcon from "@/assets/svgs/icons/filter-icon";
import FilterBackIcon from "@/assets/svgs/icons/filter-back-icon";
import { monthNames } from "@/constants/text";

type Props = {
  selectedMonth: number;
  isFilterApplied: boolean;
  onMonthPress: () => void;
  onFilterPress: () => void;
  onClearFilter: () => void;
};

const CalendarHeader = ({
  selectedMonth,
  isFilterApplied,
  onMonthPress,
  onFilterPress,
  onClearFilter,
}: Props) => {
  return (
    <View style={styles.headerButton}>
      <IconButton
        backgroundColor={COLORS.navy1000}
        text={monthNames[selectedMonth - 1]}
        textColor="smoke1000"
        icon={<MonthSelectIcon />}
        maxWidth={100}
        onPress={onMonthPress}
      />
      {!isFilterApplied ? (
        <IconButton
          backgroundColor={COLORS.navy50}
          text="Filter"
          textColor="navy1000"
          icon={<FilterIcon />}
          maxWidth={85}
          onPress={onFilterPress}
        />
      ) : (
        <>
          <IconButton
            backgroundColor={COLORS.lightBlue100}
            text="Filter"
            textColor="navy1000"
            icon={<FilterIcon />}
            maxWidth={85}
            onPress={onFilterPress}
          />
          <IconButton
            backgroundColor={COLORS.lightBlue100}
            icon={<FilterBackIcon />}
            maxWidth={20}
            onPress={onClearFilter}
          />
        </>
      )}
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
});
