import { QueryClient } from "@tanstack/react-query";
import CacheKeys from "./cache-keys";

namespace InvalidateKeys {
  export const calendar = async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({
      queryKey: [CacheKeys.CALENDAR_EVENT_CACHE_KEY],
    });
    await queryClient.refetchQueries({
      queryKey: [CacheKeys.CALENDAR_CACHE_KEY],
    });
    await queryClient.invalidateQueries({
      queryKey: [CacheKeys.BOOKING_DETAIL_CACHE_KEY],
    });
    await queryClient.refetchQueries({
      queryKey: [CacheKeys.BOOKING_DETAIL_CACHE_KEY],
    });
  };
  export const patient = async (queryClient: QueryClient) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.PATIENTS_CACHE_KEY],
      }),
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.PATIENT_CACHE_KEY],
      }),
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.PATIENT_CHAT_LIST_CACHE_KEY],
      }),
    ]);
  };
  export const chatList = async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({
      queryKey: [CacheKeys.PATIENT_CHAT_LIST_CACHE_KEY],
    });
  };

  export const staffChatList = async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({
      queryKey: [CacheKeys.STAFF_CHAT_LIST_CACHE_KEY],
    });
  };
}

export default InvalidateKeys;
