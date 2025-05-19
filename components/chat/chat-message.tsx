import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { COLORS } from "@/constants/theme";
import { getRandomAvatar } from "@/utils/use-random-avatr";

type Props = {
  author: "self" | "other";
  text?: string;
  time: string;
  name?: string;
  children?: React.ReactNode;
};

const ChatMessage = ({ author, text, time, name, children }: Props) => {
  const isSelf = author === "self";
  const avatarUrl = getRandomAvatar(name ?? "")
    .replace(/^http:/, "https:")
    .replace("/svg?", "/png?");

  return (
    <View
      style={[styles.container, isSelf ? styles.alignEnd : styles.alignStart]}
    >
      <View style={[styles.row, isSelf ? styles.rowEnd : styles.rowStart]}>
        {!isSelf && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}

        <View>
          {!isSelf && <Text style={styles.name}>{name}</Text>}

          <View
            style={[
              styles.messageBubble,
              isSelf ? styles.selfBubble : styles.otherBubble,
            ]}
          >
            {children}
          </View>
        </View>

        {isSelf && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
      </View>

      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: -4,
  },
  rowStart: {
    justifyContent: "flex-start",
  },
  rowEnd: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  name: {
    marginLeft: 2,
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.navy600,
  },
  messageBubble: {
    maxWidth: 250,
    padding: 12,
    borderRadius: 12,
  },
  selfBubble: {
    backgroundColor: COLORS.navy1000,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.navy50,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.navy600,
    marginBottom: 4,
  },
});
