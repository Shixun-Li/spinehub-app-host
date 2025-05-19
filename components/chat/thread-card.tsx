import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppText from "../core/app-text";
import { COLORS } from "@/constants/theme";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { Thread } from "@/types/types";
import { getRandomAvatar } from "@/utils/use-random-avatr";
import { useRouter } from "expo-router";
import { useChatContext } from "./comet-chat-list-provider";
import PulseLoader from "./pulse-loader";

type ThreadCardProps = {
  thread: Thread;
  index: number;
  selectedGroup: CometChat.Group;
  groupMembers: CometChat.User[];
  selectedGroupId: string;
};

const colors = [
  COLORS.lightBlue100,
  COLORS.green100,
  COLORS.yellow100,
  COLORS.pink100,
];

const ThreadCard = ({
  thread,
  index,
  groupMembers,
  selectedGroupId,
}: ThreadCardProps) => {
  const backgroundColor = colors[index % colors.length];
  const router = useRouter();
  const { setSelectedThread } = useChatContext();

  const handlePress = () => {
    setSelectedThread(thread.text);
    router.push({
      pathname: "/(home)/(threadId)",
      params: { threadId: thread.id, selectedGroupId: selectedGroupId },
    });
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor }]}
    >
      <View style={{ gap: 4 }}>
        <AppText size={16} fontWeight="semiBold">
          {thread.text}
        </AppText>
        <AppText size={12} fontWeight="medium" color="navy600">
          {thread.unreadCount === 0
            ? "Caught up!"
            : `${thread.unreadCount} New Messages`}
        </AppText>
      </View>
      <View style={styles.avatarRow}>
        {groupMembers.length === 0
          ? Array.from({ length: 2 }).map((_, idx) => <PulseLoader key={idx} />)
          : groupMembers.slice(0, 3).map((member) => {
              const avatar = getRandomAvatar(member.getName() || "")
                .replace(/^http:/, "https:")
                .replace("/svg?", "/png?");
              return (
                <Image
                  key={member.getUid()}
                  source={{ uri: avatar }}
                  style={styles.avatar}
                />
              );
            })}
        {groupMembers.length > 6 && (
          <AppText size={14} fontWeight="medium" style={{ marginLeft: 8 }}>
            ...
          </AppText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ThreadCard;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 8,
    minHeight: 100,
    justifyContent: "space-between",
    height: 150,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
    marginLeft: -8,
  },
});
