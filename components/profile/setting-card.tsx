import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";
import RightArrowIcon from "@/assets/svgs/icons/right-arrow-icon";

interface SettingCardProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

const SettingCard = ({ icon, label, onPress }: SettingCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.iconWrapper}>{icon}</View>
        <AppText color="navy1000" fontWeight="medium" size={16} align="left">
          {label}
        </AppText>
      </View>
      <View>
        <RightArrowIcon />
      </View>
    </TouchableOpacity>
  );
};

export default SettingCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    padding: 8,
    backgroundColor: COLORS.lightBlue1000,
    borderRadius: 22,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
