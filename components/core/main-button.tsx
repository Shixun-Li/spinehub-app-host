import { Href, Link } from "expo-router";
import React, { FunctionComponent, ReactNode } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import AppText from "./app-text";
import PressableOpacity from "./pressable-opacity";
import { COLORS } from "@/constants/theme";

type CommonProps = {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  text?: string;
  type?: "primary" | "dark" | "smoke" | "error" | "white";
  size?: "small" | "regular";
  isLoading?: boolean;
  isDisabled?: boolean;
};

type Props = CommonProps & {
  onPress?: () => void;
  href?: Href;
};

const buttonStyle = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.lightBlue1000,
  },
  dark: {
    backgroundColor: COLORS.navy100,
  },
  smoke: {
    backgroundColor: COLORS.smoke100,
  },
  white: {
    backgroundColor: COLORS.smoke1000,
  },
  error: {
    backgroundColor: COLORS.red,
  },
});

const MainButton: FunctionComponent<Props> = ({
  leftIcon,
  rightIcon,
  text,
  type = "primary",
  size = "regular",
  onPress,
  href,
  isLoading,
  isDisabled,
}) => {
  if (href)
    return (
      <Link
        href={href}
        asChild
        disabled={isDisabled}
        style={{
          ...styles.containerDefault,
          ...buttonStyle[type],
          opacity: isDisabled ? 0.6 : 1,
          paddingVertical: size === "regular" ? 16 : 12,
        }}
      >
        <PressableOpacity>
          {isLoading && <ActivityIndicator color={COLORS.smoke1000} />}
          {leftIcon}
          {text && (
            <AppText
              fontWeight={size === "regular" ? "medium" : "regular"}
              size={16}
              color={
                ["primary", "smoke"].includes(type) ? "smoke1000" : "navy1000"
              }
            >
              {text}
            </AppText>
          )}
          {rightIcon}
        </PressableOpacity>
      </Link>
    );

  if (onPress)
    return (
      <PressableOpacity
        style={{
          ...styles.containerDefault,
          ...buttonStyle[type],
          opacity: isDisabled ? 0.6 : 1,
          paddingVertical: size === "regular" ? 16 : 12,
        }}
        disabled={isDisabled}
        onPress={onPress}
      >
        {isLoading && <ActivityIndicator color={COLORS.smoke1000} />}
        {leftIcon}
        {text && (
          <AppText
            fontWeight={size === "regular" ? "medium" : "regular"}
            size={16}
            color={
              ["primary", "smoke"].includes(type) ? "smoke1000" : "navy1000"
            }
          >
            {text}
          </AppText>
        )}
        {rightIcon}
      </PressableOpacity>
    );

  return null;
};

export default MainButton;

const styles = StyleSheet.create({
  containerDefault: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
});
