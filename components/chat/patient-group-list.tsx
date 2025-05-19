import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import ChatItem from "./chat-item";
import { GroupType } from "@/types/types";
import PatientModal from "./patient-modal";

type PatientsGroupListProps = {
  groups: GroupType[];
  isLoading: boolean;
  selectedGroup: CometChat.Group | null;
  onGroupSelect: (group: CometChat.Group | null) => void;
};

export default function PatientsGroupList({
  groups,
  isLoading,
  selectedGroup,
  onGroupSelect,
}: PatientsGroupListProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const renderItem = ({ item }: { item: GroupType }) => {
    const {
      group,
      guid,
      name,
      membersCount,
      unreadMessagesCount,
      lastMessage,
      isPinned,
    } = item;
    const patientId = guid.replace(/^group_/, "");
    return (
      <ChatItem
        key={guid}
        isSelected={selectedGroup?.getGuid() === guid}
        name={name || "Unnamed Group"}
        members={membersCount || 0}
        unreadCount={unreadMessagesCount}
        pinned={isPinned}
        lastMessageTime={
          lastMessage?.timestamp
            ? new Date(lastMessage.timestamp * 1000).toLocaleString()
            : "N/A"
        }
        onClick={() => onGroupSelect(group)}
        onLongPress={() => {
          setSelectedPatient(patientId);
          setModalVisible(true);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <Text style={styles.emptyText}>Loading...</Text>}
      {!isLoading && groups.length === 0 && (
        <Text style={styles.emptyText}>No groups found</Text>
      )}
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.guid}
        contentContainerStyle={styles.listContent}
      />
      {selectedPatient !== "" && (
        <PatientModal
          visible={modalVisible}
          onClose={() => {
            setSelectedPatient("");
            setModalVisible(false);
          }}
          patientId={selectedPatient}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
  },
  listContent: {
    gap: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#718096",
    marginTop: 10,
  },
});
