import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import { useLocalSearchParams } from "expo-router";
import { useChatContext } from "@/components/chat/comet-chat-list-provider";
import { useEffect, useMemo } from "react";
import AppText from "@/components/core/app-text";
import React from "react";
import { getRandomAvatar } from "@/utils/use-random-avatr";
import SelectedPatientHeader from "@/components/chat/selected-\bpatient-header";
import Divider from "@/components/core/\bdivider";
import ThreadCardList from "@/components/chat/render-thread-card";

const SelectThread = () => {
  const { selectedGroupId } = useLocalSearchParams<{
    selectedGroupId: string;
  }>();
  const { groups, handleGroupSelect, selectedGroup } = useChatContext();

  useEffect(() => {
    if (selectedGroupId && groups.length > 0 && !selectedGroup) {
      const matched = groups.find(
        (g: { guid: string }) => g.guid === selectedGroupId
      );
      if (matched) handleGroupSelect(matched.group);
    }
  }, [selectedGroupId, groups]);

  const threads = useMemo(() => {
    if (!selectedGroup) return [];
    const matched = groups.find(
      (g: { guid: string }) => g.guid === selectedGroup.getGuid()
    );
    return matched?.groupThreads || [];
  }, [groups, selectedGroup]);

  const avatarUrl = getRandomAvatar(selectedGroup.getName() ?? "")
    .replace(/^http:/, "https:")
    .replace("/svg?", "/png?");

  const patientId = selectedGroup.getGuid().replace(/^group_/, "");

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <HomeHeader title="Chat Groups" withBackButton route="/chats" />
        <SelectedPatientHeader
          groupName={selectedGroup.getName() ?? "N/A"}
          avatarUrl={avatarUrl}
          patientId={patientId}
          selectedGroup={selectedGroup}
        />
        <Divider text={"Groups"} />
        {threads.length > 0 ? (
          <ThreadCardList threads={threads} selectedGroup={selectedGroup} />
        ) : (
          <AppText>No threads available</AppText>
        )}
      </View>
    </View>
  );
};

export default SelectThread;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
