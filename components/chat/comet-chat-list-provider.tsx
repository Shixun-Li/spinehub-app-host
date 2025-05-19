"use client";
import React, { createContext, useContext } from "react";
import { useChat } from "./use-chat";
import { useStaffChat } from "./use-staff-chat";

const ChatContext = createContext<any>(null);
export const ChatListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    search,
    setSearch,
    groups,
    isLoading,
    selectedGroup,
    handleGroupSelect,
    selectedThread,
    setSelectedThread,
    totalUnreadGroupChatCount,
  } = useChat();

  const {
    staffSearch,
    setStaffSearch,
    selectedUser,
    handleUserSelect,
    staffChat,
    isStaffChatLoading,
    totalUnreadStaffChatCount,
  } = useStaffChat();

  const totalUnreadCount =
    (totalUnreadGroupChatCount ?? 0) + (totalUnreadStaffChatCount ?? 0);

  return (
    <ChatContext.Provider
      value={{
        search,
        setSearch,
        groups,
        isLoading,
        selectedGroup,
        handleGroupSelect,
        selectedThread,
        setSelectedThread,
        staffSearch,
        setStaffSearch,
        selectedUser,
        handleUserSelect,
        staffChat,
        isStaffChatLoading,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
