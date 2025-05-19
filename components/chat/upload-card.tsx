import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../core/app-text";
import { COLORS } from "@/constants/theme";

type UploadCardProps = {
  label: string;
  icon: React.ReactNode;
  cardColor: string;
  iconBg: string;
  isSelected: boolean;
  onPress: () => void;
};

const UploadCard = ({
  label,
  icon,
  cardColor,
  iconBg,
  isSelected,
  onPress,
}: UploadCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: cardColor,
          borderWidth: isSelected ? 2 : 0,
          borderColor: COLORS.navy800,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <AppText size={13} fontWeight="semiBold">
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export default UploadCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: "column",
    gap: 8,
    minWidth: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    padding: 8,
    justifyContent: "center",
    borderRadius: 999,
    alignItems: "center",
    height: 62,
    width: 62,
  },
});
