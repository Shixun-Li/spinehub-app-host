"use client";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import InvalidateKeys from "@/services/invalidate-keys";
import { MediaMessageData, MessageType } from "@/types/types";
import { getCurrentUserId } from "@/services/chat/comet-chat-users.service";
import { markAllMessagesAsRead } from "@/services/chat/comet-chat-staff-list.service";
import { removeMessageListener } from "@/services/chat/comet-chat-message.service";
import ChatConversation from "./\bchat-conversation";
import StaffChatInput from "./staff-chat-input";
import StaffChatHeader from "./staff-chat-header";
import { router } from "expo-router";
import ChatLoader from "./chat-loader";
import { addMessageListener } from "@/services/chat/comet-chat-safe.service";

type StaffChatWindowProps = {
  selectedUser: string | null;
  messages: MessageType[];
  setMessages: (
    messages: MessageType[] | ((prev: MessageType[]) => MessageType[])
  ) => void;
  isLoading: boolean;
};

const StaffChatWindow = ({
  selectedUser,
  messages,
  setMessages,
  isLoading,
}: StaffChatWindowProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const listenerId = `listener_${selectedUser}`;

    const handleNewMessage = async (newMessage: CometChat.BaseMessage) => {
      const sender = newMessage.getSender?.();
      const senderId = sender?.getUid?.() || "";
      if (senderId !== selectedUser) return;
      const type = newMessage.getType?.();
      const sentAt = newMessage.getSentAt?.() ?? Date.now();

      const base: MessageType = {
        id: String(newMessage.getId()),
        text: "[Unsupported message type]",
        senderId: sender?.getUid() || "",
        senderName: sender?.getName() || "",
        sentAt,
      };

      if (type === "text") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...base,
            text: (newMessage as CometChat.TextMessage).getText?.() || "",
          },
        ]);
      } else if (type === "file") {
        const media = newMessage as CometChat.MediaMessage;
        const data = media.getData?.() as MediaMessageData;
        const attachment = data?.attachments?.[0];
        const caption = data?.metadata?.caption || "";

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...base,
            text: caption || "[Media File]",
            fileUrl: attachment?.url ?? "",
            mimeType: attachment?.mimeType ?? "",
          },
        ]);
      }
      await markAllMessagesAsRead(selectedUser);
      await InvalidateKeys.staffChatList(queryClient);
    };
    addMessageListener(listenerId, handleNewMessage);
    return () => {
      removeMessageListener(listenerId);
    };
  }, [selectedUser, queryClient, setMessages]);

  if (!selectedUser) {
    return null;
  }

  return (
    <>
      <StaffChatHeader
        selectedUser={selectedUser}
        onBack={() => {
          router.replace("/(home)/(tabs)/chats?tab=Staff");
        }}
      />
      {isLoading && <ChatLoader />}
      {!isLoading && (
        <>
          <ChatConversation
            messages={messages}
            currentUserId={currentUserId ?? ""}
          />
          <StaffChatInput
            selectedUserId={selectedUser}
            onMessageSent={(msg: MessageType) =>
              setMessages((prev: MessageType[]) => [...prev, msg])
            }
          />
        </>
      )}
    </>
  );
};

export default StaffChatWindow;
