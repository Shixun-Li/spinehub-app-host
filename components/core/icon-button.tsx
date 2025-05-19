import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./app-text";
import { COLORS } from "@/constants/theme";

type IconButtonProps = {
  backgroundColor: string;
  text?: string;
  textColor?: keyof typeof COLORS;
  icon: React.ReactNode;
  maxWidth?: number;
  onPress?: () => void;
};

const IconButton = ({
  backgroundColor,
  text,
  textColor = "black",
  icon,
  maxWidth = 100,
  onPress,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor, maxWidth }]}
      activeOpacity={0.8}
    >
      {icon}
      {text && (
        <AppText color={textColor} size={12} fontWeight="semiBold">
          {text}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
