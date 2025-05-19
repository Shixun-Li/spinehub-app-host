import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useChatContext } from "@/components/chat/comet-chat-list-provider";
import ThreadHeaderContent from "@/components/chat/thread-header-content";
import { MessageType } from "@/types/types";
import { getCurrentUserId } from "@/services/chat/comet-chat-users.service";
import {
  markThreadMessagesAsRead,
  removeMessageListener,
} from "@/services/chat/comet-chat-message.service";
import ChatConversation from "@/components/chat/\bchat-conversation";
import ChatInput from "@/components/chat/chat-input";
import ChatLoader from "@/components/chat/chat-loader";
import InvalidateKeys from "@/services/invalidate-keys";
import { useQueryClient } from "@tanstack/react-query";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  addMessageListener,
  getThreadMessages,
} from "@/services/chat/comet-chat-safe.service";

const ThreadChat = () => {
  const { threadId } = useLocalSearchParams<{
    threadId: string;
  }>();
  const [threadMessages, setThreadMessages] = useState<MessageType[] | null>(
    null
  );
  const { selectedThread, selectedGroup } = useChatContext();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleBack = () => {
    router.replace("/(home)/(tabs)/chats");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const uid = await getCurrentUserId();
      setCurrentUserId(uid);
    };
    fetchUser();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedGroup || !selectedThread) return;
    try {
      let result = await getThreadMessages(
        selectedGroup.getGuid(),
        selectedThread.toLowerCase()
      );
      if (result === "tryAgain") {
        result = await getThreadMessages(
          selectedGroup.getGuid(),
          selectedThread.toLowerCase()
        );
      }
      if (result && typeof result === "object") {
        setThreadMessages(result.replies ?? []);
        markThreadMessagesAsRead(
          selectedGroup.getGuid(),
          Number(result.parentMessageId)
        );
        await InvalidateKeys.chatList(queryClient);
      } else {
        setThreadMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setThreadMessages([]);
    }
  }, [selectedGroup, selectedThread, setThreadMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!selectedGroup || !threadId) return;

    const listenerId = `listener_${threadId}`;

    const handleIncomingMessage = async (newMessage: CometChat.TextMessage) => {
      const parentId = String(newMessage?.getParentMessageId?.() ?? "");
      if (parentId !== threadId) return;

      const sender = newMessage.getSender?.();
      const type = newMessage.getType?.();
      const sentAt = newMessage.getSentAt?.() ?? Date.now();

      const base: MessageType = {
        id: String(newMessage.getId()),
        text: "[Unsupported message type]",
        senderId: sender?.getUid() || "",
        senderName: sender?.getName() || "",
        sentAt,
        parentMessageId: parentId,
      };

      if (type === "text") {
        setThreadMessages((prev: MessageType[] | null) => [
          ...(prev ?? []),
          {
            ...base,
            text: newMessage.getText?.() || "",
          },
        ]);
      } else if (type === "file") {
        const data = newMessage.getData?.();
        const attachment = data?.attachments?.[0];
        const caption = data?.metadata?.caption || "";

        setThreadMessages((prev: MessageType[] | null) => [
          ...(prev ?? []),
          {
            ...base,
            text: caption || "[Media File]",
            fileUrl: attachment?.url ?? "",
            mimeType: attachment?.mimeType ?? "",
          },
        ]);
      }

      markThreadMessagesAsRead(selectedGroup.getGuid(), Number(threadId));
    };

    addMessageListener(listenerId, handleIncomingMessage);
    return () => removeMessageListener(listenerId);
  }, [selectedGroup, threadId, setThreadMessages]);

  if (!selectedGroup || !threadId) return null;
  const patientId = selectedGroup.getGuid().replace(/^group_/, "");

  return (
    <View style={styles.body}>
      <ThreadHeaderContent
        title={selectedThread}
        selectedGroup={selectedGroup.getName()}
        patientId={patientId}
        onBack={handleBack}
      />
      {threadMessages === null ? (
        <ChatLoader />
      ) : (
        <>
          <ChatConversation
            messages={threadMessages}
            currentUserId={currentUserId ?? ""}
          />
          <ChatInput
            selectedGroupId={selectedGroup.getGuid()}
            parentMessageId={Number(threadId)}
            onMessageSent={(msg: MessageType) =>
              setThreadMessages((prev) => [...(prev ?? []), msg])
            }
          />
        </>
      )}
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
