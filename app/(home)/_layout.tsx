import React from "react";
import { Slot } from "expo-router";
import { ChatListProvider } from "@/components/chat/comet-chat-list-provider";

export default function HomeLayout() {
  return (
    <ChatListProvider>
      <Slot />
    </ChatListProvider>
  );
}
