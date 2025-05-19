import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { FontWeight } from "@/constants/text";
import { COLORS, Typography } from "@/constants/theme";

type Props = {
  children?: React.ReactNode;
  fontWeight?: FontWeight;
  size?: number;
  align?: "left" | "center" | "right";
  color?: keyof typeof COLORS;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
};

const AppText = ({
  fontWeight = "regular",
  children,
  size = 14,
  align = "left",
  color,
  style,
  onPress,
  multiline,
}: Props) => {
  const getFontFamily = (): string => {
    switch (fontWeight) {
      case "light":
        return Typography.light.fontFamily;
      case "medium":
        return Typography.medium.fontFamily;
      case "bold":
        return Typography.bold.fontFamily;
      case "black":
        return Typography.black.fontFamily;
      case "semiBold":
        return Typography.semiBold.fontFamily;
      case "regular":
        return Typography.regular.fontFamily;
      default:
        return Typography.regular.fontFamily;
    }
  };

  const fontColor = color ? COLORS[color] : COLORS.black;

  return (
    <Text
      onPress={onPress}
      ellipsizeMode={multiline ? undefined : "tail"}
      style={[
        style,
        {
          fontFamily: getFontFamily(),
          fontSize: size ?? 16,
          textAlign: align,
          color: fontColor,
        },
      ]}
    >
      {children}
    </Text>
  );
};
export default AppText;
