import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Thread } from "@/types/types";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import ThreadCard from "./\bthread-card";
import { getGroupMembers } from "@/services/chat/comet-chat-safe.service";

type Props = {
  threads: Thread[];
  selectedGroup: CometChat.Group;
};

const ThreadCardList = ({ threads, selectedGroup }: Props) => {
  const [membersMap, setMembersMap] = useState<
    Record<string, CometChat.User[]>
  >({});

  useEffect(() => {
    const fetchAllMembers = async () => {
      const results = await Promise.all(
        threads.map((thread) =>
          getGroupMembers(selectedGroup, thread.text)
            .then((members) => ({ [thread.text]: members }))
            .catch(() => ({ [thread.text]: [] }))
        )
      );
      const merged = Object.assign({}, ...results);
      setMembersMap(merged);
    };
    fetchAllMembers();
  }, [threads, selectedGroup]);

  return (
    <FlatList
      data={threads}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <ThreadCard
          thread={item}
          index={index}
          selectedGroup={selectedGroup}
          groupMembers={membersMap[item.text] ?? []}
          selectedGroupId={selectedGroup.getGuid()}
        />
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
    />
  );
};

export default ThreadCardList;

const styles = StyleSheet.create({
  list: {
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
});
