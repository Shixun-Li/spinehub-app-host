import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import ChatTab from "@/components/chat/chat-tabs";
import { ChatsTab } from "@/types/types";
import SearchInput from "@/components/core/search-input";
import { useChatContext } from "@/components/chat/comet-chat-list-provider";
import PatientsGroupList from "@/components/chat/patient-group-list";
import StaffList from "@/components/chat/staff-list";
import { useLocalSearchParams } from "expo-router";

const Chats = () => {
  const {
    search,
    setSearch,
    groups,
    isLoading,
    selectedGroup,
    handleGroupSelect,
    staffSearch,
    setStaffSearch,
    selectedUser,
    handleUserSelect,
    staffChat,
    isStaffChatLoading,
  } = useChatContext();
  const { tab } = useLocalSearchParams<{ tab?: ChatsTab }>();
  const [selectedTab, setSelectedTab] = useState<ChatsTab>(
    tab === "Staff" ? "Staff" : "Patient"
  );
  useEffect(() => {
    if (selectedGroup) handleGroupSelect(null);
    if (selectedUser) handleUserSelect(null);
  }, []);
  return (
    <View style={styles.body}>
      <HomeHeader title="Chats" />
      <View style={styles.chatContainer}>
        <ChatTab chatTab={selectedTab} setChatTab={setSelectedTab} />
        {selectedTab === "Patient" && (
          <SearchInput value={search} onChange={setSearch} />
        )}
        {selectedTab === "Staff" && (
          <SearchInput value={staffSearch} onChange={setStaffSearch} />
        )}
        {selectedTab === "Patient" && (
          <PatientsGroupList
            groups={groups}
            isLoading={isLoading}
            selectedGroup={selectedGroup}
            onGroupSelect={handleGroupSelect}
          />
        )}
        {selectedTab === "Staff" && (
          <StaffList
            staffChat={staffChat}
            isStaffChatLoading={isStaffChatLoading}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
          />
        )}
      </View>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
  },
  chatContainer: {
    gap: 16,
  },
});
