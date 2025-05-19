import { FlatList, StyleSheet, View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import {
  APP_HORIZONTAL_PADDING,
  APP_VERTICAL_PADDING,
} from "@/constants/primitives";
import HomeHeader from "@/components/core/home-header";
import MonthSelectModal from "@/components/calendar/month-select-modal";
import FilterModal from "@/components/calendar/filter-modal";
import { CalendarItem, Template } from "@/types/backend-types";
import BookingCard from "@/components/calendar/booking-card";
import { useRef } from "react";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useAutoScrollToToday } from "@/hooks/use-auto-scroll-today";
import CalendarHeader from "@/components/calendar/calendar-header";
import SearchInput from "@/components/core/search-input";

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedValue, setSelectedValue] = useState<string | null | undefined>(
    undefined
  );
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFilterApplied = !!selectedFilter && !!selectedValue;
  const [resetKey, setResetKey] = useState(0);
  const [search, setSearch] = useState("");

  const handleClearFilter = () => {
    setSelectedFilter(undefined);
    setSelectedValue(undefined);
    setSelectedTemplate(undefined);
    setResetKey((prev) => prev + 1);
  };
  const handleFilterSubmit = ({
    filter,
    value,
    template,
  }: {
    filter: string;
    value: string | null | undefined;
    template?: Template | undefined;
  }) => {
    setSelectedFilter(filter);
    setSelectedValue(value);
    setSelectedTemplate(template);
    setFilterModalOpen(false);
  };
  const { localStartDate, localEndDate } = useMemo(() => {
    const start = new Date(selectedYear, selectedMonth - 1, 1);
    const end = new Date(selectedYear, selectedMonth, 0);
    return { localStartDate: start, localEndDate: end };
  }, [selectedYear, selectedMonth]);
  const {
    calendarData,
    isLoadingCalendarData,
    calendarEvent,
    isLoadingCalendarEvent,
    refetchCalendarData,
    refetchCalendarEvent,
  } = useCalendarData(
    localStartDate,
    localEndDate,
    selectedFilter,
    selectedValue,
    search
  );
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchCalendarData();
      await refetchCalendarEvent();
    } finally {
      setIsRefreshing(false);
    }
  };
  const listRef = useRef<FlatList<CalendarItem>>(null!);
  useAutoScrollToToday({ calendarData, listRef, selectedYear, selectedMonth });

  return (
    <View style={styles.container}>
      <HomeHeader />
      <CalendarHeader
        selectedMonth={selectedMonth}
        isFilterApplied={isFilterApplied}
        onMonthPress={() => setModalVisible(true)}
        onFilterPress={() => setFilterModalOpen(true)}
        onClearFilter={handleClearFilter}
      />
      <SearchInput value={search} onChange={setSearch} />

      <FlatList<CalendarItem>
        ref={listRef}
        data={calendarData?.data ?? []}
        keyExtractor={(item, index) => item.date + "-" + index}
        renderItem={({ item }) => {
          const eventsForDate =
            calendarEvent?.data?.find(
              (eventItem) => eventItem.date === item.date
            )?.events ?? [];

          return <BookingCard item={item} events={eventsForDate} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoadingCalendarData || isLoadingCalendarEvent
                ? "Loading..."
                : "No data available."}
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginTop: 10 }}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      <MonthSelectModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onChange={(year, month) => {
          setSelectedYear(year);
          setSelectedMonth(month);
        }}
      />
      <FilterModal
        key={resetKey}
        visible={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        defaultFilter={selectedFilter}
        defaultValue={selectedValue}
        defaultTemplate={selectedTemplate}
        onSubmit={handleFilterSubmit}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    paddingVertical: APP_VERTICAL_PADDING,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});
