import { useQuery } from "@tanstack/react-query";
import CalendarService from "@/services/calendar.service";
import CacheKeys from "@/services/cache-keys";
import { BookingStatus } from "@/types/backend-types";
import { AWAIT_IN_MILLISECONDS, FILTER_TYPES } from "@/constants/primitives";
import { useDebouncedValue } from "./use-debounced-value";

export const useCalendarData = (
  localStartDate: Date,
  localEndDate: Date,
  selectedFilter: string | undefined,
  selectedValue: string | null | undefined,
  search: string
) => {
  const [debouncedSearch] = useDebouncedValue(search, AWAIT_IN_MILLISECONDS);
  const {
    data: calendarData,
    isLoading: isLoadingCalendarData,
    refetch: refetchCalendarData,
  } = useQuery({
    queryKey: [
      CacheKeys.CALENDAR_CACHE_KEY,
      localStartDate.toISOString(),
      localEndDate.toISOString(),
      selectedFilter,
      selectedValue,
      debouncedSearch,
    ],
    queryFn: () =>
      CalendarService.getCalendar({
        startDate: localStartDate.toISOString(),
        endDate: localEndDate.toISOString(),
        search: debouncedSearch,
        ...(selectedFilter === FILTER_TYPES.SURGEON && {
          surgeonId: selectedValue ?? undefined,
        }),
        ...(selectedFilter === FILTER_TYPES.CATEGORY && {
          surgeryCode: selectedValue ?? undefined,
        }),
        ...(selectedFilter === FILTER_TYPES.STATUS && {
          status: selectedValue as BookingStatus,
        }),
      }),
  });

  const {
    data: calendarEvent,
    isLoading: isLoadingCalendarEvent,
    refetch: refetchCalendarEvent,
  } = useQuery({
    queryKey: [
      CacheKeys.CALENDAR_EVENT_CACHE_KEY,
      localStartDate.toISOString(),
      localEndDate.toISOString(),
    ],
    queryFn: () =>
      CalendarService.getEvent({
        startDate: localStartDate.toISOString(),
        endDate: localEndDate.toISOString(),
      }),
  });

  return {
    calendarData,
    isLoadingCalendarData,
    calendarEvent,
    isLoadingCalendarEvent,
    refetchCalendarData,
    refetchCalendarEvent,
  };
};
