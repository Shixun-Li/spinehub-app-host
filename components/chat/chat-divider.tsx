import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "@/constants/theme";

type ChatDividerProps = {
  date: string;
};

const ChatDivider = ({ date }: ChatDividerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.date}>{date}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default ChatDivider;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.navy200,
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy400,
  },
});
