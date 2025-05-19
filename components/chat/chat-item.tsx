import PinIcon from "@/assets/svgs/icons/pin-icon";
import { COLORS } from "@/constants/theme";
import { formatLastMessageTime } from "@/utils/formator";
import { getRandomAvatar } from "@/utils/use-random-avatr";
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

type ChatItemProps = {
  isSelected?: boolean;
  name: string;
  members?: number;
  unreadCount?: number;
  pinned: boolean;
  lastMessageTime: string;
  onClick: () => void;
  onLongPress?: () => void;
};

const ChatItem = ({
  isSelected = false,
  name = "Unnamed Group",
  members = 0,
  pinned = false,
  lastMessageTime = "N/A",
  unreadCount,
  onClick,
  onLongPress,
}: ChatItemProps) => {
  const formattedTime =
    lastMessageTime !== "N/A" ? formatLastMessageTime(lastMessageTime) : "";
  const avatarUrl = getRandomAvatar(name ?? "")
    .replace(/^http:/, "https:")
    .replace("/svg?", "/png?");

  return (
    <TouchableOpacity
      onPress={onClick}
      onLongPress={onLongPress}
      style={[styles.container, styles.unselected]}
    >
      <View style={styles.leftSection}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {members !== 0 && (
            <Text style={styles.members}>{members} Members</Text>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>{formattedTime}</Text>
        <View style={styles.badges}>
          {unreadCount !== 0 && unreadCount !== undefined && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 9 ? "+9" : unreadCount}
              </Text>
            </View>
          )}
          {pinned && (
            <View style={styles.pinIcon}>
              <PinIcon />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  unselected: {
    backgroundColor: COLORS.navy50,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  leftSection: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 20,
  },
  nameSection: {
    justifyContent: "center",
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    maxWidth: 150,
  },
  members: {
    fontSize: 10,
    color: "#475569",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 4,
  },
  time: {
    fontSize: 10,
    color: "#64748B",
  },
  badges: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  unreadBadge: {
    backgroundColor: COLORS.navy1000,
    borderRadius: 999,
    padding: 2,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
  },
  pinIcon: {
    backgroundColor: COLORS.lightBlue1000,
    padding: 4,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    width: 18,
    height: 18,
  },
});

export default ChatItem;
