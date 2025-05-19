import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ChatItem from "./chat-item";
import { StaffType } from "@/types/types";
type StaffListProps = {
  staffChat: StaffType[];
  selectedUser: string | null;
  onUserSelect: (user: string | null) => void;
  isStaffChatLoading: boolean;
};

export default function StaffList({
  staffChat,
  selectedUser,
  onUserSelect,
  isStaffChatLoading,
}: StaffListProps) {
  const renderItem = ({ item }: { item: StaffType }) => {
    const { uid, name, unreadMessagesCount, lastMessage, isPinned } = item;
    return (
      <ChatItem
        isSelected={selectedUser === uid}
        name={name || "Unnamed Staff"}
        unreadCount={unreadMessagesCount}
        pinned={isPinned}
        lastMessageTime={
          lastMessage?.updatedAt
            ? new Date(lastMessage.updatedAt * 1000).toLocaleString()
            : "N/A"
        }
        onClick={() => onUserSelect(uid)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isStaffChatLoading && <Text style={styles.emptyText}>Loading...</Text>}
      {!isStaffChatLoading && staffChat.length === 0 && (
        <Text style={styles.emptyText}>No Staff Chat found</Text>
      )}
      <FlatList
        data={staffChat}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#718096",
    marginTop: 10,
  },
});
