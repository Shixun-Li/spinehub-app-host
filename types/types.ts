import { CometChat } from "@cometchat/chat-sdk-react-native";
import { BookingDetailsTabEnum, PatientDetailsTabEnum } from "./\benum";

export type OrderBookingColumn = "firstName" | undefined;
export type BookingDetailsTab = keyof typeof BookingDetailsTabEnum;
export type PatientDetailsTab = keyof typeof PatientDetailsTabEnum;
export type ChatsTab = "Patient" | "Staff";

export type ThreadData = {
  id: number;
  text: string;
  unreadCount: number;
  isSelected: boolean;
};

export type MessageType = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  sentAt: number;
  parentMessageId?: string;
  fileUrl?: string;
  mimeType?: string;
};

export type StaffMessageType = {
  id: string;
  text: string;
  senderId: string;
};

export type MediaMessageData = {
  url?: string;
  attachments?: {
    name: string;
    extension: string;
    size: number;
    mimeType: string;
    url: string;
  }[];
  metadata?: {
    caption?: string;
    readStatus?: Record<string, boolean>;
  };
};

export type StaffType = {
  uid: string;
  name: string;
  unreadMessagesCount?: number;
  lastMessage?: {
    updatedAt?: number;
    timestamp?: number;
  };
  isPinned: boolean;
};

export type Thread = {
  id: number;
  text: string;
  unreadCount: number;
  timestamp?: number;
};

export type GroupType = {
  group: CometChat.Group;
  guid: string;
  name: string;
  membersCount?: number;
  unreadMessagesCount?: number;
  lastMessage?: {
    text: string;
    sender: string;
    timestamp: number;
  } | null;
  isPinned: boolean;
  groupThreads?: {
    id: number;
    text: string;
    unreadCount: number;
    timestamp: number;
    isSelected?: boolean;
  }[];
};
export type DocType = "Document" | "Photo" | "Link";

export type RNFile = {
  uri: string;
  name: string;
  type: string;
};
export type CometchatConversationList = CometChat.Conversation[];
export type CometchatBaseMessage = CometChat.BaseMessage;
export type CometchatTextMessage = CometChat.TextMessage;
export type CometchatUser = CometChat.User;
