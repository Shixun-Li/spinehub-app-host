"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AWAIT_IN_MILLISECONDS } from "@/constants/primitives";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { router } from "expo-router";
import {
  initializeCometChatListeners,
  removeCometChatListeners,
  waitForCometChatInitialization,
} from "@/services/chat/comet-chat-message.service";
import { fetchUserGroupChats } from "@/services/chat/comet-chat-list.service";
import InvalidateKeys from "@/services/invalidate-keys";
import { GroupType } from "@/types/types";

export function useChat() {
  const [search, setSearch] = useState("");
  const debouncedSearchKey = useDebouncedValue(
    search,
    AWAIT_IN_MILLISECONDS
  )[0];
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | null>(
    null
  );
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const selectedThreadRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  const GUID = selectedGroup?.getGuid() ?? "";

  useEffect(() => {
    const initializeCometChat = async () => {
      setIsInitializing(true);
      await waitForCometChatInitialization();
      setIsInitialized(true);
      setIsInitializing(false);
    };
    initializeCometChat();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    initializeCometChatListeners(queryClient);
    return () => removeCometChatListeners();
  }, [queryClient, GUID, isInitialized]);

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery<
    GroupType[],
    Error
  >({
    queryKey: [CacheKeys.PATIENT_CHAT_LIST_CACHE_KEY, debouncedSearchKey],
    queryFn: () => fetchUserGroupChats(debouncedSearchKey),
    enabled: isInitialized,
  });
  const isLoading = isInitializing || isGroupsLoading;

  const totalUnreadGroupChatCount = groups.reduce(
    (sum: number, group: GroupType) => sum + (group.unreadMessagesCount || 0),
    0
  );

  useEffect(() => {
    if (!groups.length || !selectedGroup || !selectedThreadRef.current) return;

    const foundGroup = groups.find(
      (g: GroupType) => g.guid === selectedGroup?.getGuid()
    );
    if (foundGroup) {
      const threads = foundGroup.groupThreads ?? [];
      const stillExists = threads.some(
        (thr) =>
          thr.text.toLowerCase() === selectedThreadRef.current?.toLowerCase()
      );
      if (!stillExists) {
        setSelectedThread(threads[0]?.text ?? null);
      }
    } else {
      setSelectedGroup(null);
      setSelectedThread(null);
    }
  }, [groups, selectedGroup]);

  useEffect(() => {
    setSelectedGroup(null);
    setSelectedThread(null);
  }, [debouncedSearchKey]);

  const handleGroupSelect = async (group: CometChat.Group | null) => {
    setSelectedGroup(group);
    if (group) {
      const matchedGroupData = groups.find(
        (g: GroupType) => g.guid === group.getGuid()
      );
      setSelectedThread(matchedGroupData?.groupThreads?.[0]?.text ?? null);
      router.push({
        pathname: "/(home)/(selectedGroupId)",
        params: { selectedGroupId: group.getGuid() },
      });
      await InvalidateKeys.chatList(queryClient);
    } else {
      setSelectedThread(null);
    }
  };

  return {
    search,
    setSearch,
    groups,
    isLoading,
    selectedGroup,
    handleGroupSelect,
    selectedThread,
    setSelectedThread,
    totalUnreadGroupChatCount,
  };
}
