"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AWAIT_IN_MILLISECONDS } from "@/constants/primitives";
import CacheKeys from "@/services/cache-keys";
import { waitForCometChatInitialization } from "@/services/chat/comet-chat-message.service";
import { StaffType } from "@/types/types";
import { fetchStaffChats } from "@/services/chat/comet-chat-staff-list.service";
import { router } from "expo-router";

export function useStaffChat() {
  const [staffSearch, setStaffSearch] = useState("");
  const debouncedStaffSearchKey = useDebouncedValue(
    staffSearch,
    AWAIT_IN_MILLISECONDS
  )[0];
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (staffSearch.trim().length > 0) {
      setSelectedUser(null);
    }
  }, [staffSearch]);

  useEffect(() => {
    const initializeCometChat = async () => {
      await waitForCometChatInitialization();
      setIsInitialized(true);
    };
    initializeCometChat();
  }, []);

  const handleUserSelect = (user: string | null) => {
    setSelectedUser(user);
    if (user) {
      router.push({
        pathname: "/(home)/(selectedUserId)",
        params: { selectedUserId: user },
      });
    }
  };

  const { data: staffChat, isLoading: isStaffChatLoading } = useQuery<
    StaffType[],
    Error
  >({
    queryKey: [CacheKeys.STAFF_CHAT_LIST_CACHE_KEY, debouncedStaffSearchKey],
    queryFn: () => fetchStaffChats(debouncedStaffSearchKey),
    enabled: isInitialized,
  });
  const totalUnreadStaffChatCount = staffChat?.reduce(
    (sum, user) => sum + (user.unreadMessagesCount || 0),
    0
  );

  return {
    staffSearch,
    setStaffSearch,
    debouncedStaffSearchKey,
    selectedUser,
    handleUserSelect,
    staffChat: staffChat ?? [],
    isStaffChatLoading,
    totalUnreadStaffChatCount,
  };
}
