import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { MessageType } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import InvalidateKeys from "@/services/invalidate-keys";
import {
  getMessages,
  markAllMessagesAsRead,
} from "@/services/chat/comet-chat-staff-list.service";
import StaffChatWindow from "@/components/chat/staff-chat-window";

const ThreadChat = () => {
  const { selectedUserId } = useLocalSearchParams<{
    selectedUserId: string;
  }>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId) return;

    setIsLoading(true);
    try {
      let result = await getMessages(selectedUserId);

      if (!result || !Array.isArray(result)) {
        result = [];
      }
      setMessages(result);
      if (result.length > 0) {
        await markAllMessagesAsRead(selectedUserId);
        await InvalidateKeys.staffChatList(queryClient);
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, selectedUserId]);

  useEffect(() => {
    selectedUserId ? fetchMessages() : setMessages([]);
  }, [selectedUserId, fetchMessages]);

  return (
    <View style={styles.body}>
      <StaffChatWindow
        isLoading={isLoading}
        selectedUser={selectedUserId}
        messages={messages}
        setMessages={setMessages}
      />
    </View>
  );
};

export default ThreadChat;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    flex: 1,
  },
});
