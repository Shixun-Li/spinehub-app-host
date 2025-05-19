import { useEffect } from "react";
import { FlatList, InteractionManager } from "react-native";
import { CalendarItem } from "@/types/backend-types";
import dayjs from "dayjs";

export const useAutoScrollToToday = ({
  calendarData,
  listRef,
  selectedYear,
  selectedMonth,
}: {
  calendarData?: { data?: CalendarItem[] };
  listRef: React.RefObject<FlatList<CalendarItem>>;
  selectedYear: number;
  selectedMonth: number;
}) => {
  useEffect(() => {
    if (!calendarData?.data || !listRef.current) return;

    const today = dayjs().startOf("day");
    const todayStr = today.format("YYYY-MM-DD");

    if (selectedYear !== today.year() || selectedMonth !== today.month() + 1) {
      return;
    }

    const nextAvailableIndex = calendarData.data.findIndex(
      (item) => item.date >= todayStr
    );

    if (
      calendarData.data.length > 0 &&
      nextAvailableIndex >= 0 &&
      nextAvailableIndex < calendarData.data.length
    ) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            index: nextAvailableIndex,
            animated: true,
            viewPosition: 0,
          });
        });
      });
    }
  }, [selectedYear, selectedMonth, calendarData]);
};
