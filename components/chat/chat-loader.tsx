import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "@/constants/theme";
import { isSmallDevice } from "@/utils/formator";

const ChatLoader = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderBubble = (
    side: "left" | "right",
    width1: number,
    width2: number
  ) => (
    <View style={[styles.bubbleRow, side === "right" && styles.bubbleRight]}>
      {side === "left" && (
        <Animated.View
          style={[styles.avatar, { transform: [{ scale: pulseAnim }] }]}
        />
      )}
      <View
        style={[
          styles.bubble,
          side === "left" ? styles.bubbleLeftBg : styles.bubbleRightBg,
        ]}
      >
        <Animated.View
          style={[
            styles.pulseBar,
            { width: width1, transform: [{ scale: pulseAnim }] },
          ]}
        />
        <Animated.View
          style={[
            styles.pulseBar,
            { width: width2, marginTop: 8, transform: [{ scale: pulseAnim }] },
          ]}
        />
      </View>
      {side === "right" && (
        <Animated.View
          style={[styles.avatar, { transform: [{ scale: pulseAnim }] }]}
        />
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.chatBody}>
        {renderBubble("left", 120, 80)}
        {renderBubble("right", 100, 60)}
        {renderBubble("right", 100, 60)}
        {renderBubble("left", 140, 120)}
        {renderBubble("left", 140, 120)}
        {renderBubble("right", 100, 60)}
      </View>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.pulseBar,
            { width: 100, height: 12, transform: [{ scale: pulseAnim }] },
          ]}
        />
      </View>
    </View>
  );
};

export default ChatLoader;

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 400,
    height: isSmallDevice ? "85%" : "90%",
    justifyContent: "space-between",
  },

  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#CCC",
  },
  headerTextBox: {
    justifyContent: "center",
    gap: 4,
  },
  chatBody: {
    flex: 1,
    paddingVertical: 16,
    gap: 16,
    justifyContent: "flex-start",
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  bubbleRight: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D0D0D0",
  },
  bubble: {
    maxWidth: 280,
    padding: 12,
    borderRadius: 12,
  },
  bubbleLeftBg: {
    backgroundColor: "#E0E0E0",
    borderTopLeftRadius: 4,
  },
  bubbleRightBg: {
    backgroundColor: COLORS.navy1000,
    borderTopRightRadius: 4,
  },
  pulseBar: {
    height: 10,
    backgroundColor: "#C0C0C0",
    borderRadius: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.navy50,
    borderRadius: 12,
    padding: 16,
    height: 50,
  },

  iconButton: {
    backgroundColor: COLORS.lightBlue1000,
    padding: 10,
    justifyContent: "center",
    borderRadius: 999,
    alignItems: "center",
    height: 28,
    width: 28,
  },
});
